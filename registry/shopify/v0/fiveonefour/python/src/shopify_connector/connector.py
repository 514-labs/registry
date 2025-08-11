"""
Main Shopify connector class implementing the API Connector Specification.

This connector provides a standardized interface for extracting data from
Shopify stores while using GraphQL under the hood with REST fallback.
"""

import time
import logging
from datetime import datetime
from typing import Any, Dict, Iterator, List, Optional, Union

from .config.schema import ShopifyConnectorConfig
from .errors.base import (
    ConnectorError, ConnectionError, AuthFailedError, 
    NetworkError, TimeoutError, RateLimitError
)
from .auth.base import BaseAuth
from .auth.bearer import BearerAuth
from .transport.base import BaseTransport
from .transport.rest import RESTTransport
from .resilience import RetryPolicy, TokenBucketRateLimiter, CircuitBreaker
from .pagination import BasePagination, LinkHeaderPagination
from .hooks import HookManager, HookType, HookContext
from .utils.logging import setup_logging


logger = logging.getLogger(__name__)


class ShopifyConnector:
    """
    Shopify connector implementing the API Connector Specification.
    
    This connector provides a standardized interface for extracting data
    from Shopify stores with built-in resilience, rate limiting, and
    pagination support.
    """
    
    def __init__(self, configuration: Union[Dict[str, Any], ShopifyConnectorConfig]):
        """
        Initialize the Shopify connector.
        
        Args:
            configuration: Configuration dictionary or ShopifyConnectorConfig instance
        
        Raises:
            ValidationError: If configuration is invalid
        """
        # Validate and merge configuration
        if isinstance(configuration, dict):
            self.config = ShopifyConnectorConfig(**configuration)
        else:
            self.config = configuration
        
        # Setup logging
        setup_logging(self.config.logging)
        
        # Initialize components
        self.auth = self._setup_auth()
        self.transport = self._setup_transport()
        self.retry_policy = self._setup_retry()
        self.rate_limiter = self._setup_rate_limiter()
        self.circuit_breaker = self._setup_circuit_breaker()
        self.hook_manager = self._setup_hooks()
        self.paginator = self._setup_paginator()
        
        # Connection state
        self._connected = False
        self._connection_time = None
        
        logger.info("Shopify connector initialized", extra={
            "shop": self.config.shop,
            "api_version": self.config.apiVersion,
            "use_graphql": self.config.useGraphQL
        })
    
    def initialize(self, configuration: Dict[str, Any]) -> None:
        """
        Initialize the connector with configuration.
        
        This method is part of the API Connector Specification and allows
        re-initialization with new configuration.
        
        Args:
            configuration: New configuration dictionary
        """
        # Disconnect if currently connected
        if self._connected:
            self.disconnect()
        
        # Update configuration
        self.config = ShopifyConnectorConfig(**configuration)
        
        # Re-initialize components
        self.auth = self._setup_auth()
        self.transport = self._setup_transport()
        self.retry_policy = self._setup_retry()
        self.rate_limiter = self._setup_rate_limiter()
        self.circuit_breaker = self._setup_circuit_breaker()
        self.hook_manager = self._setup_hooks()
        self.paginator = self._setup_paginator()
        
        logger.info("Shopify connector re-initialized", extra={
            "shop": self.config.shop,
            "api_version": self.config.apiVersion
        })
    
    def connect(self) -> None:
        """
        Establish connection to Shopify.
        
        This method validates credentials and establishes a connection
        to the Shopify API. It's part of the API Connector Specification.
        
        Raises:
            ConnectionError: If connection fails
            AuthFailedError: If credentials are invalid
        """
        try:
            # Check circuit breaker
            if self.circuit_breaker.is_open():
                raise ConnectionError("Circuit breaker is open")
            
            # Validate credentials
            if not self.auth.isValid():
                raise AuthFailedError("Invalid credentials")
            
            # Test connection with simple request
            test_response = self._execute_request({
                'method': 'GET',
                'path': '/shop',
                'timeout': 10000  # Short timeout for connection test
            })
            
            # Update connection state
            self._connected = True
            self._connection_time = datetime.utcnow()
            
            # Reset circuit breaker on successful connection
            self.circuit_breaker.on_success()
            
            logger.info("Successfully connected to Shopify", extra={
                "shop": self.config.shop,
                "connection_time": self._connection_time.isoformat()
            })
            
        except Exception as e:
            self._connected = False
            self._connection_time = None
            
            # Record failure in circuit breaker
            self.circuit_breaker.on_failure()
            
            if isinstance(e, ConnectorError):
                raise
            
            raise ConnectionError(f"Failed to connect: {e}")
    
    def disconnect(self) -> None:
        """
        Gracefully close connection to Shopify.
        
        This method drains in-flight requests and cleans up resources.
        It's part of the API Connector Specification.
        """
        if self._connected:
            try:
                # Drain in-flight requests
                self._drain_inflight_requests()
                
                # Close transport
                self.transport.close()
                
                # Update connection state
                self._connected = False
                self._connection_time = None
                
                logger.info("Disconnected from Shopify", extra={
                    "shop": self.config.shop
                })
                
            except Exception as e:
                logger.error("Error during disconnect", extra={
                    "shop": self.config.shop,
                    "error": str(e)
                })
                # Ensure connection state is reset even on error
                self._connected = False
                self._connection_time = None
    
    def isConnected(self) -> bool:
        """
        Check if the connector is currently connected.
        
        Returns:
            True if connected and credentials are valid, False otherwise
        
        This method is part of the API Connector Specification.
        """
        return self._connected and self.auth.isValid()
    
    def request(self, options: Dict[str, Any]) -> Dict[str, Any]:
        """
        Core request method implementing the API Connector Specification.
        
        This method handles the complete request lifecycle including:
        - Hook execution
        - Rate limiting
        - Circuit breaker checks
        - Retry logic
        - Response wrapping
        
        Args:
            options: Request options including method, path, headers, etc.
        
        Returns:
            Response following the API spec structure
        
        Raises:
            ConnectionError: If not connected
            ConnectorError: For various error conditions
        """
        # Validate connection
        if not self.isConnected():
            raise ConnectionError("Not connected")
        
        # Check circuit breaker
        if self.circuit_breaker.is_open():
            raise ConnectionError("Circuit breaker is open")
        
        # Apply beforeRequest hooks
        context = HookContext(
            hook_type=HookType.BEFORE_REQUEST,
            request_options=options
        )
        self.hook_manager.execute_hooks(HookType.BEFORE_REQUEST, context)
        
        # Wait for rate limit slot
        self.rate_limiter.wait_for_slot()
        
        try:
            # Execute with retry logic
            start_time = time.time()
            response = self._execute_with_retry(options)
            duration = int((time.time() - start_time) * 1000)
            
            # Add duration to response
            response['duration'] = duration
            
            # Apply afterResponse hooks
            context = HookContext(
                hook_type=HookType.AFTER_RESPONSE,
                request_options=options,
                response=response
            )
            self.hook_manager.execute_hooks(HookType.AFTER_RESPONSE, context)
            
            # Record success in circuit breaker
            self.circuit_breaker.on_success()
            
            # Wrap response per API spec
            return self._wrap_response(response)
            
        except Exception as error:
            # Apply onError hooks
            context = HookContext(
                hook_type=HookType.ON_ERROR,
                request_options=options,
                error=error
            )
            self.hook_manager.execute_hooks(HookType.ON_ERROR, context)
            
            # Record failure in circuit breaker
            self.circuit_breaker.on_failure(error)
            
            # Re-raise the error
            raise
    
    def get(self, path: str, options: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Perform GET request implementing the API Connector Specification.
        
        Args:
            path: API endpoint path (e.g., '/products')
            options: Additional request options
        
        Returns:
            Response following the API spec structure
        """
        request_options = {
            'method': 'GET',
            'path': path,
            **(options or {})
        }
        
        return self.request(request_options)
    
    def paginate(self, path: str, options: Optional[Dict[str, Any]] = None) -> Iterator[List[Any]]:
        """
        Paginate through results implementing the API Connector Specification.
        
        This method returns an iterator that automatically handles pagination
        through Shopify's Link headers.
        
        Args:
            path: API endpoint path (e.g., '/products')
            options: Pagination options
        
        Returns:
            Iterator yielding lists of items for each page
        """
        # Apply beforePagination hooks
        context = HookContext(
            hook_type=HookType.BEFORE_PAGINATION,
            request_options={'path': path, 'options': options}
        )
        self.hook_manager.execute_hooks(HookType.BEFORE_PAGINATION, context)
        
        # Execute pagination
        pagination_result = self.paginator.paginate(path, options or {})
        
        # Apply afterPagination hooks
        context = HookContext(
            hook_type=HookType.AFTER_PAGINATION,
            request_options={'path': path, 'options': options}
        )
        self.hook_manager.execute_hooks(HookType.AFTER_PAGINATION, context)
        
        return pagination_result
    
    def _setup_auth(self) -> BaseAuth:
        """Setup authentication component."""
        auth = BearerAuth(self.config.accessToken)
        return auth
    
    def _setup_transport(self) -> BaseTransport:
        """Setup transport layer with GraphQL primary and REST fallback."""
        if self.config.useGraphQL:
            # TODO: Implement GraphQL transport
            # For now, fall back to REST
            logger.info("GraphQL transport not yet implemented, using REST fallback")
            rest_transport = RESTTransport(self.config)
            rest_transport.set_auth(self.auth)
            return rest_transport
        else:
            rest_transport = RESTTransport(self.config)
            rest_transport.set_auth(self.auth)
            return rest_transport
    
    def _setup_retry(self) -> RetryPolicy:
        """Setup retry policy."""
        return RetryPolicy(self.config.retry)
    
    def _setup_rate_limiter(self) -> TokenBucketRateLimiter:
        """Setup rate limiter."""
        return TokenBucketRateLimiter(self.config.rateLimit)
    
    def _setup_circuit_breaker(self) -> CircuitBreaker:
        """Setup circuit breaker."""
        return CircuitBreaker(self.config.circuitBreaker)
    
    def _setup_hooks(self) -> HookManager:
        """Setup hook manager with built-in hooks."""
        hook_manager = HookManager()
        
        # Register built-in hooks
        from .hooks.builtin import (
            LoggingHook, MetricsHook, TimingHook, ValidationHook, CorrelationHook
        )
        
        # Add built-in hooks for all hook types
        hook_manager.add_hook(HookType.BEFORE_REQUEST, LoggingHook("logging"))
        hook_manager.add_hook(HookType.BEFORE_REQUEST, MetricsHook("metrics"))
        hook_manager.add_hook(HookType.BEFORE_REQUEST, TimingHook("timing"))
        hook_manager.add_hook(HookType.BEFORE_REQUEST, ValidationHook("validation"))
        hook_manager.add_hook(HookType.BEFORE_REQUEST, CorrelationHook("correlation"))
        
        hook_manager.add_hook(HookType.AFTER_RESPONSE, LoggingHook("logging"))
        hook_manager.add_hook(HookType.AFTER_RESPONSE, MetricsHook("metrics"))
        hook_manager.add_hook(HookType.AFTER_RESPONSE, TimingHook("timing"))
        
        hook_manager.add_hook(HookType.ON_ERROR, LoggingHook("logging"))
        hook_manager.add_hook(HookType.ON_ERROR, MetricsHook("metrics"))
        
        hook_manager.add_hook(HookType.ON_RETRY, LoggingHook("logging"))
        hook_manager.add_hook(HookType.ON_RETRY, MetricsHook("metrics"))
        
        return hook_manager
    
    def _setup_paginator(self) -> BasePagination:
        """Setup pagination component."""
        return LinkHeaderPagination(self)
    
    def _execute_request(self, options: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a single request through the transport layer."""
        return self.transport.execute(options)
    
    def _execute_with_retry(self, options: Dict[str, Any]) -> Dict[str, Any]:
        """Execute request with retry logic."""
        attempt = 1
        start_time = time.time()
        
        while True:
            try:
                return self._execute_request(options)
                
            except Exception as error:
                # Check if we should retry
                if not self.retry_policy.should_retry(error, attempt):
                    raise
                
                # Check retry budget
                elapsed = (time.time() - start_time) * 1000
                if elapsed > self.config.retry.retryBudgetMs:
                    raise TimeoutError(
                        f"Retry budget exceeded: {elapsed}ms > {self.config.retry.retryBudgetMs}ms"
                    )
                
                # Calculate delay
                delay = self.retry_policy.calculate_delay(attempt)
                
                # Apply onRetry hooks
                context = HookContext(
                    hook_type=HookType.ON_RETRY,
                    request_options=options,
                    error=error,
                    metadata={'attempt': attempt}
                )
                self.hook_manager.execute_hooks(HookType.ON_RETRY, context)
                
                # Wait before retry
                time.sleep(delay / 1000.0)
                
                attempt += 1
                
                logger.info("Retrying request", extra={
                    "attempt": attempt,
                    "delay_ms": delay,
                    "error": str(error)
                })
    
    def _wrap_response(self, raw_response: Dict[str, Any]) -> Dict[str, Any]:
        """
        Wrap response per API Connector Specification structure.
        
        Returns:
            Response with data, status, headers, and meta fields
        """
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
    
    def _extract_data(self, response: Dict[str, Any]) -> Any:
        """Extract data from response based on content type."""
        if 'data' in response:
            return response['data']
        elif 'body' in response:
            return response['body']
        else:
            return response
    
    def _extract_rate_limit(self, headers: Dict[str, str]) -> Dict[str, Any]:
        """Extract rate limit information from response headers."""
        rate_limit_header = headers.get('X-Shopify-Shop-Api-Call-Limit')
        
        if rate_limit_header:
            try:
                used, limit = rate_limit_header.split('/')
                return {
                    'limit': int(limit),
                    'remaining': int(limit) - int(used),
                    'used': int(used)
                }
            except (ValueError, IndexError):
                pass
        
        return {}
    

    
    def _drain_inflight_requests(self) -> None:
        """Drain any in-flight requests before disconnecting."""
        # TODO: Implement request draining mechanism
        # This would track active requests and wait for them to complete
        pass
    
    def get_status(self) -> Dict[str, Any]:
        """
        Get connector status information.
        
        Returns:
            Dictionary containing connection status and component health
        """
        return {
            'connected': self._connected,
            'connection_time': self._connection_time.isoformat() if self._connection_time else None,
            'auth_valid': self.auth.isValid(),
            'circuit_breaker_open': self.circuit_breaker.is_open(),
            'rate_limit_status': self.rate_limiter.get_status(),
            'shop': self.config.shop,
            'api_version': self.config.apiVersion,
            'hook_stats': self.hook_manager.get_hook_stats()
        }
    
    def get_hook_stats(self) -> Dict[str, Any]:
        """
        Get hook execution statistics.
        
        Returns:
            Dictionary containing hook execution metrics
        """
        return self.hook_manager.get_hook_stats()
