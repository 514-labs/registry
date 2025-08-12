# Testing Strategy

This document describes the comprehensive testing approach for the Shopify connector, including unit tests, integration tests, and testing best practices.

## Testing Philosophy

Our testing strategy follows these principles:

- **Comprehensive Coverage**: Test all public methods and edge cases
- **Realistic Scenarios**: Use realistic Shopify API responses and error conditions
- **Performance Testing**: Validate rate limiting and concurrency behavior
- **Compliance Verification**: Ensure adherence to our API connector specification

## Test Categories

### **Unit Tests**

Unit tests focus on individual components and methods in isolation.

#### **HTTP Client and Headers**

```python
def test_http_client_headers():
    from shopify_connector.transport.http_client import HTTPClient
    from shopify_connector.config.schema import ShopifyConnectorConfig

    cfg = ShopifyConnectorConfig(shop="test-store.myshopify.com", accessToken="shpat_test_token_12345678901234567890")
    client = HTTPClient(cfg)
    result = client.request("GET", cfg.get_graphql_url())  # Will likely 401 in unit context; use mocking in CI
    # In practice, mock client.request and assert headers are present
```

#### **Authentication Tests**

```python
def test_auth_header_injection():
    """Test that authentication headers are properly injected"""
    auth = BearerAuth(config['accessToken'])
    request = {'headers': {}}
    
    auth.authenticate(request)
    assert request['headers']['X-Shopify-Access-Token'] == config['accessToken']

def test_invalid_token_handling():
    """Test behavior with invalid or expired tokens"""
    connector = ShopifyConnector(config_with_invalid_token)
    
    with pytest.raises(AuthFailedError):
        connector.get('/products')
```

#### **Retry Policy Tests**

```python
def test_retry_matrix():
    """Test retry decisions for various error conditions"""
     from shopify_connector.resilience.retry import RetryPolicy
     from shopify_connector.config.schema import ShopifyConnectorConfig
     cfg = ShopifyConnectorConfig(shop="test-shop.myshopify.com", accessToken="shpat_test_token_12345678901234567890")
     retry_policy = RetryPolicy(cfg.retry)
    
    # Test retryable errors
    assert retry_policy.should_retry(NetworkError(), 1) == True
    assert retry_policy.should_retry(HTTPError(429), 1) == True
    assert retry_policy.should_retry(HTTPError(500), 1) == True
    
    # Test non-retryable errors
    assert retry_policy.should_retry(HTTPError(400), 1) == False
    assert retry_policy.should_retry(HTTPError(403), 1) == False

def test_backoff_with_jitter():
    """Test exponential backoff with jitter calculation"""
    retry_policy = RetryPolicy(config['retry'])
    
    delays = []
    for attempt in range(1, 6):
        delay = retry_policy.calculate_delay(attempt)
        delays.append(delay)
        
        # Verify delay is within expected range
        expected_min = config['retry']['initialDelay'] * (2 ** (attempt - 1)) * 0.5
        expected_max = min(
            config['retry']['initialDelay'] * (2 ** (attempt - 1)),
            config['retry']['maxDelay']
        )
        assert expected_min <= delay <= expected_max

def test_retry_after_respect():
    """Test that Retry-After headers are respected"""
    retry_policy = RetryPolicy(config['retry'])
    
    # Mock response with Retry-After header
    response = MockResponse(429, headers={'Retry-After': '5'})
    
    delay = retry_policy.calculate_delay_with_retry_after(response, 1)
    assert delay == 5000  # 5 seconds in milliseconds
```

#### **Rate Limiter Tests**

```python
def test_token_bucket_behavior():
    """Test token bucket rate limiting behavior"""
     from shopify_connector.resilience.rate_limiter import TokenBucketRateLimiter
     from shopify_connector.config.schema import ShopifyConnectorConfig
     cfg = ShopifyConnectorConfig(shop="test-shop.myshopify.com", accessToken="shpat_test_token_12345678901234567890")
     limiter = TokenBucketRateLimiter(cfg.rateLimit)
    
    # Test steady state
    for _ in range(40):
        assert limiter.can_proceed() == True
    
    # Test burst exhaustion
    assert limiter.can_proceed() == False
    
    # Test token refill
    time.sleep(1)
    assert limiter.can_proceed() == True

def test_adaptive_rate_limiting():
    """Test adaptive rate limiting from Shopify headers"""
    limiter = AdaptiveRateLimiter(config['rateLimit'])
    
    # Mock response with rate limit headers
    response = MockResponse(200, headers={
        'X-Shopify-Shop-Api-Call-Limit': '35/40'
    })
    
    limiter.update_from_response(response.headers)
    
    # Should slow down as we approach limit
    assert limiter.get_current_rate() < 2.0
```

