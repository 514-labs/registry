"""
Test package for the Shopify Python Connector.

This package contains all phase-specific test files for testing
the connector implementation.
"""

__version__ = "0.1.0"
__description__ = "Test suite for Shopify Python Connector implementation phases"

# Test files available in this package
__all__ = [
    "test_phase1",  # Foundation & Core Interface
    "test_phase2",  # Authentication & Transport
    "test_phase3",  # Resilience & Rate Limiting
    "test_phase4",  # Pagination & Data Handling
    "test_phase5",  # Hooks & Observability
    "test_phase6",  # Main Connector Implementation
]

# Test runner scripts
__test_runners__ = [
    "run_all_phases",  # Main test runner for all phases
]
