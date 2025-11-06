#!/usr/bin/env bash
set -euo pipefail

# This script runs after your package is installed (pnpm/npm postinstall lifecycle).
# It is intentionally minimal and documented so you can customize it for your distribution needs.
#
# Common use cases:
#  - Copy shared core sources into this package for single-file distribution
#  - Prune dev-only files from the published artifact
#  - Flatten directories for easier consumption
#
# By default, this script does nothing. Uncomment and adapt as needed.

main() {
  echo "postinstall: no-op (customize scripts/postinstall.sh as needed)"

  # Example: flatten src into the package root
  # if [ -d src ]; then
  #   shopt -s dotglob
  #   mv src/* . || true
  #   shopt -u dotglob
  #   rm -rf src
  # fi
}

main "$@"
