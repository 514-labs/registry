#!/usr/bin/env bash

# Connector Factory installer
#
# Responsibilities:
# - Download the 514-labs/connector-factory repo archive (zip) to a temp dir
# - Extract it
# - Copy a chosen connector (by name, version, author, language) into the current directory
# - Provide --help and --list
# - Future: add telemetry

set -euo pipefail
IFS=$'\n\t'

SCRIPT_NAME=$(basename "$0")

# ===== Constants =====
REPO_OWNER="514-labs"
REPO_NAME="connector-factory"
DEFAULT_REPO_REF="main"
# Allow override via environment: export REPO_REF=<branch>
REPO_REF="${REPO_REF:-$DEFAULT_REPO_REF}"

# Positional args (required)
CONNECTOR_NAME=""
CONNECTOR_VERSION=""
CONNECTOR_AUTHOR=""
CONNECTOR_LANGUAGE=""

# ===== Internal =====
TMP_DIR=""
MODE="install"
FILTER_NAME=""
FILTER_VERSION=""
FILTER_AUTHOR=""
FILTER_LANGUAGE=""

# Remove temp dir on exit
cleanup() {
  if [ -n "${TMP_DIR:-}" ] && [ -d "$TMP_DIR" ]; then
    rm -rf "$TMP_DIR" || true
  fi
}
trap cleanup EXIT INT TERM

# ===== Utilities =====

# Print help and usage information
print_usage() {
  cat <<EOF
$SCRIPT_NAME

Install a connector from $REPO_OWNER/$REPO_NAME into a new subdirectory in your current directory.

USAGE:
  $SCRIPT_NAME <name> <version> <author> <language>
  $SCRIPT_NAME --list [--name <n1,n2>] [--version <v1,v2>] [--author <a1,a2>] [--language <l1,l2>]
  $SCRIPT_NAME --help

EXAMPLES:
  # Install Google Analytics v4 by author fiveonefour in TypeScript into the current directory
  $SCRIPT_NAME google-analytics v4 fiveonefour typescript

  # List available connectors to install
  $SCRIPT_NAME --list

POSITIONAL ARGUMENTS:
  name        Connector name (e.g., google-analytics, s3)
  version     Data source version (e.g., v3, v4)
  author      Author/vendor (e.g., fiveonefour)
  language    Language (e.g., typescript, python)

FLAGS:
  --list      List available connectors to install
              Optional filters (comma-separated, case-insensitive substrings):
                --name <n1,n2>       Filter by connector name(s)
                --version <v1,v2>    Filter by version(s)
                --author <a1,a2>     Filter by author(s)
                --language <l1,l2>   Filter by language(s)
  -h, --help  Show this help

ENVIRONMENT:
  REPO_REF    Git branch to list/install from. Default: $DEFAULT_REPO_REF
              Example: REPO_REF=my-branch $SCRIPT_NAME --list
EOF
}

# Ensure a required command is available
require_cmd() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "❌ Missing required command: $cmd" >&2
    exit 1
  fi
}

# Check required external tools for installation
ensure_dependencies() {
  require_cmd curl
  require_cmd unzip
}

# Create temporary working directory
create_tmpdir() {
  TMP_DIR=$(mktemp -d 2>/dev/null || mktemp -d -t connector_factory)
}

# Determine GitHub codeload URL for the given branch
# - codeload.github.com serves zip archives
# - Optimized and CDN-backed for large/binary transfers
# - Simpler than REST for downloads; no schema/rate-limit parsing required
resolve_archive_url() {
  local owner="$1"; local repo="$2"; local ref="$3"
  echo "https://codeload.github.com/$owner/$repo/zip/refs/heads/$ref"
}

# Download repo zip archive to temp and echo its file path
download_archive() {
  local url="$1"
  local dst_zip="$TMP_DIR/$REPO_NAME.zip"
  echo "⬇️  Downloading repository archive..." >&2
  curl -fsSL "$url" -o "$dst_zip"
  echo "$dst_zip"
}

# Unzip archive into temp directory
extract_archive() {
  local zip_path="$1"
  echo "📦 Extracting archive..."
  unzip -q "$zip_path" -d "$TMP_DIR"
}

