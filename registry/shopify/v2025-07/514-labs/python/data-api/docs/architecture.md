# Architecture

This document describes the technical architecture of the Shopify Python connector, including implementation details and how it maps to our [API Connector Specification](../../../../../../../apps/components-docs/content/docs/specifications/api-connector.mdx).

## Overview

The connector implements a **translation layer** that converts our standardized API interface to Shopify's GraphQL Admin API (no REST fallback in this release), while maintaining 100% compliance with our specification.

## Shopify API Characteristics

### **Base Configuration**
- **Base URL**: `https://{shop}.myshopify.com/admin/api/{version}/`
- **Versioning**: Required in path (e.g., `2025-07`). Respect deprecation headers.
- **Rate limiting**: Leaky bucket 40 tokens; refill ≈2 tokens/sec. Header: `X-Shopify-Shop-Api-Call-Limit: used/40`. 429 on limit, optional `Retry-After`.
- **Pagination**: Cursor via `Link` header with `rel="next"` and `page_info`; `limit` controls items/page.
- **Filtering/incremental**: Many endpoints accept `updated_at_min`, `created_at_min`.
- **Errors**: 401/403 (auth), 404 (not found), 422 (validation), 429 (rate limit), 5xx. JSON body often includes `errors`. Request ID via `X-Request-Id`.

## Architecture Mapped to Specification

### **Lifecycle Methods**

#### `initialize(configuration)`
- Validates shop domain, API version, auth, timeouts, retry/rate settings
- Sets up internal state and configuration
- Prepares GraphQL query builders

#### `connect()`
- Validates token or OAuth result
- Creates HTTP session/pool
- Warms up rate limiter and circuit breaker
- Establishes connection to Shopify API

#### `disconnect()`
- Drains in-flight work
- Closes HTTP session/pool
- Clears timers and cleans up resources

#### `isConnected()`
- Returns token validity and transport readiness
- Checks both authentication and network connectivity

### **Request Engine**

#### `request(options)`
- Single entry point for all operations
- Merges defaults, applies auth
- Enforces timeout and cancellation
- Executes through rate limiter and retry policy
- Uses GraphQL transport; unsupported paths raise an error

#### `get(path, options)`
- Delegates to `request()` method
- Converts REST-style paths to GraphQL queries when supported
- If translation is unavailable, an `UnsupportedError` is raised

#### Response Wrapper
All responses follow our standardized format:
```python
{
    "data": response_data,
    "status": http_status_code,
    "headers": response_headers,
    "meta": {
        "timestamp": iso_timestamp,
        "duration": request_duration_ms,
        "retryCount": number_of_retries,
        "rateLimit": rate_limit_status,
        "requestId": correlation_id
    }
}
```

### **Authentication**

#### **Custom App Tokens**
- `X-Shopify-Access-Token: <token>` header
- Primary authentication method for single-store setups
- No refresh mechanism needed (tokens are long-lived)

#### **Public App OAuth**
- Code exchange flow for multi-store distribution
- Tokens typically long-lived
- Optional refresh hook for future implementations

#### **Auth Interface**
- `authenticate(request)`: Applies auth to outgoing requests
- `isValid()`: Checks if current credentials are valid
- `refresh()`: Optional hook for token refresh

### **Retry Mechanism**

#### **Retry Strategy**
- Exponential backoff with jitter
- Respects `Retry-After` headers when present
- Retry budget cutoff to prevent infinite retry loops

#### **Retryable vs Non-Retryable**
- **Retryable**: Network errors, 408/425/429/5xx status codes
- **Non-Retryable**: 4xx status codes (except 408/425/429)
- Circuit breaker with half-open probes

### **Rate Limiting**

#### **Token Bucket Implementation**
- Tuned for Shopify REST semantics: steady ≈2 requests/second, burst up to 40
- Adaptive behavior: parses `X-Shopify-Shop-Api-Call-Limit` headers
- GraphQL cost extensions are mapped into synthetic headers for visibility
- Respects `Retry-After` on 429 responses

