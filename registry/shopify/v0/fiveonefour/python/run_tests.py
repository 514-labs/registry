#!/usr/bin/env python3
"""
Test runner for Shopify connector implementation.

This script provides easy access to run tests from the main project directory.
"""

import sys
import os
from pathlib import Path

def main():
    """Run tests from the project root."""
    # Get the project root path (parent of this script)
    project_root = Path(__file__).parent
    
    # Add the test directory to Python path
    test_dir = project_root / "test"
    if test_dir.exists():
        sys.path.insert(0, str(test_dir))
    
    try:
        from run_all_phases import main as run_all_tests
        return run_all_tests()
    except ImportError as e:
        print(f"❌ Failed to import test runner: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
