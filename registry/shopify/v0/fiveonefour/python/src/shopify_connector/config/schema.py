"""
Configuration validation schema for the Shopify connector.

Uses Pydantic for configuration validation and provides clear error
messages for invalid configurations.
"""

import os
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field, validator, model_validator


class RetryConfig(BaseModel):
    """Retry configuration schema."""
    
    maxAttempts: int = Field(default=3, ge=1, le=10, description="Maximum retry attempts")
    initialDelay: int = Field(default=1000, ge=100, le=10000, description="Initial delay in milliseconds")
    maxDelay: int = Field(default=10000, ge=1000, le=300000, description="Maximum delay in milliseconds")
    backoffMultiplier: float = Field(default=2.0, ge=1.0, le=5.0, description="Exponential backoff multiplier")
    retryBudgetMs: int = Field(default=30000, ge=1000, le=600000, description="Total retry budget per operation")
    respectRetryAfter: bool = Field(default=True, description="Honor Retry-After headers")
    retryableStatusCodes: List[int] = Field(default=[429, 500, 502, 503, 504], description="HTTP status codes that trigger retries")
    jitterFactor: float = Field(default=0.5, ge=0.0, le=1.0, description="Lower bound for jitter factor (0.0-1.0)")
    
    @validator('maxDelay')
    def max_delay_greater_than_initial(cls, v, values):
        if 'initialDelay' in values and v <= values['initialDelay']:
            raise ValueError('maxDelay must be greater than initialDelay')
        return v


class RateLimitConfig(BaseModel):
    """Rate limiting configuration schema."""
    
    concurrentRequests: int = Field(default=5, ge=1, le=100, description="Maximum concurrent requests")
    requestsPerSecond: float = Field(default=2.0, ge=0.1, le=10.0, description="Steady-state requests per second")
    burstCapacity: int = Field(default=40, ge=1, le=1000, description="Burst capacity above steady rate")
    adaptiveFromHeaders: bool = Field(default=True, description="Update limits from response headers")
    enableCircuitBreaker: bool = Field(default=True, description="Enable circuit breaker pattern")
    circuitBreakerThreshold: int = Field(default=5, ge=1, le=100, description="Failures before opening circuit")


class PoolingConfig(BaseModel):
    """Connection pooling configuration schema."""
    
    keepAlive: bool = Field(default=True, description="Enable HTTP keep-alive")
    maxConnections: int = Field(default=100, ge=1, le=1000, description="Maximum connections in pool")
    maxConnectionsPerHost: int = Field(default=10, ge=1, le=100, description="Maximum connections per host")
    connectionTimeout: int = Field(default=5000, ge=1000, le=30000, description="Connection establishment timeout")
    idleTimeout: int = Field(default=30000, ge=5000, le=60000, description="Idle connection timeout")


class CircuitBreakerConfig(BaseModel):
    """Circuit breaker configuration schema."""
    
    failureThreshold: int = Field(default=5, ge=1, le=100, description="Consecutive failures before opening circuit")
    recoveryTimeout: int = Field(default=30, ge=1, le=3600, description="Seconds before attempting half-open state")
    minimumRequests: int = Field(default=2, ge=1, le=100, description="Successful requests needed to close from half-open")


class GraphQLConfig(BaseModel):
    """GraphQL configuration schema."""
    
    maxComplexity: int = Field(default=1000, ge=1, le=10000, description="Maximum query complexity")
    batchQueries: bool = Field(default=True, description="Enable query batching")
    queryTimeout: int = Field(default=30000, ge=1000, le=300000, description="GraphQL query timeout")


class LoggingConfig(BaseModel):
    """Logging configuration schema."""
    
    level: str = Field(default="INFO", description="Logging level")
    format: str = Field(default="json", description="Log format")
    includeRequestId: bool = Field(default=True, description="Include request ID in logs")
    redactSensitiveFields: bool = Field(default=True, description="Redact sensitive information")


class MetricsConfig(BaseModel):
    """Metrics configuration schema."""
    
    enabled: bool = Field(default=True, description="Enable metrics collection")
    prefix: str = Field(default="shopify_connector", description="Metrics prefix")
    includeLabels: bool = Field(default=True, description="Include labels in metrics")


