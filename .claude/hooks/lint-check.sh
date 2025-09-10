#!/bin/bash
# Lint check hook - runs after code changes

echo "Running lint checks..."

# Check if package.json exists and has lint script
if [ -f "package.json" ] && grep -q '"lint"' package.json; then
    npm run lint
else
    echo "No lint script found in package.json"
fi
