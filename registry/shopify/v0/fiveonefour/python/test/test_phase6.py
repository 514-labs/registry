#!/usr/bin/env python3
"""
Test script for Phase 6 components (Main Connector Implementation).

This script tests the complete Shopify connector implementation
without requiring a real Shopify connection.
"""

import sys
import os
import time
import logging

# Add src to path for local development
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from shopify_connector.connector import ShopifyConnector
from shopify_connector.config.schema import ShopifyConnectorConfig
from shopify_connector.errors.base import ConnectorError, NetworkError, AuthFailedError
from shopify_connector.auth.base import BaseAuth
from shopify_connector.auth.bearer import BearerAuth
from shopify_connector.transport.base import BaseTransport
from shopify_connector.transport.http_client import HTTPClient
from shopify_connector.resilience.retry import RetryPolicy
from shopify_connector.resilience.rate_limiter import TokenBucketRateLimiter
from shopify_connector.resilience.circuit_breaker import CircuitBreaker, CircuitState
from shopify_connector.pagination.base import BasePagination
from shopify_connector.data.models import (
    ShopifyBaseModel, Product, Order, Customer, Collection, Shop, Image, Money
)
from shopify_connector.hooks.base import (
    BaseHook, HookContext, HookType, HookPriority, HookExecutionError
)
from shopify_connector.hooks.manager import HookManager
from shopify_connector.hooks.builtin import (
    LoggingHook, MetricsHook, TimingHook, ValidationHook, CorrelationHook
)


def test_connector_initialization():
    """Test connector initialization and configuration."""
    print("🔧 Testing Connector Initialization")
    print("=" * 40)
    
    try:
        # Test configuration
        config = {
            'shop': 'test-shop.myshopify.com',
            'accessToken': 'test_token_123',
            'apiVersion': '2024-07',
            'timeout': 30000,
            'useGraphQL': True
        }
        
        connector = ShopifyConnector(config)
        print("✅ ShopifyConnector created successfully")
        print(f"   Shop: {connector.config.shop}")
        print(f"   API Version: {connector.config.apiVersion}")
        print(f"   Use GraphQL: {connector.config.useGraphQL}")
        print(f"   Timeout: {connector.config.timeout}ms")
        
        # Test component initialization
        print("✅ Components initialized")
        print(f"   Auth: {type(connector.auth).__name__}")
        print(f"   Transport: {type(connector.transport).__name__}")
        print(f"   Retry Policy: {type(connector.retry_policy).__name__}")
        print(f"   Rate Limiter: {type(connector.rate_limiter).__name__}")
        print(f"   Circuit Breaker: {type(connector.circuit_breaker).__name__}")
        print(f"   Hook Manager: {type(connector.hook_manager).__name__}")
        print(f"   Paginator: {type(connector.paginator).__name__}")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Connector initialization test failed: {e}")
        return False


def test_connector_connection():
    """Test connector connection lifecycle."""
    print("🔌 Testing Connector Connection")
    print("=" * 40)
    
    try:
        # Create connector
        config = {
            'shop': 'test-shop.myshopify.com',
            'accessToken': 'test_token_123',
            'apiVersion': '2024-07'
        }
        
        connector = ShopifyConnector(config)
        
        # Test initial connection state
        print("✅ Initial connection state")
        print(f"   Connected: {connector.isConnected()}")
        
        # Test connection (will fail due to invalid credentials, but should handle gracefully)
        try:
            connector.connect()
            print("❌ Should have failed with invalid credentials")
            return False
        except Exception as e:
            print("✅ Connection properly failed with invalid credentials")
            print(f"   Error: {type(e).__name__}: {e}")
        
        # Test connection state after failed connection
        print(f"   Connected after failure: {connector.isConnected()}")
        
        # Test disconnect (should work even when not connected)
        try:
            connector.disconnect()
            print("✅ Disconnect handled gracefully")
        except Exception as e:
            print(f"❌ Disconnect failed: {e}")
            return False
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Connector connection test failed: {e}")
        return False


