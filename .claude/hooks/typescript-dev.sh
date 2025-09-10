#!/bin/bash
# Enhanced TypeScript development hook

echo "🔍 Running enhanced TypeScript checks..."

# Function to check TypeScript in a directory
check_typescript() {
    local dir="$1"
    echo "Checking TypeScript in: $dir"
    
    if [ -f "$dir/tsconfig.json" ]; then
        cd "$dir" || return 1
        
        # Type checking
        if command -v tsc >/dev/null 2>&1; then
            echo "  ✓ Running type check..."
            tsc --noEmit --pretty
        else
            echo "  ⚠️ TypeScript compiler not found"
        fi
        
        # Lint checking if available
        if [ -f "package.json" ] && grep -q '"lint"' package.json; then
            echo "  ✓ Running lint..."
            npm run lint --silent
        fi
        
        # Format checking if available
        if command -v prettier >/dev/null 2>&1; then
            echo "  ✓ Checking formatting..."
            prettier --check "src/**/*.ts" --log-level warn
        fi
        
        cd - >/dev/null || return 1
    else
        echo "  ⚠️ No tsconfig.json found in $dir"
    fi
}

# Check current directory
check_typescript "."

# Check for connector TypeScript implementations
if [ -d "registry" ]; then
    find registry -name "typescript" -type d | while read -r ts_dir; do
        check_typescript "$ts_dir"
    done
fi

echo "✅ TypeScript checks complete"
