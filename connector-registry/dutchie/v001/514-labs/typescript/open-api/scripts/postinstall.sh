#!/usr/bin/env bash

set -euo pipefail

# This script runs inside the installed connector directory.

remove_dependencies_from_package_json() {
  local pkg_json="package.json"

  if [ ! -f "$pkg_json" ]; then
    echo "package.json not found; skipping dependency removal."
    return 0
  fi

  if command -v jq >/dev/null 2>&1; then
    local tmp_file
    tmp_file="$(mktemp)"
    jq 'del(.dependencies)' "$pkg_json" > "$tmp_file"
    mv "$tmp_file" "$pkg_json"
    echo "Removed dependencies from package.json"
  else
    # Best-effort fallback without jq
    sed -E ':a;N;$!ba;s/\,?\s*"dependencies"\s*:\s*\{([^}]|\n)*\}\s*,?//g' "$pkg_json" | \
      sed -E 's/,\s*([}\]])/\1/g' > "$pkg_json.tmp" && mv "$pkg_json.tmp" "$pkg_json" || true
    echo "Removed dependencies from package.json (best-effort without jq)"
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

  mkdir -p "$dest_dir"
  if command -v rsync >/dev/null 2>&1; then
    rsync -a "$core_src/" "$dest_dir/"
  else
    cp -R "$core_src/." "$dest_dir/"
  fi
  echo "Copied core sources into $dest_dir"
}

main() {
  remove_dependencies_from_package_json
  copy_core_into_connector
}

main "$@"