#### **Pagination Tests**

```python
def test_link_header_parsing():
    """Test parsing of Shopify Link headers"""
    parser = LinkHeaderParser()
    
    link_header = '<https://shop.myshopify.com/admin/api/2024-07/products.json?page_info=eyJkaXJlY3Rpb24iOiJuZXh0IiwibGFzdF9pZCI6MTIzfQ==&limit=250>; rel="next"'
    
    links = parser.parse(link_header)
    assert links['next'] == {
        'url': 'https://shop.myshopify.com/admin/api/2024-07/products.json',
        'page_info': 'eyJkaXJlY3Rpb24iOiJuZXh0IiwibGFzdF9pZCI6MTIzfQ==',
        'limit': '250'
    }

def test_pagination_iterator():
    """Test pagination iterator behavior"""
     from shopify_connector.connector import ShopifyConnector
     from shopify_connector.config.schema import ShopifyConnectorConfig
     cfg = ShopifyConnectorConfig(shop="test-shop.myshopify.com", accessToken="shpat_test_token_12345678901234567890")
     connector = ShopifyConnector(cfg)
     # For unit tests, patch GraphQLTransport.execute to yield GraphQL-shaped pages (edges/pageInfo)
```

#### **Error Mapping Tests**

```python
def test_error_code_mapping():
    """Test mapping of Shopify errors to standardized codes"""
     from shopify_connector.errors.codes import get_error_code_from_status
    
     # Test various status mappings
     assert get_error_code_from_status(401).value == 'AUTH_FAILED'
    assert mapper.map_error(HTTPError(403)) == 'AUTH_FAILED'
    assert mapper.map_error(HTTPError(404)) == 'INVALID_REQUEST'
    assert mapper.map_error(HTTPError(429)) == 'RATE_LIMIT'
    assert mapper.map_error(HTTPError(500)) == 'SERVER_ERROR'

def test_request_id_preservation():
    """Test that Shopify request IDs are preserved"""
    connector = ShopifyConnector(config)
    
    with patch.object(connector, '_execute_request') as mock_request:
        mock_request.return_value = MockResponse(200, headers={
            'X-Request-Id': 'test-request-123'
        })
        
        response = connector.get('/products')
        assert response['meta']['requestId'] == 'test-request-123'
```

#### **Hooks Tests**

```python
def test_hook_priority_ordering():
    """Test that hooks execute in priority order"""
    connector = ShopifyConnector(config)
    
    execution_order = []
    
    def hook1(context):
        execution_order.append(1)
    
    def hook2(context):
        execution_order.append(2)
    
     from shopify_connector.hooks.manager import HookManager
     from shopify_connector.hooks.base import HookContext, HookType, HookPriority, BaseHook
     manager = HookManager()
     # Add simple ordered hooks and execute via manager on HookType.BEFORE_REQUEST
    
    # Lower priority (100) should execute first
    assert execution_order == [2, 1]

def test_hook_request_modification():
    """Test that hooks can modify requests"""
    connector = ShopifyConnector(config)
    
    def add_header_hook(context):
        context.modify_request({'headers': {'Custom-Header': 'value'}})
    
    connector.add_hook('beforeRequest', add_header_hook)
    
    with patch.object(connector, '_execute_request') as mock_request:
        connector.get('/products')
        
        # Verify custom header was added
        call_args = mock_request.call_args
        assert call_args[1]['headers']['Custom-Header'] == 'value'
```

### **Integration Tests (Mocked)**

Integration tests use mocked HTTP responses to simulate real Shopify API behavior.

#### **Mock Server Setup**

