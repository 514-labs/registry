# Configuration

This document describes all configuration options available for the Shopify connector, including examples and best practices.

## Configuration Structure

The connector accepts a configuration dictionary with the following structure:

```python
config = {
    # Required settings
    "shop": "your-store.myshopify.com",
    "apiVersion": "2024-07",
    "accessToken": "your-admin-api-token",
    
    # Optional settings with sensible defaults
    "timeout": 30000,
    "useGraphQL": True,
    "fallbackToREST": True,
    
    # Advanced settings
    "retry": { ... },
    "rateLimit": { ... },
    "pooling": { ... },
    "defaults": { ... },
    "hooks": { ... }
}
```

## Required Configuration

### **shop**
- **Type**: `string`
- **Description**: Your Shopify store domain (without protocol)
- **Example**: `"my-store.myshopify.com"`
- **Note**: Do not include `https://` or trailing slashes

### **apiVersion**
- **Type**: `string`
- **Description**: Shopify API version to use
- **Example**: `"2024-07"`
- **Note**: Pin to a stable version and monitor deprecation warnings

### **accessToken**
- **Type**: `string`
- **Description**: Admin API access token from your custom app
- **Example**: `"shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"`
- **Security**: Never commit this to version control

## Optional Configuration

### **timeout**
- **Type**: `integer` (milliseconds)
- **Default**: `30000` (30 seconds)
- **Description**: Request timeout for individual API calls
- **Example**: `60000` for 60 seconds

### **useGraphQL**
- **Type**: `boolean`
- **Default**: `True`
- **Description**: Whether to use GraphQL as the primary transport
- **Note**: Set to `False` to use REST exclusively

### **fallbackToREST**
- **Type**: `boolean`
- **Default**: `True`
- **Description**: Whether to fall back to REST when GraphQL fails
- **Note**: Only applies when `useGraphQL` is `True`

## Advanced Configuration

### **Retry Configuration**

```python
config = {
    "retry": {
        "maxAttempts": 5,              # Maximum retry attempts
        "initialDelay": 1000,          # Initial delay in milliseconds
        "maxDelay": 30000,             # Maximum delay in milliseconds
        "backoffMultiplier": 2,        # Exponential backoff multiplier
        "retryBudgetMs": 90000,        # Total retry budget per operation
        "respectRetryAfter": True,     # Honor Shopify's Retry-After headers
        "retryableStatusCodes": [      # HTTP status codes that trigger retries
            429, 500, 502, 503, 504
        ]
    }
}
```

#### **Retry Options Explained**

- **maxAttempts**: Total number of attempts (initial + retries)
- **initialDelay**: Starting delay before first retry
- **maxDelay**: Cap on retry delays to prevent excessive waiting
- **backoffMultiplier**: Each retry waits this many times longer
- **retryBudgetMs**: Hard limit on total time spent retrying
- **respectRetryAfter**: Follow Shopify's rate limit guidance
- **retryableStatusCodes**: Which HTTP status codes should trigger retries

### **Rate Limiting Configuration**

```python
config = {
    "rateLimit": {
        "concurrentRequests": 10,      # Maximum concurrent requests
        "requestsPerSecond": 2,        # Steady-state rate (Shopify's limit)
        "burstCapacity": 40,           # Burst capacity (Shopify's bucket size)
        "adaptiveFromHeaders": True,   # Update limits from response headers
        "enableCircuitBreaker": True,  # Enable circuit breaker pattern
        "circuitBreakerThreshold": 5   # Failures before opening circuit
    }
}
```

#### **Rate Limit Options Explained**

