# Why GraphQL Under the Hood?

## Executive Summary

This connector uses **Shopify's GraphQL Admin API** as the underlying transport mechanism while maintaining **100% compliance** with our API Connector Specification (`api-connector.mdx`). This approach provides the benefits of GraphQL without breaking our standardized interface.

## The Decision

### **What We're Doing**
- **Public Interface**: Fully compliant with our API connector specification
- **Underlying Implementation**: Shopify GraphQL Admin API instead of REST
- **Transparency**: Users interact with our standardized methods regardless of transport

### **Why This Approach**
1. **Future-Proof**: Aligns with Shopify's strategic direction (REST marked legacy in 2024)
2. **Better Performance**: More efficient data fetching and pagination
3. **Spec Compliance**: Maintains all required behaviors and response structures
4. **Clean Abstraction**: Users don't need to understand GraphQL vs REST differences

## Technical Implementation

### **Interface Preservation**
Our connector maintains the exact same public API:

```python
# Users call these methods exactly as specified:
connector.initialize(config)
connector.connect()
connector.get('/products')
connector.paginate('/orders')
connector.disconnect()
```

### **GraphQL Translation Layer**
Internally, we translate our REST-style interface to GraphQL:

```python
def get(self, path: str, options: Optional[RequestOptions] = None):
    """Public method - matches our API spec exactly"""
    if self.config.use_graphql:
        return self._graphql_get(path, options)
    else:
        return self._rest_get(path, options)  # Fallback

def _graphql_get(self, path: str, options: Optional[RequestOptions] = None):
    """Internal GraphQL implementation"""
    # Convert REST path to GraphQL query
    query = self._build_graphql_query(path, options)
    
    # Execute GraphQL request
    response = self._execute_graphql(query, options)
    
    # Wrap in our standard response format
    return self._wrap_graphql_response(response, options)
```

### **Response Structure Compliance**
GraphQL responses are wrapped to match our spec exactly:

```python
def _wrap_graphql_response(self, graphql_response, options):
    """Convert GraphQL response to our standard format"""
    return {
        "data": self._extract_data(graphql_response),
        "status": 200,
        "headers": graphql_response.headers,
        "meta": {
            "timestamp": datetime.utcnow().isoformat(),
            "duration": graphql_response.duration,
            "retryCount": 0,
            "rateLimit": self._parse_rate_limit(graphql_response.headers),
            "requestId": graphql_response.headers.get("x-request-id")
        }
    }
```

## Benefits of This Approach

### **1. Performance Improvements**
- **Single Request, Multiple Resources**: Fetch products + variants + inventory in one call
- **No Over/Under-fetching**: Get exactly the data needed
- **Efficient Pagination**: GraphQL cursors are more reliable than REST page_info

### **2. Better Rate Limiting**
- **Cost-Based Model**: More predictable than REST's leaky bucket
- **Query Optimization**: Can optimize queries to stay within limits
- **Better Visibility**: Clear understanding of API usage costs

### **3. Future-Proofing**
- **Shopify's Direction**: GraphQL is the strategic future
- **New Features**: Access to latest API capabilities
- **Long-term Support**: Better maintained than legacy REST endpoints

### **4. Developer Experience**
- **Familiar Interface**: Users work with our standard methods
- **No Breaking Changes**: Existing code continues to work
- **Gradual Migration**: Can switch between GraphQL/REST via config

## Spec Compliance Verification

### **✅ All Required Methods Present**
- `initialize()`, `connect()`, `disconnect()`, `isConnected()`
- `request()`, `get()`, `paginate()`
- Hooks system, retry mechanism, rate limiting

### **✅ Response Structure Maintained**
- GraphQL responses wrapped in our standard format
- `meta` object populated with all required fields
- Error handling follows our standardized codes

### **✅ Behavior Preserved**
- Pagination works identically (iterator-based)
- Rate limiting respects our token bucket model
- Retry logic applies to GraphQL errors
- Hooks execute at the same points in the request lifecycle

## Implementation Strategy

