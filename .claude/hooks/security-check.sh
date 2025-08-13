#!/bin/bash
# Security audit hook for connector development

echo "🔒 Running security checks..."

# Function to run security checks in a directory
security_check() {
    local dir="$1"
    echo "Security audit in: $dir"
    
    if [ -f "$dir/package.json" ]; then
        cd "$dir" || return 1
        
        # Dependency security audit
        if command -v npm >/dev/null 2>&1; then
            echo "  ✓ Running npm audit..."
            npm audit --audit-level moderate
        fi
        
        # Check for common security issues
        echo "  ✓ Checking for credential exposure..."
        if command -v grep >/dev/null 2>&1; then
            # Look for potential credential leaks
            grep -r -i "password\|secret\|key\|token" src/ --exclude-dir=node_modules 2>/dev/null || true
        fi
        
        # Check for unsafe patterns
        echo "  ✓ Checking for unsafe patterns..."
        if command -v grep >/dev/null 2>&1; then
            # Look for eval, innerHTML, and other unsafe patterns
            grep -r "eval\|innerHTML\|document.write" src/ 2>/dev/null || true
        fi
        
        cd - >/dev/null || return 1
    else
        echo "  ⚠️ No package.json found in $dir"
    fi
}

# Check current directory
security_check "."

# Check connector implementations
if [ -d "registry" ]; then
    find registry -name "typescript" -type d | while read -r ts_dir; do
        security_check "$ts_dir"
    done
fi

echo "✅ Security checks complete"