```python
@pytest.fixture
def mock_shopify_server():
    """Mock Shopify server for integration testing"""
    with responses.RequestsMock() as rsps:
        # Mock successful product response
         # Prefer mocking GraphQLTransport.execute responses in unit tests
        
        # Mock paginated response
        rsps.add(
            responses.GET,
            'https://test-store.myshopify.com/admin/api/2024-07/products.json?limit=2',
            json={'products': [{'id': 1}, {'id': 2}]},
            status=200,
            headers={
                'X-Shopify-Shop-Api-Call-Limit': '2/40',
                'Link': '<https://shop.myshopify.com/admin/api/2024-07/products.json?page_info=next&limit=2>; rel="next"'
            }
        )
        
        yield rsps
```

#### **Response Simulation Tests**

```python
def test_200_response_handling(mock_shopify_server):
    """Test handling of successful responses"""
    connector = ShopifyConnector(config)
    connector.connect()
    
    response = connector.get('/products')
    
    assert response['status'] == 200
    assert 'products' in response['data']
    assert response['meta']['rateLimit']['remaining'] == '1'

def test_429_with_retry_after(mock_shopify_server):
    """Test rate limit handling with Retry-After"""
    # Mock 429 response with Retry-After
    mock_shopify_server.add(
        responses.GET,
        'https://test-store.myshopify.com/admin/api/2024-07/products.json',
        status=429,
        headers={'Retry-After': '2'}
    )
    
    # Mock successful response after retry
    mock_shopify_server.add(
        responses.GET,
        'https://test-store.myshopify.com/admin/api/2024-07/products.json',
        json={'products': []},
        status=200
    )
    
    connector = ShopifyConnector(config)
    connector.connect()
    
    response = connector.get('/products')
    
    assert response['status'] == 200
    # Verify retry occurred
    assert response['meta']['retryCount'] > 0
```

#### **Multi-Page Flow Tests**

```python
def test_link_header_pagination(mock_shopify_server):
    """Test pagination using Link headers"""
    # Mock first page
    mock_shopify_server.add(
        responses.GET,
        'https://test-store.myshopify.com/admin/api/2024-07/products.json?limit=2',
        json={'products': [{'id': 1}, {'id': 2}]},
        status=200,
        headers={
            'Link': '<https://shop.myshopify.com/admin/api/2024-07/products.json?page_info=next&limit=2>; rel="next"'
        }
    )
    
    # Mock second page
    mock_shopify_server.add(
        responses.GET,
        'https://test-store.myshopify.com/admin/api/2024-07/products.json?page_info=next&limit=2',
        json={'products': [{'id': 3}, {'id': 4}]},
        status=200
    )
    
    connector = ShopifyConnector(config)
    connector.connect()
    
    products = list(connector.paginate('/products', {'limit': 2}))
    
    assert len(products) == 2  # Two pages
    assert len(products[0]) == 2  # First page has 2 products
    assert len(products[1]) == 2  # Second page has 2 products
```

### **Live Smoke Tests (Dev Store)**

Optional tests against a real Shopify development store to validate real API behavior.

#### **Test Store Setup**

```python
@pytest.fixture(scope="session")
def live_shopify_connector():
    """Live connector for smoke testing"""
     from shopify_connector.config.schema import ShopifyConnectorConfig
     cfg = ShopifyConnectorConfig(
         shop=os.environ["SHOPIFY_SHOP"],
         apiVersion=os.environ.get("SHOPIFY_API_VERSION", "2025-07"),
         accessToken=os.environ["SHOPIFY_ACCESS_TOKEN"],
     )
     connector = ShopifyConnector(cfg)
    connector.connect()
    
    yield connector
    
    connector.disconnect()
```

#### **Live API Tests**

```python
@pytest.mark.live
def test_live_shop_endpoint(live_shopify_connector):
    """Test live shop endpoint"""
     response = live_shopify_connector.get('/shop')
    
    assert response['status'] == 200
    assert 'shop' in response['data']
    assert 'name' in response['data']['shop']

@pytest.mark.live
def test_live_rate_limit_headers(live_shopify_connector):
    """Test live rate limit headers"""
     response = live_shopify_connector.get('/orders')
    
    assert 'X-Shopify-Shop-Api-Call-Limit' in response['headers']
    rate_limit = response['meta']['rateLimit']
    assert 'limit' in rate_limit
    assert 'remaining' in rate_limit
```

### **Rate Limit and Concurrency Tests**

