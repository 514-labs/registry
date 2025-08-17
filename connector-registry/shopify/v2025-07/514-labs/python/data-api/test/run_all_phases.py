#!/usr/bin/env python3
"""
Main test runner for all Shopify connector implementation phases.

This script runs all phase tests in sequence and provides a comprehensive
overview of the implementation status.
"""

import sys
import os
import subprocess
import time
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

def run_phase_test(phase_number: int) -> tuple[bool, str]:
    """
    Run a specific phase test.
    
    Args:
        phase_number: The phase number to test (1-6)
    
    Returns:
        Tuple of (success: bool, output: str)
    """
    test_file = f"test_phase{phase_number}.py"
    test_path = Path(__file__).parent / test_file
    
    if not test_path.exists():
        return False, f"Test file {test_file} not found"
    
    try:
        # Run the test file
        result = subprocess.run(
            [sys.executable, str(test_path)],
            capture_output=True,
            text=True,
            cwd=Path(__file__).parent
        )
        
        success = result.returncode == 0
        output = result.stdout + result.stderr
        
        return success, output
        
    except Exception as e:
        return False, f"Failed to run {test_file}: {e}"


def main():
    """Run all phase tests and provide summary."""
    print("🚀 Shopify Connector - Complete Implementation Test Suite")
    print("=" * 70)
    print()
    
    phases = [
        (1, "Foundation & Core Interface"),
        (2, "Authentication & Transport"),
        (3, "Resilience & Rate Limiting"),
        (4, "Pagination & Data Handling"),
        (5, "Hooks & Observability"),
        (6, "Main Connector Implementation")
    ]
    
    results = []
    total_start = time.time()
    
    for phase_num, phase_name in phases:
        print(f"🔧 Testing Phase {phase_num}: {phase_name}")
        print("-" * 50)
        
        start_time = time.time()
        success, output = run_phase_test(phase_num)
        duration = time.time() - start_time
        
        if success:
            print(f"✅ Phase {phase_num} PASSED ({duration:.2f}s)")
            results.append((phase_num, True, duration))
        else:
            print(f"❌ Phase {phase_num} FAILED ({duration:.2f}s)")
            results.append((phase_num, False, duration))
        
        # Show test output (truncated if too long)
        if output.strip():
            lines = output.strip().split('\n')
            if len(lines) > 20:
                print("   Output (first 20 lines):")
                for line in lines[:20]:
                    print(f"   {line}")
                print(f"   ... and {len(lines) - 20} more lines")
            else:
                print("   Output:")
                for line in lines:
                    print(f"   {line}")
        
        print()
    
    # Summary
    total_duration = time.time() - total_start
    passed = sum(1 for _, success, _ in results if success)
    total = len(results)
    
    print("=" * 70)
    print("📊 FINAL TEST RESULTS")
    print("=" * 70)
    
    for phase_num, success, duration in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"Phase {phase_num}: {status} ({duration:.2f}s)")
    
    print()
    print(f"Overall: {passed}/{total} phases passed")
    print(f"Total time: {total_duration:.2f}s")
    
    if passed == total:
        print("🎉 ALL PHASES PASSED! Implementation is complete and ready!")
        return 0
    else:
        print("⚠️  Some phases failed. Check the implementation.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
