"""
REST transport implementation for the Shopify connector.

This module implements REST API transport using the HTTP client
to communicate with Shopify's REST Admin API.
"""

import logging
from typing import Any, Dict, Optional

from .base import BaseTransport
from .http_client import HTTPClient
from ..auth.base import BaseAuth
from ..config.schema import ShopifyConnectorConfig
from ..errors.base import InvalidRequestError


logger = logging.getLogger(__name__)


class RESTTransport(BaseTransport):
    """
    REST transport implementation for Shopify's REST Admin API.
    
    This transport handles:
    - REST endpoint construction
    - Request/response processing
    - Error handling and mapping
    - Authentication application
    """
    
    def __init__(self, config: ShopifyConnectorConfig):
        """
        Initialize REST transport.
        
        Args:
            config: Connector configuration
        """
        self.config = config
        self.http_client = HTTPClient(config)
        self.auth: Optional[BaseAuth] = None
        
        # Supported HTTP methods for REST API
        self.supported_methods = ['GET', 'POST', 'PUT', 'DELETE']
        
        logger.debug("REST transport initialized", extra={
            'shop': config.shop,
            'api_version': config.apiVersion
        })
    
    def set_auth(self, auth: BaseAuth) -> None:
        """
        Set the authentication method for this transport.
        
        Args:
            auth: Authentication instance implementing BaseAuth
        """
        self.auth = auth
        logger.debug("Authentication set for REST transport", extra={
            'auth_type': auth.get_auth_type()
        })
    
    def execute(self, options: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a REST API request to Shopify.
        
        Args:
            options: Request options including method, path, headers, etc.
        
        Returns:
            Response dictionary with status_code, headers, body, etc.
        
        Raises:
            InvalidRequestError: For invalid request options
            NetworkError: For network connectivity issues
            AuthFailedError: For authentication failures
        """
        # Validate request options
        self._validate_request_options(options)
        
        # Build the full URL
        url = self._build_url(options)
        
        # Prepare request data
        method = options.get('method', 'GET').upper()
        headers = options.get('headers', {})
        params = options.get('query', {})
        data = options.get('data')
        json_data = options.get('json')
        timeout = options.get('timeout')
        
        # Apply authentication
        if self.auth:
            self.auth.authenticate(options)
            headers = options.get('headers', {})
        else:
            logger.warning("No authentication set for REST transport")
        
        # Make HTTP request
        response = self.http_client.request(
            method=method,
            url=url,
            headers=headers,
            params=params,
            data=data,
            json=json_data,
            timeout=timeout
        )
        
        # Process Shopify-specific response data
        response = self._process_shopify_response(response)
        
        logger.debug("REST request completed", extra={
            'method': method,
            'path': options.get('path'),
            'status_code': response.get('status_code'),
            'duration_ms': response.get('duration', 0)
        })
        
        return response
    
    def _validate_request_options(self, options: Dict[str, Any]) -> None:
        """Validate request options."""
        required_fields = ['method', 'path']
        for field in required_fields:
            if field not in options:
                raise InvalidRequestError(f"Missing required field: {field}")
        
        method = options.get('method', '').upper()
        if method not in self.supported_methods:
            raise InvalidRequestError(f"Unsupported HTTP method: {method}")
        
        path = options.get('path', '')
        if not path or not isinstance(path, str):
            raise InvalidRequestError("Path must be a non-empty string")
    
    def _build_url(self, options: Dict[str, Any]) -> str:
        """Build the full URL for the REST request."""
        path = options.get('path', '')
        
        # Ensure path starts with /
        if not path.startswith('/'):
            path = '/' + path
        
        # Ensure path ends with .json for REST API
        if not path.endswith('.json'):
            path = path + '.json'
        
        # Build full URL
        url = f"https://{self.config.shop}/admin/api/{self.config.apiVersion}{path}"
        
        logger.debug("Built REST URL", extra={
            'path': options.get('path'),
            'full_url': url
        })
        
        return url
    
    def _process_shopify_response(self, response: Dict[str, Any]) -> Dict[str, Any]:
        """Process Shopify-specific response data."""
        # Extract data from Shopify's response format
        if 'body' in response and isinstance(response['body'], dict):
            body = response['body']
            
            # Shopify typically returns data in a resource-named key
            # e.g., {"products": [...]} or {"shop": {...}}
            if len(body) == 1 and not any(key.startswith('_') for key in body.keys()):
                # Single resource response
                resource_name = list(body.keys())[0]
                response['data'] = body[resource_name]
            else:
                # Multiple resources or metadata response
                response['data'] = body
            
            # Extract pagination info if present
            if 'page_info' in body:
                response['pagination'] = {
                    'page_info': body['page_info']
                }
            
            # Extract rate limit info from headers
            rate_limit_header = response.get('headers', {}).get('X-Shopify-Shop-Api-Call-Limit')
            if rate_limit_header:
                try:
                    used, limit = rate_limit_header.split('/')
                    response['rate_limit'] = {
                        'used': int(used),
                        'limit': int(limit),
                        'remaining': int(limit) - int(used)
                    }
                except (ValueError, IndexError):
                    pass
        
        return response
    
    def close(self) -> None:
        """Close the REST transport and clean up resources."""
        if self.http_client:
            self.http_client.close()
        logger.debug("REST transport closed")
    
    def is_healthy(self) -> bool:
        """Check if the REST transport is healthy."""
        return self.http_client and self.http_client.is_healthy()
    
    def get_stats(self) -> Dict[str, Any]:
        """Get REST transport statistics."""
        base_stats = super().get_stats()
        if self.http_client:
            base_stats.update(self.http_client.get_stats())
        
        base_stats.update({
            'auth_configured': self.auth is not None,
            'auth_type': self.auth.get_auth_type() if self.auth else None
        })
        
        return base_stats
    
    def supports_method(self, method: str) -> bool:
        """Check if the transport supports a specific HTTP method."""
        return method.upper() in self.supported_methods
    
    def supports_endpoint(self, endpoint: str) -> bool:
        """Check if the transport supports a specific API endpoint."""
        # REST transport supports all endpoints
        return True
    
    def get_capabilities(self) -> Dict[str, Any]:
        """Get REST transport capabilities."""
        base_capabilities = super().get_capabilities()
        base_capabilities.update({
            'methods': self.supported_methods,
            'features': {
                'connection_pooling': True,
                'keep_alive': True,
                'compression': False,  # Shopify doesn't support compression
                'streaming': False,
                'batch_requests': False
            }
        })
        return base_capabilities