```python
def test_concurrency_enforcement():
    """Test that concurrency limits are enforced"""
    connector = ShopifyConnector(config)
    connector.connect()
    
    # Configure low concurrency limit
    connector.config['rateLimit']['concurrentRequests'] = 2
    
    # Start multiple concurrent requests
    futures = []
    for i in range(5):
        future = executor.submit(connector.get, f'/products?limit={i+1}')
        futures.append(future)
    
    # Wait for all to complete
    responses = [f.result() for f in futures]
    
    # Verify all succeeded
    assert all(r['status'] == 200 for r in responses)
    
    # Verify concurrency was limited (check logs or metrics)

def test_rate_limit_steady_state():
    """Test steady-state rate limiting"""
    connector = ShopifyConnector(config)
    connector.connect()
    
    start_time = time.time()
    
    # Make multiple requests
    for i in range(10):
        connector.get('/products')
    
    end_time = time.time()
    
    # Should take at least 5 seconds (10 requests / 2 per second)
    assert (end_time - start_time) >= 5.0
```

### **Pagination Edge Cases**

```python
def test_empty_last_page():
    """Test handling of empty last page"""
    connector = ShopifyConnector(config)
    
    with patch.object(connector, '_execute_request') as mock_request:
        # Mock empty response
        mock_request.return_value = MockPaginatedResponse([], has_next=False)
        
        products = list(connector.paginate('/products'))
        
        assert len(products) == 1  # One page
        assert len(products[0]) == 0  # Empty page

def test_missing_link_header():
    """Test handling of missing Link header"""
    connector = ShopifyConnector(config)
    
    with patch.object(connector, '_execute_request') as mock_request:
        # Mock response without Link header
        mock_request.return_value = MockPaginatedResponse(['product1'], has_next=False)
        
        products = list(connector.paginate('/products'))
        
        assert len(products) == 1
        assert len(products[0]) == 1
```

### **Incremental Sync Tests**

```python
def test_bookmark_persistence():
    """Test that bookmarks are properly persisted"""
    connector = ShopifyConnector(config)
    
    # Mock first sync
    with patch.object(connector, '_execute_request') as mock_request:
        mock_request.return_value = MockPaginatedResponse(
            ['product1', 'product2'], 
            has_next=False,
            last_updated='2024-01-01T12:00:00Z'
        )
        
        products = list(connector.paginate('/products'))
        connector.save_bookmark('products', 'last_sync', '2024-01-01T12:00:00Z')
    
    # Mock second sync with updated_at_min
    with patch.object(connector, '_execute_request') as mock_request:
        mock_request.return_value = MockPaginatedResponse(
            ['product3'], 
            has_next=False
        )
        
        # Should use bookmark for incremental sync
        products = list(connector.paginate('/products', {
            'updated_at_min': connector.get_bookmark('products', 'last_sync')
        }))
        
        assert len(products) == 1
        assert products[0][0] == 'product3'
```

### **Conformance Checks**

Automated tests to verify compliance with our API connector specification.

```python
def test_response_meta_structure():
    """Test that response meta contains all required fields"""
    connector = ShopifyConnector(config)
    
    response = connector.get('/products')
    
    required_meta_fields = ['timestamp', 'duration', 'retryCount', 'rateLimit', 'requestId']
    for field in required_meta_fields:
        assert field in response['meta'], f"Missing required meta field: {field}"

def test_logging_redaction():
    """Test that sensitive information is redacted in logs"""
    connector = ShopifyConnector(config)
    
    # Capture log output
    with caplog.at_level(logging.INFO):
        connector.get('/products')
    
    # Verify access token is redacted
    assert 'shpat_xxx' not in caplog.text
    assert '***REDACTED***' in caplog.text

def test_error_shape_consistency():
    """Test that errors follow consistent shape"""
    connector = ShopifyConnector(config)
    
    with patch.object(connector, '_execute_request') as mock_request:
        mock_request.side_effect = HTTPError(401)
        
        try:
            connector.get('/products')
        except ConnectorError as e:
            # Verify error structure
            assert hasattr(e, 'code')
            assert hasattr(e, 'message')
            assert hasattr(e, 'statusCode')
            assert hasattr(e, 'retryable')
            assert hasattr(e, 'requestId')
```

## Test Configuration

### **Test Environment Setup**

