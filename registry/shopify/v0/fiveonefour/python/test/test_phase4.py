#!/usr/bin/env python3
"""
Test script for Phase 4 components (Pagination & Data Handling).

This script tests the basic functionality of the pagination
components without requiring a real Shopify connection.
"""

import sys
import os

# Add src to path for local development
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from shopify_connector.pagination import BasePagination, CursorPagination
from shopify_connector.config.schema import ShopifyConnectorConfig
from shopify_connector.connector import ShopifyConnector


def test_pagination_components():
    """Test GraphQL cursor pagination wiring (no live calls)."""
    print("📄 Testing Pagination Components (GraphQL Cursor)")
    print("=" * 40)

    config = ShopifyConnectorConfig(
        shop="test-store.myshopify.com",
        accessToken="shpat_test_token_12345678901234567890"
    )

    try:
        connector = ShopifyConnector(config)
        paginator = connector.paginator
        assert isinstance(paginator, BasePagination)
        assert isinstance(paginator, CursorPagination)
        caps = paginator.get_capabilities()
        print("✅ Cursor paginator created")
        print(f"   Capabilities: {caps}")
        print(f"   Default page size: 100")
        print()
        return True
    except Exception as e:
        print(f"❌ Pagination component test failed: {e}")
        return False


def main():
    print("🚀 Phase 4 Testing: Pagination & Data Handling")
    print("=" * 60)
    print()

    tests = [
        ("Cursor Pagination Components", test_pagination_components),
    ]

    passed = 0
    total = len(tests)

    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
            else:
                print(f"❌ {test_name} test failed")
        except Exception as e:
            print(f"❌ {test_name} test crashed: {e}")

    print("=" * 60)
    print(f"📊 Test Results: {passed}/{total} tests passed")

    if passed == total:
        print("🎉 All Phase 4 tests passed! Ready for Phase 5.")
        return 0
    else:
        print("⚠️  Some tests failed. Check the implementation.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