class TracingConfig(BaseModel):
    """Tracing configuration schema."""
    
    enabled: bool = Field(default=False, description="Enable distributed tracing")
    samplingRate: float = Field(default=0.1, ge=0.0, le=1.0, description="Tracing sampling rate")
    includeRequestDetails: bool = Field(default=True, description="Include request details in traces")


class DefaultsConfig(BaseModel):
    """Default request configuration schema."""
    
    headers: Dict[str, str] = Field(default_factory=dict, description="Default headers")
    query: Dict[str, Any] = Field(default_factory=dict, description="Default query parameters")
    timeout: Optional[int] = Field(None, ge=1000, le=300000, description="Default timeout")


class HookConfig(BaseModel):
    """Hook configuration schema."""
    
    name: str = Field(description="Hook name")
    priority: int = Field(ge=0, le=1000, description="Hook priority (lower = earlier)")
    function: str = Field(description="Hook function name or path")


class HooksConfig(BaseModel):
    """Hooks configuration schema."""
    
    beforeRequest: List[HookConfig] = Field(default_factory=list, description="Before request hooks")
    afterResponse: List[HookConfig] = Field(default_factory=list, description="After response hooks")
    onError: List[HookConfig] = Field(default_factory=list, description="Error handling hooks")
    onRetry: List[HookConfig] = Field(default_factory=list, description="Retry hooks")