### **Phase 1: GraphQL with REST Fallback**
```python
class ShopifyConnector:
    def get(self, path: str, options: Optional[RequestOptions] = None):
        try:
            return self._graphql_get(path, options)
        except GraphQLUnsupportedError:
            if self.config.fallback_to_rest:
                return self._rest_get(path, options)
            raise
```

### **Phase 2: GraphQL-First**
```python
class ShopifyConnector:
    def get(self, path: str, options: Optional[RequestOptions] = None):
        # Primary: GraphQL
        # Fallback: REST only for unsupported operations
        return self._graphql_get(path, options)
```

## Potential Challenges & Solutions

### **Challenge: GraphQL Error Mapping**
**Solution**: Map GraphQL errors to our standardized error codes
```python
def _map_graphql_error(self, graphql_error):
    if graphql_error.extensions.get('code') == 'THROTTLED':
        return ConnectorError('RATE_LIMIT', 'Rate limit exceeded', 429)
    # ... other mappings
```

### **Challenge: Pagination Strategy**
**Solution**: GraphQL cursor-based pagination maps perfectly to our spec
```python
def paginate(self, options: PaginationOptions):
    """Returns iterator as required by our spec"""
    return self._graphql_paginate(options)

def _graphql_paginate(self, options):
    """Internal GraphQL pagination implementation"""
    cursor = None
    has_next_page = True
    
    while has_next_page:
        query = self._build_paginated_query(options, cursor)
        response = self._execute_graphql(query, options)
        
        items = self._extract_items(response)
        page_info = response.data['data'][resource_name]['pageInfo']
        
        yield items
        
        has_next_page = page_info['hasNextPage']
        cursor = page_info['endCursor']
```

### **Challenge: Rate Limit Headers**
**Solution**: Parse GraphQL cost headers and map to our format
```python
def _parse_rate_limit(self, headers):
    """Convert GraphQL headers to our rate limit format"""
    return {
        'limit': headers.get('x-shopify-shop-api-call-limit', '0/40').split('/')[1],
        'remaining': headers.get('x-shopify-shop-api-call-limit', '0/40').split('/')[0],
        'reset': self._calculate_reset_time(headers),
        'retryAfter': headers.get('retry-after')
    }
```

## Configuration Options

### **GraphQL vs REST Selection**
```python
config = {
    "use_graphql": True,              # Primary: GraphQL
    "fallback_to_rest": True,         # Fallback: REST for unsupported ops
    "graphql_version": "2024-07",     # GraphQL API version
    "rest_version": "2024-07",        # REST fallback version
}
```

### **Query Optimization**
```python
config = {
    "graphql": {
        "max_complexity": 1000,       # GraphQL query complexity limit
        "batch_queries": True,        # Combine multiple requests
        "query_timeout": 30000,       # GraphQL-specific timeout
    }
}
```

## Migration Path

### **For Existing Users**
- **No Changes Required**: Existing code continues to work
- **Performance Benefits**: Automatic improvements via GraphQL
- **Configurable**: Can opt-out of GraphQL if needed

### **For New Implementations**
- **GraphQL by Default**: Better performance and future-proofing
- **REST Fallback**: Available for edge cases
- **Best Practices**: Built-in query optimization and rate limiting

## Conclusion

Using GraphQL under the hood while maintaining full API spec compliance is not only achievable but **highly recommended**. This approach provides:

1. **Zero Breaking Changes**: Full backward compatibility
2. **Performance Improvements**: More efficient data fetching
3. **Future-Proofing**: Aligns with Shopify's strategic direction
4. **Clean Architecture**: Separation of concerns between interface and implementation

The key insight is that **our API specification defines behavior, not transport**. GraphQL is just another way to achieve the same results, and by implementing a proper translation layer, we get the best of both worlds: a standardized interface and modern, efficient transport.

## References

- [API Connector Specification](../api-connector.mdx)
- [Shopify GraphQL Admin API](https://shopify.dev/api/admin-graphql)
- [Shopify REST Admin API](https://shopify.dev/api/admin-rest)
- [Getting Started Guide](getting-started.md)
