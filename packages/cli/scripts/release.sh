#!/usr/bin/env bash

set -eo pipefail

version=$1
if [ -z "$version" ]; then
  echo "Usage: $0 <version>" >&2
  exit 1
fi

# Bump version without creating a git tag
cd packages/cli
npm version "$version" --no-git-tag-version

# Build just this package
cd ../..
pnpm build --filter ...@connector-factory/cli

# Publish package
cd packages/cli
pnpm publish --access public --no-git-checks


