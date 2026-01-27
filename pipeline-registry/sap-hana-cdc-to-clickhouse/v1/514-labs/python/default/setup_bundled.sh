#!/bin/bash
# Setup script for bundled SAP HANA CDC connector installation
# This script automates the process of bundling the connector into your pipeline

set -e

echo "🚀 Setting up SAP HANA CDC Pipeline with Bundled Connector"
echo "============================================================"
echo ""

# Check if running from pipeline directory
if [ ! -f "moose.config.toml" ]; then
    echo "❌ Error: This script must be run from the pipeline root directory"
    echo "   (the directory containing moose.config.toml)"
    exit 1
fi

# Install the connector into app directory
echo "📦 Step 1: Installing SAP HANA CDC connector into app/sap-hana-cdc..."
if [ -d "app/sap-hana-cdc" ]; then
    echo "⚠️  app/sap-hana-cdc already exists. Skipping installation."
    echo "   To reinstall, remove the directory first: rm -rf app/sap-hana-cdc"
else
    bash -i <(curl -s https://registry.514.ai/install.sh) --dest app/sap-hana-cdc sap-hana-cdc v1 514-labs python default
    echo "✅ Connector installed"
fi
echo ""

# Get the absolute path to the connector
CONNECTOR_PATH="$(cd "$(dirname "$0")" && pwd)/app/sap-hana-cdc"

# Create or update pyproject.toml
echo "📝 Step 2: Creating/updating pyproject.toml..."
if [ -f "pyproject.toml" ]; then
    echo "⚠️  pyproject.toml already exists."
    echo "   Please manually add this line to [project.dependencies]:"
    echo "   \"connectorsap-hana-cdc @ file://${CONNECTOR_PATH}\","
else
    cat > pyproject.toml << EOF
[project]
name = "sap-hana-cdc-pipeline"
version = "0.1.0"
requires-python = ">=3.13"
dependencies = [
    "clickhouse-connect==0.7.16",
    "faker>=38.2.0",
    "moose-cli>=0.6.230",
    "moose-lib>=0.6.230",
    "requests==2.32.4",
    "connectorsap-hana-cdc @ file://${CONNECTOR_PATH}",
]

[build-system]
requires = ["setuptools>=68", "wheel"]
build-backend = "setuptools.build_meta"

[tool.setuptools.packages.find]
where = ["."]
include = ["app*"]
EOF
    echo "✅ pyproject.toml created"
fi
echo ""

# Update cdc.py to add path setup
echo "🔧 Step 3: Updating app/workflows/cdc.py..."
CDC_FILE="app/workflows/cdc.py"

if grep -q "sap_hana_cdc_path = Path" "$CDC_FILE"; then
    echo "⚠️  Path setup already exists in cdc.py"
else
    # Create backup
    cp "$CDC_FILE" "${CDC_FILE}.backup"

    # Add path setup after imports
    python3 << 'PYTHON_SCRIPT'
import sys

# Read the file
with open("app/workflows/cdc.py", "r") as f:
    lines = f.readlines()

# Find where to insert the path setup
insert_index = 0
for i, line in enumerate(lines):
    if line.startswith("import") or line.startswith("from"):
        insert_index = i + 1
    elif insert_index > 0 and line.strip() and not line.startswith("import") and not line.startswith("from"):
        break

# Insert the path setup
path_setup = """
# Add sap-hana-cdc module to Python path
sap_hana_cdc_path = Path(__file__).parent.parent / "sap-hana-cdc" / "src"
if str(sap_hana_cdc_path) not in sys.path:
    sys.path.insert(0, str(sap_hana_cdc_path))
"""

# Make sure Path is imported
has_path_import = any("from pathlib import Path" in line for line in lines[:insert_index])
if not has_path_import:
    # Add Path import
    for i, line in enumerate(lines):
        if "import sys" in line:
            lines.insert(i + 1, "from pathlib import Path\n")
            insert_index += 1
            break

lines.insert(insert_index, path_setup + "\n")

# Write back
with open("app/workflows/cdc.py", "w") as f:
    f.writelines(lines)
PYTHON_SCRIPT

    echo "✅ cdc.py updated (backup saved as cdc.py.backup)"
fi
echo ""

# Install dependencies
echo "📚 Step 4: Installing dependencies..."
if command -v uv &> /dev/null; then
    echo "Using uv..."
    uv sync
    echo "✅ Dependencies installed with uv"
else
    echo "Using pip..."
    pip install -e .
    echo "✅ Dependencies installed with pip"
fi
echo ""

echo "✨ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Configure your environment variables (see README.md)"
echo "2. Initialize CDC: python init_cdc.py --init-cdc --tables YOUR_TABLES"
echo "3. Run the pipeline: moose dev"
echo ""
echo "To run workflows directly:"
echo "  uv run app/workflows/cdc.py"
echo "  # or"
echo "  python app/workflows/cdc.py"
