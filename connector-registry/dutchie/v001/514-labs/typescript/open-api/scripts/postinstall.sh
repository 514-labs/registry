#!/usr/bin/env bash

set -euo pipefail

# This script runs inside the installed connector directory.

remove_dependencies_from_package_json() {
  local pkg_json="package.json"
  local pkg_abs
  pkg_abs="$(cd "$(dirname "$pkg_json")" && pwd)/$(basename "$pkg_json")"

  if [ ! -f "$pkg_json" ]; then
    echo "package.json not found; skipping dependency removal."
    return 0
  fi

  if command -v jq >/dev/null 2>&1; then
    local tmp_file
    tmp_file="$(mktemp)"
    jq 'del(.dependencies)' "$pkg_json" > "$tmp_file"
    mv "$tmp_file" "$pkg_json"
    echo "Removed dependencies from $pkg_abs"
  else
    # Best-effort fallback without jq
    sed -E ':a;N;$!ba;s/\,?\s*"dependencies"\s*:\s*\{([^}]|\n)*\}\s*,?//g' "$pkg_json" | \
      sed -E 's/,\s*([}\]])/\1/g' > "$pkg_json.tmp" && mv "$pkg_json.tmp" "$pkg_json" || true
    echo "Removed dependencies from $pkg_abs (best-effort without jq)"
  fi
}

copy_core_into_connector() {
  # Where to place the core sources within the connector
  local dest_dir="src/core"
  
  local extract_root="${FACTORY_EXTRACT_ROOT:-}"
  if [ -z "$extract_root" ]; then
    echo "FACTORY_EXTRACT_ROOT not provided; skipping core copy."
    return 0
  fi

  local core_src
  core_src="$extract_root/packages/core/src"
  if [ ! -d "$core_src" ]; then
    echo "Core source path not found at $core_src; skipping core copy."
    return 0
  fi

  # Absolute paths for logging
  local core_src_abs dest_abs
  core_src_abs="$(cd "$core_src" >/dev/null 2>&1 && pwd)"

  mkdir -p "$dest_dir"
  dest_abs="$(cd "$dest_dir" >/dev/null 2>&1 && pwd)"
  if command -v rsync >/dev/null 2>&1; then
    rsync -a "$core_src/" "$dest_dir/"
  else
    cp -R "$core_src/." "$dest_dir/"
  fi
  echo "Copied core sources from $core_src_abs to $dest_abs"
}

rewrite_core_imports() {
  local src_root="src"
  if [ ! -d "$src_root" ]; then
    return 0
  fi

  # Iterate TS/JS source files
  while IFS= read -r -d '' file; do
    # Compute relative path depth from src/ to file directory
    local rel path_dir depth prefix target tmp abs_file count
    rel="${file#$src_root/}"
    path_dir="$(dirname "$rel")"
    if [ "$path_dir" = "." ]; then
      target="./core"
    else
      # Count segments
      depth=$(printf "%s" "$path_dir" | awk -F'/' '{print NF}')
      prefix=""
      for i in $(seq 1 "$depth"); do
        prefix="../$prefix"
      done
      target="${prefix}core"
    fi

    abs_file="$(cd "$(dirname "$file")" >/dev/null 2>&1 && pwd)/$(basename "$file")"
    if grep -q "@connector-factory/core" "$file"; then
      count=$(grep -o "@connector-factory/core" "$file" | wc -l | tr -d '[:space:]')
      tmp="$(mktemp)"
      sed "s|@connector-factory/core|$target|g" "$file" > "$tmp" && mv "$tmp" "$file"
      echo "Rewrote $count import(s) in $abs_file to $target"
    fi
  done < <(find "$src_root" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.mts" -o -name "*.cts" \) -print0)
}

prune_connector_tree() {
  echo "Cleaning up connector directory"
  # Keep only: src (with copied core), package.json, README
  shopt -s dotglob
  for entry in *; do
    case "$entry" in
      src|package.json|README.md)
        ;;
      *)
        rm -rf "$entry" || true
        ;;
    esac
  done
  shopt -u dotglob
}

run_pnpm_install() {
  # Run install right here (connector dir) if pnpm is available.
  if ! command -v pnpm >/dev/null 2>&1; then
    echo "pnpm not found; skipping install"
    return 0
  fi

  local here
  here="$(pwd)"
  if [ -f "$here/package.json" ]; then
    echo "Running pnpm install in $here"
    pnpm install --ignore-scripts || echo "pnpm install failed; continuing"
  else
    echo "No package.json in $here; skipping pnpm install"
  fi
}

main() {
  remove_dependencies_from_package_json
  copy_core_into_connector
  rewrite_core_imports
  prune_connector_tree
  run_pnpm_install
}

main "$@"