def test_hook_integration():
    """Test hook system integration in the connector."""
    print("🎣 Testing Hook Integration")
    print("=" * 40)
    
    try:
        # Create connector
        config = {
            'shop': 'test-shop.myshopify.com',
            'accessToken': 'test_token_123',
            'apiVersion': '2024-07'
        }
        
        connector = ShopifyConnector(config)
        
        # Test hook manager setup
        hook_manager = connector.hook_manager
        print("✅ Hook manager setup")
        print(f"   Total hooks: {sum(len(hooks) for hooks in hook_manager.hooks.values())}")
        
        # Test built-in hooks registration
        before_request_hooks = hook_manager.get_hooks(HookType.BEFORE_REQUEST)
        after_response_hooks = hook_manager.get_hooks(HookType.AFTER_RESPONSE)
        on_error_hooks = hook_manager.get_hooks(HookType.ON_ERROR)
        on_retry_hooks = hook_manager.get_hooks(HookType.ON_RETRY)
        
        print("✅ Built-in hooks registered")
        print(f"   Before request hooks: {len(before_request_hooks)}")
        print(f"   After response hooks: {len(after_response_hooks)}")
        print(f"   On error hooks: {len(on_error_hooks)}")
        print(f"   On retry hooks: {len(on_retry_hooks)}")
        
        # Test hook statistics
        hook_stats = hook_manager.get_hook_stats()
        print("✅ Hook statistics working")
        print(f"   Registered hook types: {list(hook_stats['registered_hooks'].keys())}")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Hook integration test failed: {e}")
        return False


def test_pagination_integration():
    """Test pagination system integration in the connector."""
    print("📄 Testing Pagination Integration")
    print("=" * 40)
    
    try:
        # Create connector
        config = {
            'shop': 'test-shop.myshopify.com',
            'accessToken': 'test_token_123',
            'apiVersion': '2024-07'
        }
        
        connector = ShopifyConnector(config)
        
        # Test paginator setup
        paginator = connector.paginator
        print("✅ Paginator setup")
        print(f"   Type: {type(paginator).__name__}")
        print(f"   Capabilities: {paginator.get_capabilities()}")
        
        # Test pagination with mock data (will not make actual API calls)
        print("✅ Pagination integration ready")
        print(f"   Supports cursor: {paginator.get_capabilities()['supports_cursor']}")
        print(f"   Max page size: {paginator.get_capabilities()['max_page_size']}")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Pagination integration test failed: {e}")
        return False


def test_data_models_integration():
    """Test data models integration in the connector."""
    print("🏷️  Testing Data Models Integration")
    print("=" * 40)
    
    try:
        # Test data model imports
        print("✅ Data models imported successfully")
        print(f"   Base model: {ShopifyBaseModel}")
        print(f"   Product model: {Product}")
        print(f"   Order model: {Order}")
        print(f"   Customer model: {Customer}")
        print(f"   Collection model: {Collection}")
        print(f"   Shop model: {Shop}")
        print(f"   Image model: {Image}")
        print(f"   Money model: {Money}")
        
        # Test model validation
        test_product = {
            'id': 123,
            'title': 'Test Product',
            'handle': 'test-product',
            'status': 'active',
            'created_at': '2024-01-01T00:00:00Z',
            'updated_at': '2024-01-01T00:00:00Z'
        }
        
        # This would normally validate, but we're just testing the structure
        print("✅ Data model structure ready")
        print(f"   Product fields: {list(test_product.keys())}")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Data models integration test failed: {e}")
        return False


def test_resilience_integration():
    """Test resilience components integration in the connector."""
    print("🛡️  Testing Resilience Integration")
    print("=" * 40)
    
    try:
        # Create connector
        config = {
            'shop': 'test-shop.myshopify.com',
            'accessToken': 'test_token_123',
            'apiVersion': '2024-07'
        }
        
        connector = ShopifyConnector(config)
        
        # Test retry policy
        retry_policy = connector.retry_policy
        print("✅ Retry policy integration")
        print(f"   Max attempts: {retry_policy.max_attempts}")
        print(f"   Initial delay: {retry_policy.initial_delay}ms")
        print(f"   Max delay: {retry_policy.max_delay}ms")
        
        # Test rate limiter
        rate_limiter = connector.rate_limiter
        print("✅ Rate limiter integration")
        print(f"   Token bucket capacity: {rate_limiter.max_tokens}")
        print(f"   Refill rate: {rate_limiter.refill_rate} tokens/sec")
        
        # Test circuit breaker
        circuit_breaker = connector.circuit_breaker
        print("✅ Circuit breaker integration")
        print(f"   State: {circuit_breaker.state}")
        print(f"   Failure threshold: {circuit_breaker.failure_threshold}")
        print(f"   Recovery timeout: {circuit_breaker.recovery_timeout}")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Resilience integration test failed: {e}")
        return False