class ShopifyConnectorConfig(BaseModel):
    """Main configuration schema for the Shopify connector."""
    
    # Required fields
    shop: str = Field(description="Shopify store domain (e.g., 'my-store.myshopify.com')")
    accessToken: str = Field(description="Admin API access token")
    
    # Optional fields with defaults
    apiVersion: str = Field(default="2024-07", description="Shopify API version")
    timeout: int = Field(default=30000, ge=1000, le=300000, description="Request timeout in milliseconds")
    useGraphQL: bool = Field(default=True, description="Use GraphQL as primary transport")
    fallbackToREST: bool = Field(default=True, description="Fallback to REST when GraphQL fails")
    
    # Component configurations
    retry: RetryConfig = Field(default_factory=lambda: RetryConfig(), description="Retry configuration")
    rateLimit: RateLimitConfig = Field(default_factory=lambda: RateLimitConfig(), description="Rate limiting configuration")
    pooling: PoolingConfig = Field(default_factory=lambda: PoolingConfig(), description="Connection pooling configuration")
    circuitBreaker: CircuitBreakerConfig = Field(default_factory=lambda: CircuitBreakerConfig(), description="Circuit breaker configuration")
    graphql: GraphQLConfig = Field(default_factory=lambda: GraphQLConfig(), description="GraphQL configuration")
    logging: LoggingConfig = Field(default_factory=lambda: LoggingConfig(), description="Logging configuration")
    metrics: MetricsConfig = Field(default_factory=lambda: MetricsConfig(), description="Metrics configuration")
    tracing: TracingConfig = Field(default_factory=lambda: TracingConfig(), description="Tracing configuration")
    defaults: DefaultsConfig = Field(default_factory=lambda: DefaultsConfig(), description="Default request configuration")
    hooks: HooksConfig = Field(default_factory=lambda: HooksConfig(), description="Hooks configuration")
    
    # Environment variable support
    class Config:
        env_prefix = "SHOPIFY_"
        env_file = ".env"
        case_sensitive = False
    
    @validator('shop')
    def validate_shop_domain(cls, v):
        """Validate shop domain format."""
        if not v:
            raise ValueError("Shop domain cannot be empty")
        
        # Remove protocol if present
        if v.startswith(('http://', 'https://')):
            v = v.split('://', 1)[1]
        
        # Remove trailing slash
        v = v.rstrip('/')
        
        # Basic validation
        if not v.endswith('.myshopify.com'):
            raise ValueError("Shop domain must end with .myshopify.com")
        
        if len(v.split('.')[0]) < 3:
            raise ValueError("Shop domain must have a valid subdomain")
        
        return v
    
    @validator('accessToken')
    def validate_access_token(cls, v):
        """Validate access token format."""
        if not v:
            raise ValueError("Access token cannot be empty")
        
        if not v.startswith('shpat_'):
            raise ValueError("Access token must start with 'shpat_'")
        
        if len(v) < 20:
            raise ValueError("Access token appears to be too short")
        
        return v
    
    @validator('apiVersion')
    def validate_api_version(cls, v):
        """Validate API version format."""
        if not v:
            raise ValueError("API version cannot be empty")
        
        # Expected format: YYYY-MM
        if not v.count('-') == 1:
            raise ValueError("API version must be in format YYYY-MM")
        
        year, month = v.split('-')
        try:
            year_int = int(year)
            month_int = int(month)
            
            if year_int < 2020 or year_int > 2030:
                raise ValueError("Year must be between 2020 and 2030")
            
            if month_int < 1 or month_int > 12:
                raise ValueError("Month must be between 1 and 12")
                
        except ValueError:
            raise ValueError("API version must contain valid year and month")
        
        return v
    
    @model_validator(mode='after')
    def validate_rate_limit_config(self):
        """Validate rate limit configuration consistency."""
        rate_limit = self.rateLimit
        if rate_limit:
            # Ensure burst capacity is reasonable relative to steady rate
            if rate_limit.burstCapacity < rate_limit.requestsPerSecond * 2:
                raise ValueError("Burst capacity should be at least 2x the steady rate")
            
            # Ensure concurrent requests don't exceed burst capacity
            if rate_limit.concurrentRequests > rate_limit.burstCapacity:
                raise ValueError("Concurrent requests cannot exceed burst capacity")
        
        return self
    
    @model_validator(mode='after')
    def validate_timeout_consistency(self):
        """Validate timeout configuration consistency."""
        timeout = self.timeout
        retry_config = self.retry
        
        if retry_config:
            # Ensure retry budget doesn't exceed reasonable limits
            max_retry_time = retry_config.maxAttempts * timeout
            if retry_config.retryBudgetMs > max_retry_time * 2:
                raise ValueError("Retry budget should not exceed 2x the maximum retry time")
        
        return self
    
    def get_shop_url(self) -> str:
        """Get the full shop URL."""
        return f"https://{self.shop}"
    
    def get_api_url(self) -> str:
        """Get the full API URL."""
        return f"https://{self.shop}/admin/api/{self.apiVersion}"
    
    def get_graphql_url(self) -> str:
        """Get the GraphQL endpoint URL."""
        return f"https://{self.shop}/admin/api/{self.apiVersion}/graphql.json"
    
    def get_rest_url(self, endpoint: str) -> str:
        """Get the REST endpoint URL."""
        # Ensure endpoint starts with / and ends with .json
        if not endpoint.startswith('/'):
            endpoint = '/' + endpoint
        if not endpoint.endswith('.json'):
            endpoint = endpoint + '.json'
        
        return f"https://{self.shop}/admin/api/{self.apiVersion}{endpoint}"
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert configuration to dictionary."""
        return self.dict()
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'ShopifyConnectorConfig':
        """Create configuration from dictionary."""
        return cls(**data)
    
    @classmethod
    def from_env(cls) -> 'ShopifyConnectorConfig':
        """Create configuration from environment variables."""
        config_data = {}
        
        # Map environment variables to config fields
        env_mapping = {
            'SHOP': 'shop',
            'ACCESS_TOKEN': 'accessToken',
            'API_VERSION': 'apiVersion',
            'TIMEOUT': 'timeout',
            'USE_GRAPHQL': 'useGraphQL',
            'FALLBACK_TO_REST': 'fallbackToREST',
        }
        
        for env_var, config_field in env_mapping.items():
            value = os.getenv(f'SHOPIFY_{env_var}')
            if value is not None:
                # Handle boolean values
                if env_var in ['USE_GRAPHQL', 'FALLBACK_TO_REST']:
                    config_data[config_field] = value.lower() in ('true', '1', 'yes')
                # Handle integer values
                elif env_var == 'TIMEOUT':
                    config_data[config_field] = int(value)
                else:
                    config_data[config_field] = value
        
        return cls(**config_data)
