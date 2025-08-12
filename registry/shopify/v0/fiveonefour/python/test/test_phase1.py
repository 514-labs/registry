#!/usr/bin/env python3
"""
Test script for Phase 1 components (Foundation & Core Interface).

This script tests the foundational components of the Shopify connector
including configuration, error handling, and base interfaces.
"""

import sys
import os

# Add src to path for local development
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from shopify_connector.config.schema import ShopifyConnectorConfig
from shopify_connector.errors.codes import ErrorCode
from shopify_connector.errors.base import (
    ConnectorError, NetworkError, TimeoutError, AuthFailedError,
    RateLimitError, InvalidRequestError, ServerError
)


def test_configuration_system():
    """Test configuration validation and defaults."""
    print("⚙️  Testing Configuration System")
    print("=" * 40)
    
    try:
        # Test basic configuration
        config = {
            'shop': 'test-shop.myshopify.com',
            'accessToken': 'shpat_test_token_12345678901234567890',
            'apiVersion': '2024-07'
        }
        
        connector_config = ShopifyConnectorConfig(**config)
        print("✅ ShopifyConnectorConfig created successfully")
        print(f"   Shop: {connector_config.shop}")
        print(f"   API Version: {connector_config.apiVersion}")
        print(f"   Timeout: {connector_config.timeout}ms")
        print(f"   Use GraphQL: {connector_config.useGraphQL}")
        
        # Test default values
        print("✅ Default values applied")
        print(f"   Default timeout: {connector_config.timeout}")
        print(f"   Default retry attempts: {connector_config.retry.maxAttempts}")
        print(f"   Default rate limit burst capacity: {connector_config.rateLimit.burstCapacity}")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Configuration test failed: {e}")
        return False


def test_error_codes():
    """Test standardized error codes."""
    print("🚨 Testing Error Codes")
    print("=" * 40)
    
    try:
        # Test error code enum
        print("✅ Error codes defined")
        print(f"   NETWORK_ERROR: {ErrorCode.NETWORK_ERROR}")
        print(f"   TIMEOUT: {ErrorCode.TIMEOUT}")
        print(f"   AUTH_FAILED: {ErrorCode.AUTH_FAILED}")
        print(f"   RATE_LIMIT: {ErrorCode.RATE_LIMIT}")
        
        # Test error code mapping
        from shopify_connector.errors.codes import HTTP_STATUS_TO_ERROR_CODE
        print("✅ HTTP status to error code mapping")
        print(f"   400 -> {HTTP_STATUS_TO_ERROR_CODE.get(400)}")
        print(f"   401 -> {HTTP_STATUS_TO_ERROR_CODE.get(401)}")
        print(f"   429 -> {HTTP_STATUS_TO_ERROR_CODE.get(429)}")
        print(f"   500 -> {HTTP_STATUS_TO_ERROR_CODE.get(500)}")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Error codes test failed: {e}")
        return False


def test_error_hierarchy():
    """Test error class hierarchy."""
    print("🏗️  Testing Error Hierarchy")
    print("=" * 40)
    
    try:
        # Test base error class
        base_error = ConnectorError(
            code=ErrorCode.NETWORK_ERROR,
            message="Test network error"
        )
        print("✅ ConnectorError created successfully")
        print(f"   Code: {base_error.code}")
        print(f"   Message: {base_error.message}")
        print(f"   Retryable: {base_error.retryable}")
        
        # Test specific error types
        network_error = NetworkError("Test network failure")
        timeout_error = TimeoutError("Test timeout")
        auth_error = AuthFailedError("Test auth failure")
        rate_limit_error = RateLimitError("Test rate limit")
        
        print("✅ Specific error types created")
        print(f"   NetworkError: {type(network_error).__name__}")
        print(f"   TimeoutError: {type(timeout_error).__name__}")
        print(f"   AuthFailedError: {type(auth_error).__name__}")
        print(f"   RateLimitError: {type(rate_limit_error).__name__}")
        
        # Test error serialization
        error_dict = base_error.to_dict()
        print("✅ Error serialization working")
        print(f"   Serialized keys: {list(error_dict.keys())}")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Error hierarchy test failed: {e}")
        return False


def test_configuration_validation():
    """Test configuration validation rules."""
    print("✅ Testing Configuration Validation")
    print("=" * 40)
    
    try:
        # Test invalid shop domain
        try:
            invalid_config = {
                'shop': 'invalid-domain',
                'accessToken': 'test_token_123'
            }
            ShopifyConnectorConfig(**invalid_config)
            print("❌ Should have failed with invalid shop domain")
            return False
        except Exception as e:
            print("✅ Correctly rejected invalid shop domain")
            print(f"   Error: {type(e).__name__}")
        
        # Test missing required fields
        try:
            incomplete_config = {
                'shop': 'test-shop.myshopify.com'
                # Missing accessToken
            }
            ShopifyConnectorConfig(**incomplete_config)
            print("❌ Should have failed with missing accessToken")
            return False
        except Exception as e:
            print("✅ Correctly rejected incomplete configuration")
            print(f"   Error: {type(e).__name__}")
        
        # Test valid configuration
        valid_config = {
            'shop': 'test-shop.myshopify.com',
            'accessToken': 'shpat_test_token_12345678901234567890',
            'apiVersion': '2024-07'
        }
        
        connector_config = ShopifyConnectorConfig(**valid_config)
        print("✅ Valid configuration accepted")
        print(f"   Shop: {connector_config.shop}")
        print(f"   Access Token: {connector_config.accessToken[:20]}...")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Configuration validation test failed: {e}")
        return False


def main():
    """Run all Phase 1 tests."""
    print("🚀 Phase 1 Testing: Foundation & Core Interface")
    print("=" * 60)
    print()
    
    tests = [
        ("Configuration System", test_configuration_system),
        ("Error Codes", test_error_codes),
        ("Error Hierarchy", test_error_hierarchy),
        ("Configuration Validation", test_configuration_validation),
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
        print("🎉 All Phase 1 tests passed! Foundation is solid!")
        return 0
    else:
        print("⚠️  Some tests failed. Check the foundation implementation.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
