#!/bin/bash

# Shopify Python Connector Setup Script
# This script sets up the development environment for the Shopify connector

set -e  # Exit on any error

echo "🚀 Setting up Shopify Python Connector development environment..."

# Check Python version
PYTHON_VERSION=$(python3 --version 2>&1 | grep -o 'Python [0-9]\+\.[0-9]\+' | cut -d' ' -f2)
REQUIRED_VERSION="3.12"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Error: Python 3.12+ is required. Found: $PYTHON_VERSION"
    exit 1
fi

echo "✅ Python version: $PYTHON_VERSION"

# Check if virtual environment already exists
if [ -d "venv" ]; then
    echo "⚠️  Virtual environment already exists. Removing..."
    rm -rf venv
fi

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Verify installation
echo "🔍 Verifying installation..."
python -c "
import pydantic, requests, httpx, structlog, prometheus_client
print('✅ All core packages installed successfully')
"

echo "🧪 Testing development tools..."
python -c "
import pytest, black, isort, mypy
print('✅ All development tools installed successfully')
"

echo ""
echo "🎉 Setup complete! Your development environment is ready."
echo ""
echo "📋 Next steps:"
echo "1. Activate the virtual environment: source venv/bin/activate"
echo "2. Run tests: pytest"
echo "3. Format code: black src/ && isort src/"
echo "4. Type checking: mypy src/"
echo ""
echo "💡 Remember to always activate the virtual environment before development work!"
echo "   source venv/bin/activate"