# Find extracted repository root directory inside temp
find_extract_root() {
  local pattern="$REPO_NAME-*"
  local root
  root=$(find "$TMP_DIR" -maxdepth 1 -type d -name "$pattern" | head -n1 || true)

  if [ -z "$root" ]; then
    echo "❌ Unable to locate extracted repository directory" >&2
    exit 1
  fi

  echo "$root"
}

# Verify that the connector path exists within the extracted tree
validate_connector_exists() {
  local root_dir="$1"; local rel_path="$2"
  local full_path="$root_dir/$rel_path"

  if [ ! -d "$full_path" ]; then
    echo "❌ Connector path not found: $rel_path" >&2
    echo "❌ Searched: $full_path" >&2
    exit 1
  fi
}

# Copy connector contents into destination subdirectory (fails if exists)
copy_connector_into_subdir() {
  local src_dir="$1"
  local dest_dir="$2"

  if [ -e "$dest_dir" ]; then
    echo "❌ Destination already exists: $dest_dir" >&2
    echo "Please remove it or choose a different location."
    exit 1
  fi

  mkdir -p "$dest_dir"
  echo "📁 Copying: $src_dir -> $dest_dir"
  echo ""

  if command -v rsync >/dev/null 2>&1; then
    rsync -a --exclude ".git" "$src_dir"/ "$dest_dir"/
  else
    cp -R "$src_dir"/. "$dest_dir"/
  fi

  echo "✅ Installed into $dest_dir"
}

# Fetch the repository tree JSON from GitHub
fetch_tree() {
  # Use GitHub's tree API to list files without downloading the repo:
  # - api.github.com returns structured JSON (paths) so we can build permutations
  # - Avoids fetching the full archive for discovery
  # - Note: unauthenticated requests have stricter rate limits
  local tree_api="https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/git/trees/$REPO_REF?recursive=1"
  curl -fsSL "$tree_api"
}

# Normalize tree JSON into permutations: name|version|author|language (excludes "_*")
build_permutations() {
  jq -r '
    .tree
    | map(select(type=="object") | .path)
    | map(select(type=="string" and startswith("registry/")))
    | map(split("/"))
    | map(select(type=="array" and length >= 5))
    | map({name: .[1], version: .[2], author: .[3], language: .[4]})
    | map(select(type=="object"))
    | map(select((.name|startswith("_")|not)
                 and (.version|startswith("_")|not)
                 and (.author|startswith("_")|not)
                 and (.language|startswith("_")|not)))
    | unique
    | sort_by(.name, .version, .author, .language)
    | map("\(.name)|\(.version)|\(.author)|\(.language)")
    | .[]
  '
}

# Lowercase helper
to_lower() { printf %s "$1" | tr '[:upper:]' '[:lower:]'; }

# Check if a lowercase field matches any token in a comma-separated list (case-insensitive substring)
#
# Inputs:
#   $1 - field_lc: the already-lowercased field value (e.g., "google-analytics")
#   $2 - filter_csv: comma-separated list of tokens (may include spaces), e.g., "google, shop"
#
# Behavior:
#   - If filter_csv is empty, treat as match (no filter applied)
#   - For each comma-separated token, trim whitespace, lowercase, and check if it is a substring of field_lc
#   - Returns success (0) on first match; returns failure (1) if no token matches
csv_match_any() {
  local field_lc="$1"; local filter_csv="$2"
  if [ -z "$filter_csv" ]; then return 0; fi
  local IFS=','
  read -r -a tokens <<< "$filter_csv"
  local tok tok_lc trimmed
  for tok in "${tokens[@]}"; do
    # trim leading/trailing whitespace
    trimmed=$(printf '%s' "$tok" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
    tok_lc=$(to_lower "$trimmed")
    [ -z "$tok_lc" ] && continue
    case "$field_lc" in
      *"$tok_lc"*) return 0;;
    esac
  done
  return 1
}

