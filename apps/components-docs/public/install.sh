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
DEFAULT_REPO_BRANCH="main"
# Allow override via environment
REPO_BRANCH="${REPO_BRANCH:-$DEFAULT_REPO_BRANCH}"
REGISTRY_JSON_URL="${REGISTRY_JSON_URL:-https://connectors.514.ai/registry.json}"

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
DESTINATION=""

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
  $SCRIPT_NAME <name> <version> <author> <language> [--dest <dir>]
  $SCRIPT_NAME --list [--name <n1,n2>] [--version <v1,v2>] [--author <a1,a2>] [--language <l1,l2>]
  $SCRIPT_NAME --help

EXAMPLES:
  # Install Google Analytics v4 by author fiveonefour in TypeScript into the current directory
  $SCRIPT_NAME google-analytics v4 fiveonefour typescript

  # List available connectors to install
  $SCRIPT_NAME --list

POSITIONAL ARGUMENTS:
  name          Connector name (e.g., google-analytics, s3)
  version       Data source version (e.g., v3, v4)
  author        Author/vendor (e.g., fiveonefour)
  language      Language (e.g., typescript, python)

FLAGS:
  --list        List available connectors to install
                Optional filters (comma-separated, case-insensitive substrings):
                  --name <n1,n2>       Filter by connector name(s)
                  --version <v1,v2>    Filter by version(s)
                  --author <a1,a2>     Filter by author(s)
                  --language <l1,l2>   Filter by language(s)

  --dest <dir>  Destination directory for installation (absolute or relative)
                Default: ./<name>

  -h, --help    Show this help

ENVIRONMENT:
  REGISTRY_JSON_URL URL to fetch connector registry JSON from.
                    Default: $REGISTRY_JSON_URL
                    Example: REGISTRY_JSON_URL=https://connectors.514.ai/registry.json $SCRIPT_NAME --list
  REPO_BRANCH       Git branch to install from.
                    Default: $DEFAULT_REPO_BRANCH
                    Example: REPO_BRANCH=my-branch $SCRIPT_NAME google-analytics v4 fiveonefour typescript
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

# List connectors in a copy-pasteable format
list_connectors() {
  echo ""
  echo "🚀 Install a connector with: $SCRIPT_NAME <name> <version> <author> <language>"
  echo ""

  if ! command -v jq >/dev/null 2>&1; then
    echo "❌ --list requires 'jq' for readable permutations." >&2
    echo "Install jq or browse: https://github.com/$REPO_OWNER/$REPO_NAME/tree/$REPO_BRANCH/registry"
    return
  fi

  # Fetch registry JSON once; if not HTTP 200, show error
  local resp http_status body perms
  resp=$(curl -sS -w "HTTPSTATUS:%{http_code}" "$REGISTRY_JSON_URL" || true)
  http_status="${resp##*HTTPSTATUS:}"
  body="${resp%HTTPSTATUS:*}"

  if [ "$http_status" != "200" ]; then
    echo "❌ Unable to fetch $REGISTRY_JSON_URL" >&2
    echo "   HTTP status: ${http_status:-unknown}" >&2
    echo "   You can also browse: https://github.com/$REPO_OWNER/$REPO_NAME/tree/$REPO_BRANCH/registry" >&2
    return
  fi

  # Filter in jq → print
  perms=$(printf '%s' "$body" | jq -r \
    --arg f_name "$FILTER_NAME" \
    --arg f_version "$FILTER_VERSION" \
    --arg f_author "$FILTER_AUTHOR" \
    --arg f_language "$FILTER_LANGUAGE" '
    def mkpat(s): (s|split(",")|map(ascii_downcase|gsub("^\\s+|\\s+$";""))|join("|"));
    def want(field; s): (s=="" or (field|ascii_downcase|test(mkpat(s))));
    (.connectors // [])
    | .[] as $c
    | ($c.languages // [])[] as $l
    | select(
        want($c.name; $f_name) and
        want($c.version; $f_version) and
        want($c.author; $f_author) and
        want($l; $f_language)
      )
    | "\($c.name) \($c.version) \($c.author) \($l)"
  ')

  if [ -z "$perms" ]; then
    echo "No connectors matched your filters."
    echo ""
    echo "❤️ We would love your contributions: https://github.com/514-labs/connector-factory"
    echo ""
    return
  fi

  echo "$perms"
  echo ""
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
      --dest)
        DESTINATION="${2:-}"; shift 2;;
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
  echo "🚀 Next steps:"
  echo "  - Review $dest_dir/README.md"
  echo "  - Review $dest_dir/docs/getting-started.md"
  echo "  - Review $dest_dir/examples/"
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
  echo "Source:    $REPO_OWNER/$REPO_NAME@$REPO_BRANCH"
  echo ""

  local url zip_path root src_dir
  url=$(resolve_archive_url "$REPO_OWNER" "$REPO_NAME" "$REPO_BRANCH")

  zip_path=$(download_archive "$url")
  echo ""

  extract_archive "$zip_path"
  echo ""

  root=$(find_extract_root)
  validate_connector_exists "$root" "$rel_path"

  src_dir="$root/$rel_path"
  if [ -n "${DESTINATION:-}" ]; then
    dest_dir="$DESTINATION"
  else
    dest_dir="$PWD/$CONNECTOR_NAME"
  fi
  copy_connector_into_subdir "$src_dir" "$dest_dir"
  echo ""

  show_next_steps
}

main "$@"