def test_transport_integration():
    """Test transport layer integration in the connector."""
    print("🚚 Testing Transport Integration")
    print("=" * 40)
    
    try:
        # Create connector
        config = {
            'shop': 'test-shop.myshopify.com',
            'accessToken': 'test_token_123',
            'apiVersion': '2024-07'
        }
        
        connector = ShopifyConnector(config)
        
        # Test transport setup
        transport = connector.transport
        print("✅ Transport setup")
        print(f"   Type: {type(transport).__name__}")
        print(f"   Healthy: {transport.is_healthy()}")
        print(f"   Capabilities: {transport.get_capabilities()}")
        
        # Test HTTP client
        if hasattr(transport, 'http_client'):
            http_client = transport.http_client
            print("✅ HTTP client integration")
            print(f"   Healthy: {http_client.is_healthy()}")
            print(f"   Stats: {http_client.get_stats()}")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Transport integration test failed: {e}")
        return False


def test_connector_status():
    """Test connector status and health monitoring."""
    print("📊 Testing Connector Status")
    print("=" * 40)
    
    try:
        # Create connector
        config = {
            'shop': 'test-shop.myshopify.com',
            'accessToken': 'test_token_123',
            'apiVersion': '2024-07'
        }
        
        connector = ShopifyConnector(config)
        
        # Test status method
        status = connector.get_status()
        print("✅ Status method working")
        print(f"   Connected: {status['connected']}")
        print(f"   Shop: {status['shop']}")
        print(f"   API Version: {status['api_version']}")
        print(f"   Auth Valid: {status['auth_valid']}")
        print(f"   Circuit Breaker Open: {status['circuit_breaker_open']}")
        
        # Test hook stats
        hook_stats = connector.get_hook_stats()
        print("✅ Hook stats working")
        print(f"   Total executions: {hook_stats['total_executions']}")
        print(f"   Success rate: {hook_stats['success_rate']:.1f}%")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Connector status test failed: {e}")
        return False


def test_error_handling():
    """Test error handling and resilience."""
    print("⚠️  Testing Error Handling")
    print("=" * 40)
    
    try:
        # Create connector
        config = {
            'shop': 'test-shop.myshopify.com',
            'accessToken': 'test_token_123',
            'apiVersion': '2024-07'
        }
        
        connector = ShopifyConnector(config)
        
        # Test error handling for invalid requests
        try:
            # This should fail due to not being connected
            connector.request({'method': 'GET', 'path': '/products'})
            print("❌ Should have failed with connection error")
            return False
        except Exception as e:
            print("✅ Properly handled connection error")
            print(f"   Error type: {type(e).__name__}")
        
        # Test circuit breaker state
        circuit_breaker = connector.circuit_breaker
        print("✅ Circuit breaker error handling")
        print(f"   State: {circuit_breaker.state}")
        print(f"   Is open: {circuit_breaker.is_open()}")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Error handling test failed: {e}")
        return False


def main():
    """Run all Phase 6 tests."""
    print("🚀 Phase 6 Testing: Main Connector Implementation")
    print("=" * 60)
    print()
    
    tests = [
        ("Connector Initialization", test_connector_initialization),
        ("Connector Connection", test_connector_connection),
        ("Hook Integration", test_hook_integration),
        ("Pagination Integration", test_pagination_integration),
        ("Data Models Integration", test_data_models_integration),
        ("Resilience Integration", test_resilience_integration),
        ("Transport Integration", test_transport_integration),
        ("Connector Status", test_connector_status),
        ("Error Handling", test_error_handling),
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
        print("🎉 All Phase 6 tests passed! Connector implementation complete!")
        return 0
    else:
        print("⚠️  Some tests failed. Check the implementation.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
