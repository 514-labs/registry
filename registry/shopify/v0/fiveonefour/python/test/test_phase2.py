#!/usr/bin/env python3
"""
Test script for Phase 2 components (Authentication & Transport).

This script tests the basic functionality of the authentication
and transport components without requiring a real Shopify connection.
"""

import sys
import os

# Add src to path for local development
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from shopify_connector.auth.bearer import BearerAuth
from shopify_connector.transport.http_client import HTTPClient
from shopify_connector.transport.graphql import GraphQLTransport
from shopify_connector.config.schema import ShopifyConnectorConfig


def test_authentication():
    """Test authentication components."""
    print("🧪 Testing Authentication Components")
    print("=" * 40)
    
    # Test valid token
    try:
        auth = BearerAuth("shpat_test_token_12345678901234567890")
        print("✅ BearerAuth created successfully")
        print(f"   Auth type: {auth.get_auth_type()}")
        print(f"   Valid: {auth.isValid()}")
        
        # Test request authentication
        request = {'method': 'GET', 'path': '/products'}
        auth.authenticate(request)
        print("✅ Authentication applied to request")
        print(f"   Headers: {request.get('headers', {})}")
        
    except Exception as e:
        print(f"❌ Authentication test failed: {e}")
        return False
    
    # Test invalid token
    try:
        auth = BearerAuth("invalid_token")
        print("❌ Should have failed with invalid token")
        return False
    except Exception as e:
        print(f"✅ Correctly rejected invalid token: {e}")
    
    print()
    return True


def test_http_client():
    """Test HTTP client (without making real requests)."""
    print("🌐 Testing HTTP Client Components")
    print("=" * 40)
    
    # Create test config
    config = ShopifyConnectorConfig(
        shop="test-store.myshopify.com",
        accessToken="shpat_test_token_12345678901234567890"
    )
    
    try:
        client = HTTPClient(config)
        print("✅ HTTPClient created successfully")
        print(f"   Healthy: {client.is_healthy()}")
        print(f"   Stats: {client.get_stats()}")
        
        # Test capabilities
        capabilities = client.get_capabilities()
        print(f"   Capabilities: {capabilities}")
        
        client.close()
        print("✅ HTTPClient closed successfully")
        
    except Exception as e:
        print(f"❌ HTTP client test failed: {e}")
        return False
    
    print()
    return True


def test_graphql_transport():
    """Test GraphQL transport components (no network execution)."""
    print("🚀 Testing GraphQL Transport Components")
    print("=" * 40)
    
    # Create test config
    config = ShopifyConnectorConfig(
        shop="test-store.myshopify.com",
        accessToken="shpat_test_token_12345678901234567890"
    )
    
    try:
        transport = GraphQLTransport(config)
        print("✅ GraphQLTransport created successfully")
        print(f"   Healthy: {transport.is_healthy()}")
        print(f"   Type: {transport.get_transport_type()}")
        
        # Test capabilities
        capabilities = transport.get_capabilities()
        print(f"   Capabilities: {capabilities}")
        
        transport.close()
        print("✅ GraphQLTransport closed successfully")
        
    except Exception as e:
        print(f"❌ GraphQL transport test failed: {e}")
        return False
    
    print()
    return True


def test_connector_integration():
    """Test connector integration with new components."""
    print("🔗 Testing Connector Integration")
    print("=" * 40)
    
    # Create test config
    config = ShopifyConnectorConfig(
        shop="test-store.myshopify.com",
        accessToken="shpat_test_token_12345678901234567890"
    )
    
    try:
        connector = ShopifyConnector(config)
        print("✅ ShopifyConnector created successfully")
        print(f"   Auth type: {connector.auth.get_auth_type()}")
        print(f"   Transport type: {connector.transport.get_transport_type()}")
        print(f"   Connected: {connector.isConnected()}")
        
        # Test status
        status = connector.get_status()
        print(f"   Status: {status}")
        
        connector.disconnect()
        print("✅ ShopifyConnector disconnected successfully")
        
    except Exception as e:
        print(f"❌ Connector integration test failed: {e}")
        return False
    
    print()
    return True


def main():
    """Run all Phase 2 tests."""
    print("🚀 Phase 2 Testing: Authentication & Transport")
    print("=" * 60)
    print()
    
    tests = [
        ("Authentication", test_authentication),
        ("HTTP Client", test_http_client),
        ("GraphQL Transport", test_graphql_transport),
        ("Connector Integration", test_connector_integration),
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
        print("🎉 All Phase 2 tests passed! Ready for Phase 3.")
        return 0
    else:
        print("⚠️  Some tests failed. Check the implementation.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
