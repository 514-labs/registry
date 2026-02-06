#!/bin/bash

echo "=== Wonderware Pipeline Migration Verification ==="
echo ""

MISSING=0

# Check critical files
FILES=(
  "_meta/pipeline.json"
  "v1/_meta/version.json"
  "v1/514-labs/_meta/pipeline.json"
  "v1/514-labs/_meta/LICENSE"
  "v1/514-labs/python/default/moose.config.toml"
  "v1/514-labs/python/default/requirements.txt"
  "v1/514-labs/python/default/app/main.py"
  "v1/514-labs/python/default/app/config/wonderware_config.py"
  "v1/514-labs/python/default/app/ingest/wonderware_models.py"
  "v1/514-labs/python/default/app/workflows/wonderware_backfill.py"
  "v1/514-labs/python/default/app/workflows/wonderware_sync.py"
  "v1/514-labs/python/default/app/workflows/lib/wonderware_client.py"
  "v1/514-labs/python/default/app/workflows/lib/wonderware_inserter.py"
  "v1/514-labs/python/default/app/apis/wonderware_status.py"
  "v1/514-labs/python/default/README.md"
  "v1/514-labs/python/default/docs/getting-started.md"
  "v1/514-labs/python/default/tests/conftest.py"
)

echo "Checking critical files..."
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ MISSING: $file"
    MISSING=$((MISSING + 1))
  fi
done

echo ""
echo "=== Summary ==="
if [ $MISSING -eq 0 ]; then
  echo "✅ All critical files present!"
  echo "✅ Migration successful!"
else
  echo "❌ $MISSING files missing"
  exit 1
fi

echo ""
echo "Total files created: $(find . -type f | wc -l | tr -d ' ')"
echo "Python files: $(find . -name '*.py' -type f | wc -l | tr -d ' ')"
echo ""
echo "Next steps:"
echo "  cd v1/514-labs/python/default"
echo "  pip install -r requirements.txt"
echo "  moose dev"