- **concurrentRequests**: Maximum requests in flight simultaneously
- **requestsPerSecond**: Target steady-state rate (respects Shopify's limits)
- **burstCapacity**: Maximum burst above steady rate
- **adaptiveFromHeaders**: Parse Shopify's rate limit headers for real-time updates
- **enableCircuitBreaker**: Prevent cascading failures
- **circuitBreakerThreshold**: Number of consecutive failures before opening circuit

### **Connection Pooling Configuration**

```python
config = {
    "pooling": {
        "keepAlive": True,             # Enable HTTP keep-alive
        "maxConnections": 50,          # Maximum connections in pool
        "maxConnectionsPerHost": 10,   # Max connections per host
        "connectionTimeout": 5000,     # Connection establishment timeout
        "idleTimeout": 30000           # How long connections can be idle
    }
}
```

#### **Pooling Options Explained**

- **keepAlive**: Reuse connections for better performance
- **maxConnections**: Total connections across all hosts
- **maxConnectionsPerHost**: Connections per specific host
- **connectionTimeout**: Time to establish new connections
- **idleTimeout**: How long unused connections are kept

### **Default Settings Configuration**

```python
config = {
    "defaults": {
        "headers": {                   # Headers included with every request
            "User-Agent": "Connector/Shopify Python 1.0.0"
        },
        "query": {                     # Query parameters for every request
            "limit": 250               # Default page size
        },
        "timeout": 30000              # Default timeout for requests
    }
}
```

#### **Default Options Explained**

- **headers**: Custom headers added to all requests
- **query**: Query parameters included in all requests
- **timeout**: Default timeout when not specified per-request

### **Hooks Configuration**

```python
config = {
    "hooks": {
        "beforeRequest": [             # Execute before sending request
            {
                "name": "addCorrelationId",
                "priority": 100,
                "function": add_correlation_id_hook
            }
        ],
        "afterResponse": [             # Execute after receiving response
            {
                "name": "logResponse",
                "priority": 200,
                "function": log_response_hook
            }
        ],
        "onError": [                   # Execute when errors occur
            {
                "name": "enrichError",
                "priority": 100,
                "function": enrich_error_hook
            }
        ],
        "onRetry": [                   # Execute before retrying
            {
                "name": "logRetry",
                "priority": 100,
                "function": log_retry_hook
            }
        ]
    }
}
```

#### **Hook Options Explained**

- **name**: Unique identifier for the hook
- **priority**: Execution order (lower numbers execute first)
- **function**: Callable that implements the hook logic

## Environment Variables

You can also configure the connector using environment variables:

```bash
export SHOPIFY_SHOP="your-store.myshopify.com"
export SHOPIFY_API_VERSION="2024-07"
export SHOPIFY_ACCESS_TOKEN="your-admin-api-token"
export SHOPIFY_TIMEOUT="30000"
export SHOPIFY_USE_GRAPHQL="true"
export SHOPIFY_FALLBACK_TO_REST="true"
```

## Configuration Examples

### **Minimal Configuration**

```python
from shopify_connector import ShopifyConnector

config = {
    "shop": "my-store.myshopify.com",
    "apiVersion": "2024-07",
    "accessToken": "shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}

connector = ShopifyConnector(config)
```

### **Production Configuration**

```python
config = {
    "shop": "my-store.myshopify.com",
    "apiVersion": "2024-07",
    "accessToken": "shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    
    "timeout": 60000,
    "useGraphQL": True,
    "fallbackToREST": True,
    
    "retry": {
        "maxAttempts": 3,
        "initialDelay": 2000,
        "maxDelay": 30000,
        "retryBudgetMs": 60000
    },
    
    "rateLimit": {
        "concurrentRequests": 5,
        "requestsPerSecond": 2,
        "burstCapacity": 40,
        "adaptiveFromHeaders": True
    },
    
    "pooling": {
        "keepAlive": True,
        "maxConnections": 20,
        "maxConnectionsPerHost": 5
    },
    
    "defaults": {
        "headers": {
            "User-Agent": "MyApp/1.0.0"
        },
        "query": {
            "limit": 250
        }
    }
}
```

### **Development Configuration**

```python
config = {
    "shop": "dev-store.myshopify.com",
    "apiVersion": "2024-07",
    "accessToken": "shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    
    "timeout": 30000,
    "useGraphQL": True,
    "fallbackToREST": True,
    
    "retry": {
        "maxAttempts": 5,
        "initialDelay": 1000,
        "maxDelay": 10000
    },
    
    "rateLimit": {
        "concurrentRequests": 2,
        "requestsPerSecond": 1,
        "burstCapacity": 20
    }
}
```

## Configuration Validation

The connector validates your configuration and will raise helpful errors for:

- Missing required fields
- Invalid field types
- Out-of-range values
- Conflicting settings

## Best Practices

### **Security**
- Store access tokens securely (environment variables, secret management)
- Never commit tokens to version control
- Use least-privilege API scopes

### **Performance**
- Start with conservative rate limits and adjust based on performance
- Enable connection pooling for production use
- Use appropriate timeouts for your use case

### **Reliability**
- Enable retries with reasonable limits
- Use circuit breaker for production environments
- Monitor rate limit headers and adjust accordingly

### **Monitoring**
- Set up logging for hooks and errors
- Monitor retry rates and circuit breaker status
- Track rate limit usage and adjust configuration

## Troubleshooting Configuration

### **Common Issues**

1. **Invalid shop domain**: Ensure no protocol or trailing slashes
2. **API version not found**: Check available versions in Shopify docs
3. **Access token invalid**: Verify token hasn't expired or been revoked
4. **Rate limit exceeded**: Reduce `requestsPerSecond` or `concurrentRequests`

### **Debug Mode**

Enable debug logging to troubleshoot configuration issues:

```python
import logging
logging.basicConfig(level=logging.DEBUG)

# Or set specific logger level
logging.getLogger('shopify_connector').setLevel(logging.DEBUG)
```
