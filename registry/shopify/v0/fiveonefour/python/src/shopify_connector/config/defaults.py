"""
Default configuration values for the Shopify connector.

These defaults provide sensible values that align with Shopify's API
characteristics and our API connector specification requirements.
"""

from typing import Dict, Any

# Base configuration defaults
DEFAULT_CONFIG = {
    "timeout": 30000,  # 30 seconds
    "useGraphQL": True,
    "fallbackToREST": True,
    "apiVersion": "2024-07",
}

# Retry configuration defaults
DEFAULT_RETRY_CONFIG = {
    "maxAttempts": 5,
    "initialDelay": 1000,  # 1 second
    "maxDelay": 30000,     # 30 seconds
    "backoffMultiplier": 2,
    "retryBudgetMs": 90000,  # 90 seconds total
    "respectRetryAfter": True,
    "retryableStatusCodes": [429, 500, 502, 503, 504],
}

# Rate limiting defaults (tuned for Shopify)
DEFAULT_RATE_LIMIT_CONFIG = {
    "concurrentRequests": 10,
    "requestsPerSecond": 2,      # Shopify's steady rate
    "burstCapacity": 40,         # Shopify's token bucket size
    "adaptiveFromHeaders": True,  # Parse rate limit headers
    "enableCircuitBreaker": True,
    "circuitBreakerThreshold": 5,
}

# Connection pooling defaults
DEFAULT_POOLING_CONFIG = {
    "keepAlive": True,
    "maxConnections": 50,
    "maxConnectionsPerHost": 10,
    "connectionTimeout": 5000,   # 5 seconds
    "idleTimeout": 30000,        # 30 seconds
}

# Default headers and query parameters
DEFAULT_HEADERS = {
    "User-Agent": "Connector/Shopify Python 1.0.0",
    "Accept": "application/json",
    "Content-Type": "application/json",
}

DEFAULT_QUERY_PARAMS = {
    "limit": 250,  # Shopify's maximum page size
}

# Hook configuration defaults
DEFAULT_HOOKS_CONFIG = {
    "beforeRequest": [],
    "afterResponse": [],
    "onError": [],
    "onRetry": [],
}

# GraphQL configuration defaults
DEFAULT_GRAPHQL_CONFIG = {
    "maxComplexity": 1000,
    "batchQueries": True,
    "queryTimeout": 30000,
}

# Logging configuration defaults
DEFAULT_LOGGING_CONFIG = {
    "level": "INFO",
    "format": "json",
    "includeRequestId": True,
    "redactSensitiveFields": True,
}

# Metrics configuration defaults
DEFAULT_METRICS_CONFIG = {
    "enabled": True,
    "prefix": "shopify_connector",
    "includeLabels": True,
}

# Tracing configuration defaults
DEFAULT_TRACING_CONFIG = {
    "enabled": False,
    "samplingRate": 0.1,
    "includeRequestDetails": True,
}

def get_default_config() -> Dict[str, Any]:
    """Get complete default configuration."""
    return {
        **DEFAULT_CONFIG,
        "retry": DEFAULT_RETRY_CONFIG.copy(),
        "rateLimit": DEFAULT_RATE_LIMIT_CONFIG.copy(),
        "pooling": DEFAULT_POOLING_CONFIG.copy(),
        "defaults": {
            "headers": DEFAULT_HEADERS.copy(),
            "query": DEFAULT_QUERY_PARAMS.copy(),
        },
        "hooks": DEFAULT_HOOKS_CONFIG.copy(),
        "graphql": DEFAULT_GRAPHQL_CONFIG.copy(),
        "logging": DEFAULT_LOGGING_CONFIG.copy(),
        "metrics": DEFAULT_METRICS_CONFIG.copy(),
        "tracing": DEFAULT_TRACING_CONFIG.copy(),
    }

def merge_with_defaults(user_config: Dict[str, Any]) -> Dict[str, Any]:
    """Merge user configuration with defaults, with user values taking precedence."""
    default_config = get_default_config()
    
    def deep_merge(base: Dict[str, Any], override: Dict[str, Any]) -> Dict[str, Any]:
        """Recursively merge configuration dictionaries."""
        result = base.copy()
        
        for key, value in override.items():
            if key in result and isinstance(result[key], dict) and isinstance(value, dict):
                result[key] = deep_merge(result[key], value)
            else:
                result[key] = value
        
        return result
    
    return deep_merge(default_config, user_config)