#### **Rate Limit Status**
- Exposes `rate_limiter.get_stats()`
- Includes status in response `meta` object
- Provides visibility into current usage and limits

### **Pagination**

#### **Strategy**
- Link-header/cursor-based pagination
- Follows Shopify's `Link` headers with `rel="next"`
- Extracts `page_info` cursors for continuation

#### **Implementation**
```python
def paginate(options: PaginationOptions):
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

### **Data Transformation and Validation**

#### **Deserialization**
- Uses Pydantic models or JSON Schema for validation
- Strict timestamp normalization (UTC ISO-8601 strings)
- Resource-specific data extraction from GraphQL responses

#### **No Serialization**
- Read-only implementation in Phase 1
- No write operations supported

### **Error Handling**

#### **Standardized Error Codes**
Maps Shopify responses to our standardized errors:
- `NETWORK_ERROR`: Network connectivity issues
- `TIMEOUT`: Request exceeded timeout limit
- `AUTH_FAILED`: Authentication or authorization failure
- `RATE_LIMIT`: Rate limit exceeded
- `INVALID_REQUEST`: Malformed or invalid request
- `SERVER_ERROR`: Server-side error (5xx status codes)
- `PARSING_ERROR`: Failed to parse response
- `VALIDATION_ERROR`: Data validation failed
- `UNSUPPORTED`: Operation not supported

#### **Error Enrichment**
- Preserves `X-Request-Id` from Shopify
- Enriches with method, path, attempt, duration
- Sets `retryable` flag appropriately

### **Concurrency, Cancellation, and Timeouts**

#### **Concurrency Control**
- Maximum concurrency with bounded queue
- Independent of rate limiter
- Prevents unbounded memory growth

#### **Cancellation and Timeouts**
- Per-call timeouts enforced at transport layer
- Cancellation tokens to abort in-flight work
- Graceful shutdown with request draining

### **Observability**

#### **Structured Logging**
- Includes `requestId`, retry counts, rate-limit state
- Redacts sensitive information
- Consistent field structure

#### **Metrics**
- Request counts, errors, retries
- Latency histograms
- Gauges for in-flight requests and token bucket level

#### **Tracing**
- Span per request
- Attributes for shop, resource, version, status
- Correlation with Shopify's request IDs

### **Versioning and Compatibility**

#### **API Version Management**
- Configurable `apiVersion` in configuration
- Warns on `X-Shopify-Api-Deprecated-Reason` headers
- CI smoke tests against current and next stable versions

## GraphQL Implementation

### **Primary: GraphQL**
- More efficient data fetching
- Better rate limiting with cost-based model
- Future-proof aligned with Shopify's direction

### **Translation Layer**
- Converts REST-style paths to GraphQL queries when supported
- Maintains identical public interface
- Unsupported paths raise an `UnsupportedError` (no REST fallback in this release)

## Feature Set (Phase 1)

### **Supported Resources**
- Products (via variants->inventoryItem), Orders, Customers, Collections, Shop (as exposed by current GraphQL translations)

### **Incremental Extraction**
- Uses `updated_at_min`/`created_at_min` filters
- Maintains per-resource bookmarks
- Last sync timestamp and `page_info` continuation

### **Pagination**
- GraphQL cursor pagination (`edges`/`pageInfo`)
- Configurable `limit` (bounded internally to ≤250)
- Iterator-based interface for memory efficiency

### **Resilience**
- Exponential backoff with jitter
- Adaptive rate limiting from headers
- Circuit breaker with budget cutoff

### **Hooks System**
- `beforeRequest`, `afterResponse`, `onError`, `onRetry`
- Ordered by priority
- Request/response modification capabilities

## Non-Goals (Phase 1)

- No create/update/delete operations
- No uploads/downloads
- No webhook verification/processing
- No idempotency key handling (not needed for GETs)

## Future Considerations

### **Phase 2**
- Incremental extraction with bookmarks
- Additional resources (Inventory, Transactions, Collections, Locations)
- CI smoke tests across API versions

### **Long-term**
- Migration to GraphQL-first approach
- Enhanced query optimization
- Advanced rate limiting strategies