# Filter permutations using optional CSV filters and print copy-ready lines
#
# Reads pipe-delimited tuples from stdin: name|version|author|language
# For each tuple:
#   - Lowercases each field
#   - Applies csv_match_any against the provided filters (AND across fields)
#   - On match, prints a copy-ready line: "name version author language"
#
# Side effects:
#   - Tracks whether anything was printed and shows a CTA if none matched
filter_and_print() {
  local printed_any=0
  local f_name_lc f_version_lc f_author_lc f_language_lc
  f_name_lc=$(to_lower "$FILTER_NAME")
  f_version_lc=$(to_lower "$FILTER_VERSION")
  f_author_lc=$(to_lower "$FILTER_AUTHOR")
  f_language_lc=$(to_lower "$FILTER_LANGUAGE")

  while IFS= read -r line; do
    [ -z "$line" ] && continue
    IFS='|' read -r name version author language <<< "$line"
    local name_lc version_lc author_lc language_lc
    name_lc=$(to_lower "$name")
    version_lc=$(to_lower "$version")
    author_lc=$(to_lower "$author")
    language_lc=$(to_lower "$language")
    if csv_match_any "$name_lc" "$f_name_lc" && \
       csv_match_any "$version_lc" "$f_version_lc" && \
       csv_match_any "$author_lc" "$f_author_lc" && \
       csv_match_any "$language_lc" "$f_language_lc"; then
      printf "%s %s %s %s\n" "$name" "$version" "$author" "$language"
      printed_any=1
    fi
  done

  echo ""
  if [ "$printed_any" -eq 0 ]; then
    echo "No connectors matched your filters."
    echo ""
    echo "❤️ We would love your contributions: https://github.com/514-labs/connector-factory"
    echo ""
  fi
}

# List copy/paste permutations: "<name> <version> <author> <language>" (exclude "_*")
# TODO: Could the site just have a registry endpoint?
list_connectors() {
  echo ""
  echo "🚀 Install a connector with: $SCRIPT_NAME <name> <version> <author> <language>"
  echo ""

  if ! command -v jq >/dev/null 2>&1; then
    echo "❌ --list requires 'jq' for readable permutations." >&2
    echo "Install jq or browse: https://github.com/$REPO_OWNER/$REPO_NAME/tree/$REPO_REF/registry"
    return
  fi

  # Orchestrate: fetch → normalize → filter/print
  local perms
  perms=$(fetch_tree | build_permutations)
  filter_and_print <<< "$perms"
}

# Parse flags and positional arguments
parse_args() {
  POSITIONALS=()
  while (( "$#" )); do
    case "$1" in
      --list)
        MODE="list"; shift;;
      --name)
        FILTER_NAME="${2:-}"; shift 2;;
      --version)
        FILTER_VERSION="${2:-}"; shift 2;;
      --author)
        FILTER_AUTHOR="${2:-}"; shift 2;;
      --language)
        FILTER_LANGUAGE="${2:-}"; shift 2;;
      -h|--help)
        print_usage; exit 0;;
      --*)
        echo "❌ Unknown flag: $1" >&2; print_usage; exit 1;;
      *)
        POSITIONALS+=("$1"); shift;;
    esac
  done
  # Assign positionals if not in list/help mode
  if [ "$MODE" != "list" ]; then
    if [ ${#POSITIONALS[@]} -lt 4 ]; then
      echo "❌ Expected 4 positional arguments: <name> <version> <author> <language>" >&2
      print_usage
      exit 1
    fi
    CONNECTOR_NAME="${POSITIONALS[0]}"
    CONNECTOR_VERSION="${POSITIONALS[1]}"
    CONNECTOR_AUTHOR="${POSITIONALS[2]}"
    CONNECTOR_LANGUAGE="${POSITIONALS[3]}"
  fi
}

show_next_steps() {
  # TODO: Could this be part of the connector metadata that we just print?
  :
}

main() {
  parse_args "$@"

  if [ "$MODE" = "list" ]; then
    list_connectors
    exit 0
  fi

  ensure_dependencies
  create_tmpdir

  local rel_path="registry/$CONNECTOR_NAME/$CONNECTOR_VERSION/$CONNECTOR_AUTHOR/$CONNECTOR_LANGUAGE"
  echo ""
  echo "Connector: $rel_path"
  echo "Source:    $REPO_OWNER/$REPO_NAME@$REPO_REF"
  echo ""

  local url zip_path root src_dir
  url=$(resolve_archive_url "$REPO_OWNER" "$REPO_NAME" "$REPO_REF")

  zip_path=$(download_archive "$url")
  echo ""

  extract_archive "$zip_path"
  echo ""

  root=$(find_extract_root)
  validate_connector_exists "$root" "$rel_path"

  src_dir="$root/$rel_path"
  dest_dir="$PWD/$CONNECTOR_NAME"
  copy_connector_into_subdir "$src_dir" "$dest_dir"
  echo ""

  show_next_steps
}

main "$@"