```python
# conftest.py
import pytest
import os

@pytest.fixture(scope="session")
def test_config():
    """Test configuration for all tests"""
    return {
        "shop": "test-store.myshopify.com",
        "apiVersion": "2024-07",
        "accessToken": "shpat_test_token",
        "timeout": 5000,
        "retry": {
            "maxAttempts": 2,
            "initialDelay": 100,
            "maxDelay": 1000
        },
        "rateLimit": {
            "concurrentRequests": 2,
            "requestsPerSecond": 1,
            "burstCapacity": 10
        }
    }
```

### **Mock Data Fixtures**

```python
@pytest.fixture
def sample_products():
    """Sample product data for testing"""
    return [
        {
            "id": 1,
            "title": "Test Product 1",
            "status": "active",
            "created_at": "2024-01-01T12:00:00Z",
            "updated_at": "2024-01-01T12:00:00Z"
        },
        {
            "id": 2,
            "title": "Test Product 2",
            "status": "active",
            "created_at": "2024-01-01T12:00:00Z",
            "updated_at": "2024-01-01T12:00:00Z"
        }
    ]
```

## Running Tests

### **Command Line**

```bash
# Run all tests
pytest

# Run specific test categories
pytest tests/unit/
pytest tests/integration/
pytest tests/live/

# Run with coverage
pytest --cov=shopify_connector

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/unit/test_auth.py
```

### **Continuous Integration**

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      
      - run: pip install -r requirements-dev.txt
      - run: pytest --cov=shopify_connector --cov-report=xml
      - run: pytest tests/live/ --runxfail  # Run live tests but don't fail
```

## Performance Testing

### **Load Testing**

```python
def test_concurrent_load():
    """Test connector under concurrent load"""
    connector = ShopifyConnector(config)
    connector.connect()
    
    start_time = time.time()
    
    # Simulate concurrent users
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [
            executor.submit(connector.get, '/products')
            for _ in range(100)
        ]
        
        responses = [f.result() for f in futures]
    
    end_time = time.time()
    
    # All requests should succeed
    assert all(r['status'] == 200 for r in responses)
    
    # Should complete within reasonable time
    assert (end_time - start_time) < 60  # 60 seconds
    
    # Check rate limiting was respected
    # (implementation specific)
```

### **Memory Testing**

```python
def test_memory_usage():
    """Test memory usage during large pagination"""
    connector = ShopifyConnector(config)
    connector.connect()
    
    # Monitor memory usage
    import psutil
    process = psutil.Process()
    initial_memory = process.memory_info().rss
    
    # Paginate through large dataset
    products = list(connector.paginate('/products', {'limit': 250}))
    
    final_memory = process.memory_info().rss
    memory_increase = final_memory - initial_memory
    
    # Memory increase should be reasonable (not exponential)
    assert memory_increase < 100 * 1024 * 1024  # 100MB
```

## Best Practices

### **Test Organization**

1. **Group related tests** in test classes or modules
2. **Use descriptive test names** that explain the scenario
3. **Keep tests independent** - no shared state between tests
4. **Use fixtures** for common setup and teardown

### **Mocking Strategy**

1. **Mock external dependencies** (HTTP requests, file system)
2. **Use realistic mock data** that matches real API responses
3. **Test error conditions** with appropriate mock responses
4. **Verify mock interactions** to ensure correct behavior

### **Test Data Management**

1. **Use factories** to generate test data
2. **Keep test data minimal** but realistic
3. **Clean up test data** after tests complete
4. **Use environment variables** for live test configuration

### **Performance Considerations**

1. **Run performance tests** in isolation
2. **Use realistic data volumes** for load testing
3. **Monitor resource usage** during tests
4. **Set appropriate timeouts** for long-running tests

## Troubleshooting Tests

### **Common Issues**

1. **Flaky tests**: Add retries or increase timeouts
2. **Mock setup errors**: Verify mock configuration and response format
3. **Environment issues**: Check environment variables and dependencies
4. **Rate limiting**: Use appropriate test configuration with lower limits

### **Debug Mode**

```python
# Enable debug logging for tests
import logging
logging.basicConfig(level=logging.DEBUG)

# Or use pytest's caplog fixture
def test_with_debug(caplog):
    caplog.set_level(logging.DEBUG)
    # ... test code ...
    print(caplog.text)  # View captured logs
```
