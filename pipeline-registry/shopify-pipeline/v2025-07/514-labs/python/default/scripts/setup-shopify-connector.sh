#!/bin/bash
set -euo pipefail

# Install connector repo
bash -i <(curl https://connectors.514.ai/install.sh) shopify v2025-07 514-labs python data-api
cd shopify

pip install --upgrade pip build

# Build distributions (wheel + sdist) into ./dist/
python -m build
pip install dist/*.whl

cd ..
