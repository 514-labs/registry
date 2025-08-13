"""
HTTP client with connection pooling for the Shopify connector.

This module provides a robust HTTP client that handles connection pooling,
timeouts, and request/response processing.
"""

import time
import logging
from typing import Any, Dict, Optional, Union
from urllib.parse import urlencode, urljoin

import httpx
from httpx import Response, TimeoutException, ConnectError, HTTPStatusError

from ..errors.base import (
    NetworkError, TimeoutError, AuthFailedError, 
    ServerError, InvalidRequestError
)
from ..config.schema import ShopifyConnectorConfig


logger = logging.getLogger(__name__)


class HTTPClient:
    """
    HTTP client with connection pooling for Shopify API requests.
    
    This client provides:
    - Connection pooling with keep-alive
    - Configurable timeouts
    - Request/response logging
    - Error handling and mapping
    - Metrics collection
    """
    
    def __init__(self, config: ShopifyConnectorConfig):
        """
        Initialize the HTTP client.
        
        Args:
            config: Connector configuration containing HTTP settings
        """
        self.config = config
        self.client: Optional[httpx.Client] = None
        self._setup_client()
        
        # Statistics
        self.total_requests = 0
        self.successful_requests = 0
        self.failed_requests = 0
        self.start_time = time.time()
    
    def _setup_client(self) -> None:
        """Setup the HTTP client with connection pooling."""
        # Connection pooling configuration
        limits = httpx.Limits(
            max_connections=self.config.pooling.maxConnections,
            max_keepalive_connections=self.config.pooling.maxConnectionsPerHost,
            keepalive_expiry=self.config.pooling.idleTimeout / 1000.0  # Convert to seconds
        )
        
        # Timeout configuration
        timeout = httpx.Timeout(
            connect=self.config.pooling.connectionTimeout / 1000.0,
            read=self.config.timeout / 1000.0,
            write=self.config.timeout / 1000.0,
            pool=self.config.pooling.idleTimeout / 1000.0
        )
        
        # Create client with configuration
        self.client = httpx.Client(
            limits=limits,
            timeout=timeout,
            http2=False,  # Shopify doesn't support HTTP/2
            verify=True,  # Always verify SSL certificates
            follow_redirects=True,
            max_redirects=5
        )
        
        logger.debug("HTTP client initialized", extra={
            'max_connections': self.config.pooling.maxConnections,
            'max_keepalive': self.config.pooling.maxConnectionsPerHost,
            'connection_timeout': self.config.pooling.connectionTimeout,
            'request_timeout': self.config.timeout
        })
    
    def request(
        self,
        method: str,
        url: str,
        headers: Optional[Dict[str, str]] = None,
        params: Optional[Dict[str, Any]] = None,
        data: Optional[Union[Dict[str, Any], str]] = None,
        json: Optional[Dict[str, Any]] = None,
        timeout: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Make an HTTP request to the Shopify API.
        
        Args:
            method: HTTP method (GET, POST, PUT, DELETE)
            url: Full URL to request
            headers: Request headers
            params: Query parameters
            data: Form data or raw body
            json: JSON body data
            timeout: Request timeout in milliseconds (overrides config)
        
        Returns:
            Response dictionary with status_code, headers, body, etc.
        
        Raises:
            NetworkError: For network connectivity issues
            TimeoutError: If request exceeds timeout
            ServerError: For server-side errors
            InvalidRequestError: For client-side errors
        """
        if not self.client:
            raise NetworkError("HTTP client not initialized")
        
        # Apply timeout override
        if timeout:
            request_timeout = timeout / 1000.0
        else:
            request_timeout = self.config.timeout / 1000.0
        
        # Prepare request data
        # Do not coerce JSON into form data; pass through httpx json= below
        # request_data = self._prepare_request_data(method, data, json)
        
        # Prepare headers
        request_headers = self._prepare_headers(headers)
        
        # Prepare query parameters
        request_params = self._prepare_params(params)
        
        # Log request
        logger.debug("Making HTTP request", extra={
            'method': method,
            'url': url,
            'headers': self._redact_sensitive_headers(request_headers),
            'params': request_params,
            'timeout': request_timeout
        })
        
        start_time = time.time()
        self.total_requests += 1
        
        try:
            # Make request
            response = self.client.request(
                method=method,
                url=url,
                headers=request_headers,
                params=request_params,
                data=data,
                json=json,
                timeout=request_timeout
            )

            # Treat non-2xx/3xx as failures
            response.raise_for_status()

            # Process response
            result = self._process_response(response, start_time)
            self.successful_requests += 1

            logger.debug("HTTP request successful", extra={
                'method': method,
                'url': url,
                'status_code': response.status_code,
                'duration_ms': int((time.time() - start_time) * 1000)
            })

            return result
            
        except TimeoutException as e:
            self.failed_requests += 1
            duration = int((time.time() - start_time) * 1000)
            logger.warning("HTTP request timeout", extra={
                'method': method,
                'url': url,
                'timeout_ms': int(request_timeout * 1000),
                'duration_ms': duration
            })
            raise TimeoutError(
                f"Request timeout after {duration}ms",
                timeout_ms=int(request_timeout * 1000)
            )
            
        except ConnectError as e:
            self.failed_requests += 1
            logger.error("HTTP connection error", extra={
                'method': method,
                'url': url,
                'error': str(e)
            })
            raise NetworkError(f"Connection failed: {e}")
            
        except HTTPStatusError as e:
            self.failed_requests += 1
            duration = int((time.time() - start_time) * 1000)
            
            # Map HTTP status codes to our error types
            if e.response.status_code in [401, 403]:
                raise AuthFailedError(
                    f"Authentication failed: {e.response.status_code}",
                    status_code=e.response.status_code
                )
            elif e.response.status_code in [400, 404, 422]:
                raise InvalidRequestError(
                    f"Invalid request: {e.response.status_code}",
                    status_code=e.response.status_code
                )
            elif e.response.status_code >= 500:
                raise ServerError(
                    f"Server error: {e.response.status_code}",
                    status_code=e.response.status_code
                )
            else:
                raise InvalidRequestError(
                    f"Request failed: {e.response.status_code}",
                    status_code=e.response.status_code
                )
                
        except Exception as e:
            self.failed_requests += 1
            duration = int((time.time() - start_time) * 1000)
            logger.error("HTTP request failed", extra={
                'method': method,
                'url': url,
                'error': str(e),
                'duration_ms': duration
            })
            raise NetworkError(f"Request failed: {e}")
    
    def _prepare_request_data(
        self,
        method: str,
        data: Optional[Union[Dict[str, Any], str]] = None,
        json: Optional[Dict[str, Any]] = None
    ) -> Optional[Union[Dict[str, Any], str]]:
        """Prepare request data based on method and content."""
        if method.upper() in ['GET', 'HEAD', 'DELETE']:
            return None
        
        if json is not None:
            return json
        elif data is not None:
            return data
        
        return None
    
    def _prepare_headers(self, headers: Optional[Dict[str, str]]) -> Dict[str, str]:
        """Prepare request headers with defaults."""
        request_headers = {}
        
        # Add default headers from config
        if self.config.defaults.headers:
            request_headers.update(self.config.defaults.headers)
        
        # Add user-provided headers
        if headers:
            request_headers.update(headers)
        
        # Ensure content-type for JSON requests
        if 'Content-Type' not in request_headers:
            request_headers['Content-Type'] = 'application/json'
        
        # Ensure Accept JSON
        if 'Accept' not in request_headers:
            request_headers['Accept'] = 'application/json'
        
        # Add a User-Agent
        request_headers.setdefault('User-Agent', 'shopify-connector/0.1.0')
        
        return request_headers
    
    def _prepare_params(self, params: Optional[Dict[str, Any]]) -> Optional[Dict[str, str]]:
        """Prepare query parameters."""
        if not params:
            return None
        
        # Convert all values to strings
        string_params = {}
        for key, value in params.items():
            if value is not None:
                string_params[key] = str(value)
        
        return string_params
    
    def _process_response(self, response: Response, start_time: float) -> Dict[str, Any]:
        """Process the HTTP response into our standard format."""
        duration = int((time.time() - start_time) * 1000)
        
        # Parse response body
        try:
            if response.headers.get('content-type', '').startswith('application/json'):
                body = response.json()
            else:
                body = response.text
        except Exception as e:
            logger.warning("Failed to parse response body", extra={
                'status_code': response.status_code,
                'content_type': response.headers.get('content-type'),
                'error': str(e)
            })
            body = response.text
        
        return {
            'status_code': response.status_code,
            'headers': dict(response.headers),
            'body': body,
            'duration': duration,
            'url': str(response.url)
        }
    
    def _redact_sensitive_headers(self, headers: Dict[str, str]) -> Dict[str, str]:
        """Redact sensitive information from headers for logging."""
        redacted = headers.copy()
        sensitive_keys = ['authorization', 'x-shopify-access-token', 'cookie']
        
        for key in sensitive_keys:
            if key in redacted:
                redacted[key] = '***REDACTED***'
        
        return redacted
    
    def close(self) -> None:
        """Close the HTTP client and clean up resources."""
        if self.client:
            self.client.close()
            self.client = None
            logger.debug("HTTP client closed")
    
    def is_healthy(self) -> bool:
        """Check if the HTTP client is healthy."""
        return self.client is not None
    
    def get_stats(self) -> Dict[str, Any]:
        """Get HTTP client statistics."""
        uptime = time.time() - self.start_time
        
        return {
            'type': 'http',
            'healthy': self.is_healthy(),
            'uptime_seconds': int(uptime),
            'total_requests': self.total_requests,
            'successful_requests': self.successful_requests,
            'failed_requests': self.failed_requests,
            'success_rate': (
                self.successful_requests / self.total_requests * 100 
                if self.total_requests > 0 else 0
            ),
            'requests_per_second': (
                self.total_requests / uptime if uptime > 0 else 0
            )
        }

    def get_capabilities(self) -> Dict[str, Any]:
        """Return HTTP client capabilities used by tests and diagnostics."""
        return {
            'type': 'http',
            'features': {
                'connection_pooling': True,
                'keep_alive': True,
                'http2': False,
                'ssl_verification': True,
                'redirects': True,
            },
            'pooling': {
                'max_connections': self.config.pooling.maxConnections,
                'max_connections_per_host': self.config.pooling.maxConnectionsPerHost,
                'idle_timeout_ms': self.config.pooling.idleTimeout,
                'connection_timeout_ms': self.config.pooling.connectionTimeout,
            },
            'timeouts': {
                'request_timeout_ms': self.config.timeout,
            }
        }
    
    def __enter__(self):
        """Context manager entry."""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.close()
