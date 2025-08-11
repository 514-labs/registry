# Implementation Plan - Python Shopify Connector

This document outlines the implementation plan for the Shopify connector, strictly adhering to our [API Connector Specification](../../../../../../apps/components-docs/content/docs/specifications/api-connector.mdx).

## 🎯 Implementation Goals

- **100% API Spec Compliance**: Implement all required methods and behaviors from `api-connector.mdx`
- **GraphQL Under the Hood**: Use Shopify's GraphQL Admin API with REST fallback
- **Production Ready**: Built-in resilience, rate limiting, and observability
- **Clean Architecture**: Separation of concerns with proper abstraction layers

## 📁 Project Structure

```
src/
├── __init__.py
├── connector.py              # Main connector class implementing API spec
├── auth/
│   ├── __init__.py
│   ├── base.py              # Base authentication interface
│   ├── bearer.py            # Bearer token authentication
│   └── oauth.py             # OAuth 2.0 authentication (future)
├── transport/
│   ├── __init__.py
│   ├── base.py              # Base transport interface
│   ├── graphql.py           # GraphQL transport implementation
│   ├── rest.py              # REST fallback transport
│   └── http_client.py       # HTTP client with connection pooling
├── resilience/
│   ├── __init__.py
│   ├── retry.py             # Retry mechanism with backoff + jitter
│   ├── rate_limiter.py      # Token bucket rate limiter
│   └── circuit_breaker.py   # Circuit breaker pattern
├── pagination/
│   ├── __init__.py
│   ├── base.py              # Base pagination interface
│   ├── link_header.py       # Link header pagination
│   └── cursor.py            # Cursor-based pagination
├── hooks/
│   ├── __init__.py
│   ├── base.py              # Base hook interface
│   ├── manager.py            # Hook execution manager
│   └── builtin.py           # Built-in hooks (logging, metrics)
├── data/
│   ├── __init__.py
│   ├── models.py            # Pydantic models for Shopify resources
│   ├── transformers.py      # Data transformation utilities
│   └── validators.py        # Data validation
├── errors/
│   ├── __init__.py
│   ├── base.py              # Base connector error
│   ├── shopify.py           # Shopify-specific error mapping
│   └── codes.py             # Standardized error codes
├── config/
│   ├── __init__.py
│   ├── schema.py            # Configuration validation schema
│   └── defaults.py          # Default configuration values
└── utils/
    ├── __init__.py
    ├── logging.py            # Structured logging setup
    ├── metrics.py            # Metrics collection
    └── tracing.py            # Distributed tracing
```

## 🔧 Core Implementation Phases

### **Phase 1: Foundation & Core Interface (Week 1-2)**

#### **1.1 Project Setup & Dependencies**
```bash
# Core dependencies
pip install pydantic requests httpx structlog prometheus-client

# Development dependencies  
pip install pytest pytest-mock pytest-asyncio black isort mypy
```

#### **1.2 Configuration System**
- Implement configuration validation using Pydantic
- Support environment variables and configuration files
- Validate required fields and provide sensible defaults

#### **1.3 Error Handling Foundation**
- Implement standardized error codes from API spec
- Create error hierarchy with proper inheritance
- Map Shopify errors to standardized codes

#### **1.4 Base Interfaces**
- Define abstract base classes for all major components
- Ensure proper interface contracts for testing and extensibility

### **Phase 2: Authentication & Transport (Week 3-4)**

#### **2.1 Authentication System**
```python
# src/auth/base.py
class BaseAuth(ABC):
    @abstractmethod
    def authenticate(self, request: dict) -> None:
        """Apply authentication to request"""
        pass
    
    @abstractmethod
    def isValid(self) -> bool:
        """Check if credentials are valid"""
        pass

# src/auth/bearer.py
class BearerAuth(BaseAuth):
    def __init__(self, access_token: str):
        self.access_token = access_token
    
    def authenticate(self, request: dict) -> None:
        request['headers']['X-Shopify-Access-Token'] = self.access_token
```

#### **2.2 HTTP Client**
- Connection pooling with keep-alive
- Timeout and cancellation support
- Request/response logging and metrics

#### **2.3 Transport Layer**
- GraphQL as primary transport
- REST fallback for unsupported operations
- Automatic routing based on endpoint support

### **Phase 3: Resilience & Rate Limiting (Week 5-6)**

