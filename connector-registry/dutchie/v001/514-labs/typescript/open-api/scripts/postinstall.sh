#!/usr/bin/env bash

set -euo pipefail

# This script runs inside the installed connector directory.
# Remove the "dependencies" field from package.json to avoid nested deps.

PKG_JSON="package.json"

if [ ! -f "$PKG_JSON" ]; then
  echo "package.json not found; skipping postinstall."
  exit 0
fi

if command -v jq >/dev/null 2>&1; then
  tmp_file="$(mktemp)"
  # Delete the dependencies key if it exists
  jq 'del(.dependencies)' "$PKG_JSON" > "$tmp_file"
  mv "$tmp_file" "$PKG_JSON"
  echo "Removed dependencies from package.json"
else
  # Fallback: minimal sed-based removal that handles a common formatting.
  # This is best-effort and may not cover all JSON layouts.
  # Remove a top-level "dependencies": { ... } block including surrounding comma.
  # Collapse repeated commas.
  sed -E ':a;N;$!ba;s/\,?\s*"dependencies"\s*:\s*\{([^}]|\n)*\}\s*,?//g' "$PKG_JSON" | \
    sed -E 's/,\s*([}\]])/\1/g' > "$PKG_JSON.tmp" && mv "$PKG_JSON.tmp" "$PKG_JSON" || true
  echo "Removed dependencies from package.json (best-effort without jq)"
fi

exit 0
