#!/usr/bin/env python3
"""
Test script for Phase 3 components (Resilience & Rate Limiting).

This script tests the basic functionality of the resilience
and rate limiting components without requiring a real Shopify connection.
"""

import sys
import os
import random

# Add src to path for local development
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from shopify_connector.resilience.retry import RetryPolicy
from shopify_connector.resilience.rate_limiter import TokenBucketRateLimiter
from shopify_connector.resilience.circuit_breaker import CircuitBreaker, CircuitState
from shopify_connector.config.schema import ShopifyConnectorConfig


def test_retry_policy():
    """Test retry policy with exponential backoff and jitter."""
    print("🔄 Testing Retry Policy Components")
    print("=" * 40)
    
    # Create test config
    config = ShopifyConnectorConfig(
        shop="test-store.myshopify.com",
        accessToken="shpat_test_token_12345678901234567890"
    )
    
    try:
        retry_policy = RetryPolicy(config.retry)
        print("✅ RetryPolicy created successfully")
        print(f"   Max attempts: {retry_policy.max_attempts}")
        print(f"   Initial delay: {retry_policy.initial_delay}ms")
        print(f"   Max delay: {retry_policy.max_delay}ms")
        print(f"   Backoff multiplier: {retry_policy.backoff_multiplier}")
        
        # Test retry decision logic
        from shopify_connector import NetworkError, TimeoutError
        
        # Test network error (should retry)
        should_retry = retry_policy.should_retry(NetworkError("Connection failed"), 1)
        print(f"   Network error retry (attempt 1): {should_retry}")
        
        # Test max attempts
        should_retry = retry_policy.should_retry(NetworkError("Connection failed"), 5)
        print(f"   Network error retry (attempt 5): {should_retry}")
        
        # Test delay calculation
        delay1 = retry_policy.calculate_delay(1)
        delay2 = retry_policy.calculate_delay(2)
        delay3 = retry_policy.calculate_delay(3)
        print(f"   Delay attempt 1: {delay1}ms")
        print(f"   Delay attempt 2: {delay2}ms")
        print(f"   Delay attempt 3: {delay3}ms")
        
        # Test retry info
        retry_info = retry_policy.get_retry_info()
        print(f"   Retry info: {retry_info}")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Retry policy test failed: {e}")
        return False


def test_rate_limiter():
    """Test token bucket rate limiter."""
    print("⏱️  Testing Rate Limiter Components")
    print("=" * 40)
    
    # Create test config
    config = ShopifyConnectorConfig(
        shop="test-store.myshopify.com",
        accessToken="shpat_test_token_12345678901234567890"
    )
    
    try:
        rate_limiter = TokenBucketRateLimiter(config.rateLimit)
        print("✅ TokenBucketRateLimiter created successfully")
        print(f"   Max tokens: {rate_limiter.max_tokens}")
        print(f"   Refill rate: {rate_limiter.refill_rate} tokens/sec")
        print(f"   Burst size: {rate_limiter.burst_size}")
        
        # Test immediate slot acquisition
        acquired = rate_limiter.acquire_slot()
        print(f"   Immediate slot acquisition: {acquired}")
        
        # Test stats
        stats = rate_limiter.get_stats()
        print(f"   Stats: {stats}")
        
        # Test header parsing simulation
        test_headers = {
            'X-Shopify-Shop-Api-Call-Limit': '35/40',
            'Retry-After': '5'
        }
        rate_limiter.update_from_headers(test_headers)
        print("✅ Rate limit updated from headers")
        
        # Test updated stats
        updated_stats = rate_limiter.get_stats()
        print(f"   Updated stats: {updated_stats}")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Rate limiter test failed: {e}")
        return False


def test_circuit_breaker():
    """Test circuit breaker pattern."""
    print("🔌 Testing Circuit Breaker Components")
    print("=" * 40)
    
    # Create test config
    config = ShopifyConnectorConfig(
        shop="test-store.myshopify.com",
        accessToken="shpat_test_token_12345678901234567890"
    )
    
    try:
        circuit_breaker = CircuitBreaker(config.circuitBreaker)
        print("✅ CircuitBreaker created successfully")
        print(f"   Failure threshold: {circuit_breaker.failure_threshold}")
        print(f"   Recovery timeout: {circuit_breaker.recovery_timeout}s")
        print(f"   Minimum requests: {circuit_breaker.minimum_requests}")
        
        # Test initial state
        print(f"   Initial state: {circuit_breaker.state.value}")
        print(f"   Is closed: {circuit_breaker.is_closed()}")
        print(f"   Is open: {circuit_breaker.is_open()}")
        
        # Test successful call
        def success_func():
            return "success"
        
        result = circuit_breaker.call(success_func)
        print(f"   Successful call result: {result}")
        
        # Test failed call
        def failure_func():
            raise Exception("Simulated failure")
        
        try:
            circuit_breaker.call(failure_func)
        except Exception as e:
            print(f"   Expected failure caught: {e}")
        
        # Test stats
        stats = circuit_breaker.get_stats()
        print(f"   Stats: {stats}")
        
        # Test force operations
        circuit_breaker.force_open()
        print(f"   Forced open state: {circuit_breaker.state.value}")
        
        circuit_breaker.force_close()
        print(f"   Forced closed state: {circuit_breaker.state.value}")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Circuit breaker test failed: {e}")
        return False


def test_resilience_integration():
    """Test resilience components working together."""
    print("🔗 Testing Resilience Integration")
    print("=" * 40)
    
    # Create test config
    config = ShopifyConnectorConfig(
        shop="test-store.myshopify.com",
        accessToken="shpat_test_token_12345678901234567890"
    )
    
    try:
        # Create all resilience components
        retry_policy = RetryPolicy(config.retry)
        rate_limiter = TokenBucketRateLimiter(config.rateLimit)
        circuit_breaker = CircuitBreaker(config.circuitBreaker)
        
        print("✅ All resilience components created successfully")
        
        # Test component interaction
        print(f"   Retry policy: {retry_policy}")
        print(f"   Rate limiter: {rate_limiter}")
        print(f"   Circuit breaker: {circuit_breaker}")
        
        # Test rate limiter with circuit breaker
        def test_func():
            # Simulate rate limiting
            if random.random() < 0.3:  # 30% chance of failure
                raise Exception("Simulated rate limit")
            return "success"
        
        # Test multiple calls
        for i in range(5):
            try:
                result = circuit_breaker.call(test_func)
                print(f"   Call {i+1}: {result}")
            except Exception as e:
                print(f"   Call {i+1}: Failed - {e}")
        
        # Test final states
        print(f"   Final circuit breaker state: {circuit_breaker.state.value}")
        print(f"   Final rate limiter tokens: {rate_limiter.tokens:.1f}")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Resilience integration test failed: {e}")
        return False


def main():
    """Run all Phase 3 tests."""
    print("🚀 Phase 3 Testing: Resilience & Rate Limiting")
    print("=" * 60)
    print()
    
    tests = [
        ("Retry Policy", test_retry_policy),
        ("Rate Limiter", test_rate_limiter),
        ("Circuit Breaker", test_circuit_breaker),
        ("Resilience Integration", test_resilience_integration),
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
        print("🎉 All Phase 3 tests passed! Ready for Phase 4.")
        return 0
    else:
        print("⚠️  Some tests failed. Check the implementation.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