#### **3.1 Retry Mechanism**
```python
# src/resilience/retry.py
class RetryPolicy:
    def __init__(self, config: RetryConfig):
        self.max_attempts = config.max_attempts
        self.initial_delay = config.initial_delay
        self.max_delay = config.max_delay
        self.backoff_multiplier = config.backoff_multiplier
        self.retry_budget_ms = config.retry_budget_ms
    
    def should_retry(self, error: Exception, attempt: int) -> bool:
        """Determine if request should be retried per API spec"""
        if attempt >= self.max_attempts:
            return False
        
        if isinstance(error, (NetworkError, TimeoutError)):
            return True
        
        if hasattr(error, 'status_code'):
            return error.status_code in [408, 425, 429, 500, 502, 503, 504]
        
        return False
    
    def calculate_delay(self, attempt: int) -> int:
        """Calculate delay with exponential backoff + jitter per API spec"""
        delay = min(
            self.initial_delay * (self.backoff_multiplier ** (attempt - 1)),
            self.max_delay
        )
        
        # Add jitter: 0.5 to 1.0 multiplier
        jitter = 0.5 + (random.random() * 0.5)
        return int(delay * jitter)
```

#### **3.2 Rate Limiting**
- Token bucket implementation tuned for Shopify (40 tokens, 2/sec refill)
- Adaptive rate limiting from response headers
- Respect Retry-After headers

#### **3.3 Circuit Breaker**
- Half-open state for recovery
- Configurable failure thresholds
- Automatic recovery mechanisms

### **Phase 4: Pagination & Data Handling (Week 7-8)**

#### **4.1 Pagination System**
```python
# src/pagination/link_header.py
class LinkHeaderPagination(BasePagination):
    def __init__(self, connector: 'ShopifyConnector'):
        self.connector = connector
    
    def paginate(self, path: str, options: PaginationOptions):
        """Return iterator as required by API spec"""
        cursor = None
        has_next_page = True
        
        while has_next_page:
            # Build request with current cursor
            request_options = self._build_request_options(options, cursor)
            response = self.connector.request(request_options)
            
            # Extract items using pluggable extractor
            items = self._extract_items(response, options)
            yield items
            
            # Check for next page
            page_info = self._extract_page_info(response)
            has_next_page = page_info.get('hasNextPage', False)
            cursor = page_info.get('endCursor')
            
            if not has_next_page:
                break
```

#### **4.2 Data Transformation**
- Pydantic models for Shopify resources
- Timestamp normalization (UTC ISO-8601)
- Resource-specific data extraction

### **Phase 5: Hooks & Observability (Week 9-10)**

#### **5.1 Hook System**
```python
# src/hooks/manager.py
class HookManager:
    def __init__(self):
        self.hooks = {
            'beforeRequest': [],
            'afterResponse': [],
            'onError': [],
            'onRetry': []
        }
    
    def add_hook(self, hook_type: str, hook: BaseHook):
        """Add hook with priority ordering per API spec"""
        self.hooks[hook_type].append(hook)
        self.hooks[hook_type].sort(key=lambda h: h.priority)
    
    def execute_hooks(self, hook_type: str, context: HookContext):
        """Execute hooks in priority order"""
        for hook in self.hooks[hook_type]:
            try:
                hook.execute(context)
            except Exception as e:
                # Log hook execution errors but don't fail the request
                logger.error(f"Hook {hook.name} failed: {e}")
```

#### **5.2 Observability**
- Structured logging with correlation IDs
- Metrics collection (requests, errors, latency)
- Distributed tracing support

### **Phase 6: Main Connector Implementation (Week 11-12)**

#### **6.1 Core Methods Implementation**
```python
# src/connector.py
class ShopifyConnector:
    def __init__(self, configuration: dict):
        """Initialize connector per API spec"""
        self.config = self._validate_config(configuration)
        self.auth = self._setup_auth()
        self.transport = self._setup_transport()
        self.retry_policy = self._setup_retry()
        self.rate_limiter = self._setup_rate_limiter()
        self.hook_manager = self._setup_hooks()
        self._connected = False
    
    def connect(self) -> None:
        """Establish connection per API spec"""
        try:
            # Validate credentials
            if not self.auth.isValid():
                raise AuthFailedError("Invalid credentials")
            
            # Test connection with simple request
            test_response = self.request({
                'method': 'GET',
                'path': '/shop'
            })
            
            self._connected = True
            logger.info("Successfully connected to Shopify")
            
        except Exception as e:
            self._connected = False
            raise ConnectionError(f"Failed to connect: {e}")
    
    def disconnect(self) -> None:
        """Gracefully close connection per API spec"""
        if self._connected:
            # Drain in-flight requests
            self._drain_inflight_requests()
            
            # Close transport
            self.transport.close()
            
            self._connected = False
            logger.info("Disconnected from Shopify")
    
    def isConnected(self) -> bool:
        """Check connection status per API spec"""
        return self._connected and self.auth.isValid()
    
    def request(self, options: RequestOptions) -> Response:
        """Core request method per API spec"""
        # Validate connection
        if not self.isConnected():
            raise ConnectionError("Not connected")
        
        # Apply hooks
        context = HookContext('beforeRequest', options)
        self.hook_manager.execute_hooks('beforeRequest', context)
        
        # Wait for rate limit slot
        self.rate_limiter.wait_for_slot()
        
        # Execute with retry logic
        response = self._execute_with_retry(options)
        
        # Apply response hooks
        context = HookContext('afterResponse', options, response)
        self.hook_manager.execute_hooks('afterResponse', context)
        
        return self._wrap_response(response)
    
    def get(self, path: str, options: Optional[RequestOptions] = None) -> Response:
        """GET method per API spec"""
        return self.request({
            'method': 'GET',
            'path': path,
            **(options or {})
        })
    
    def paginate(self, path: str, options: Optional[PaginationOptions] = None) -> Iterator[List]:
        """Pagination method per API spec"""
        paginator = LinkHeaderPagination(self)
        return paginator.paginate(path, options or {})
```

