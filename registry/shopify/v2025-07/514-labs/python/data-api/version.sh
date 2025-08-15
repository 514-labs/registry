#!/bin/bash

set -euo pipefail

# Usage: ./version.sh 0.1.3

if [ $# -ne 1 ]; then
	echo "Usage: $0 <new_version>"
	exit 1
fi

NEW_VER="$1"
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Bumping version to ${NEW_VER}"

# Update setup.py
perl -0777 -pe "s/version=\"[0-9]+\.[0-9]+\.[0-9]+\"/version=\"${NEW_VER}\"/g" -i "${ROOT_DIR}/setup.py"

# Update package __init__ version
perl -0777 -pe "s/__version__\s*=\s*\"[0-9]+\.[0-9]+\.[0-9]+\"/__version__ = \"${NEW_VER}\"/g" -i "${ROOT_DIR}/src/shopify_connector/__init__.py"

echo "Building sdist and wheel..."
cd "${ROOT_DIR}"
python3 -m venv venv >/dev/null 2>&1 || true
source venv/bin/activate
pip install --upgrade pip build >/dev/null
python -m build

echo "Artifacts:"
ls -l dist