#### **6.2 Response Wrapping**
```python
def _wrap_response(self, raw_response: dict) -> Response:
    """Wrap response per API spec structure"""
    return {
        'data': self._extract_data(raw_response),
        'status': raw_response.get('status_code', 200),
        'headers': raw_response.get('headers', {}),
        'meta': {
            'timestamp': datetime.utcnow().isoformat(),
            'duration': raw_response.get('duration', 0),
            'retryCount': raw_response.get('retry_count', 0),
            'rateLimit': self._extract_rate_limit(raw_response.get('headers', {})),
            'requestId': raw_response.get('headers', {}).get('X-Request-Id')
        }
    }
```

## 🧪 Testing Strategy

### **Unit Tests (Week 13-14)**
- Test each component in isolation
- Mock external dependencies
- Cover all error paths and edge cases

### **Integration Tests (Week 15-16)**
- Test component interactions
- Mock Shopify API responses
- Validate API spec compliance

### **Conformance Tests (Week 17)**
- Automated tests for API spec requirements
- Response structure validation
- Error handling verification

## 📋 Implementation Checklist

### **API Spec Compliance**
- [ ] `initialize(configuration)` method
- [ ] `connect()` method  
- [ ] `disconnect()` method
- [ ] `isConnected()` method
- [ ] `request(options)` method
- [ ] `get(path, options)` method
- [ ] `paginate(options)` method
- [ ] Response wrapper with required meta fields
- [ ] Standardized error codes and structure
- [ ] Hook system with proper ordering
- [ ] Retry mechanism with backoff + jitter
- [ ] Rate limiting with adaptive behavior
- [ ] Circuit breaker pattern
- [ ] Structured logging and metrics
- [ ] Request cancellation and timeouts

### **Shopify-Specific Features**
- [ ] GraphQL transport with REST fallback
- [ ] Link header pagination
- [ ] Rate limit header parsing
- [ ] Shopify error mapping
- [ ] Test data and checkout flow support
- [ ] Development store setup guidance

### **Production Readiness**
- [ ] Configuration validation
- [ ] Environment variable support
- [ ] Connection pooling
- [ ] Graceful shutdown
- [ ] Comprehensive error handling
- [ ] Performance monitoring
- [ ] Documentation and examples

## 🚀 Getting Started

### **1. Create Project Structure**
```bash
mkdir -p src/{auth,transport,resilience,pagination,hooks,data,errors,config,utils}
touch src/__init__.py
touch src/{auth,transport,resilience,pagination,hooks,data,errors,config,utils}/__init__.py
```

### **2. Start with Core Interfaces**
- Define abstract base classes
- Implement configuration system
- Set up error handling

### **3. Build Incrementally**
- Implement one component at a time
- Write tests for each component
- Ensure API spec compliance at each step

### **4. Integration Testing**
- Test component interactions
- Validate against API spec
- Performance and reliability testing

## 📚 Key Implementation Principles

1. **API Spec First**: Every method must strictly follow the specification
2. **Test-Driven Development**: Write tests before implementation
3. **Clean Architecture**: Clear separation of concerns
4. **Error Handling**: Comprehensive error coverage with proper mapping
5. **Performance**: Efficient data handling and connection management
6. **Observability**: Built-in logging, metrics, and tracing
7. **Extensibility**: Hook system for customization without forking

## 🔍 Success Criteria

- **100% API Spec Compliance**: All required methods and behaviors implemented
- **Comprehensive Test Coverage**: >90% test coverage with all edge cases
- **Performance**: Handles Shopify's rate limits efficiently
- **Reliability**: Graceful handling of all error conditions
- **Documentation**: Clear examples and usage patterns
- **Production Ready**: Can be deployed in production environments

This implementation plan ensures the connector strictly adheres to our API connector specification while providing a robust, production-ready solution for Shopify data extraction.
