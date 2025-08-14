"""
Base transport interface for the Shopify connector.

This module defines the abstract base class that all transport
methods must implement to work with the connector.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional


class BaseTransport(ABC):
    """
    Abstract base class for transport methods.
    
    All transport implementations must inherit from this class
    and implement the required methods for making HTTP requests
    to the Shopify API.
    """
    
    @abstractmethod
    def execute(self, options: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute an HTTP request to the Shopify API.
        
        This method should handle the complete request lifecycle including:
        - Building the request URL
        - Applying authentication
        - Making the HTTP request
        - Processing the response
        - Error handling
        
        Args:
            options: Request options including method, path, headers, query, body, etc.
        
        Returns:
            Response dictionary containing status_code, headers, body, etc.
        
        Raises:
            NetworkError: For network connectivity issues
            TimeoutError: If request exceeds timeout
            AuthFailedError: For authentication failures
            ServerError: For server-side errors
        """
        pass
    
    @abstractmethod
    def close(self) -> None:
        """
        Close the transport and clean up resources.
        
        This method should:
        - Close any open connections
        - Cancel in-flight requests
        - Clean up timers and resources
        """
        pass
    
    def is_healthy(self) -> bool:
        """
        Check if the transport is healthy and ready to handle requests.
        
        Returns:
            True if transport is healthy, False otherwise
        """
        return True
    
    def get_stats(self) -> Dict[str, Any]:
        """
        Get transport statistics and metrics.
        
        Returns:
            Dictionary containing transport statistics
        """
        return {
            'type': self.get_transport_type(),
            'healthy': self.is_healthy(),
            'active_connections': 0,
            'total_requests': 0,
            'successful_requests': 0,
            'failed_requests': 0
        }
    
    def get_transport_type(self) -> str:
        """
        Get the type of transport method.
        
        Returns:
            String identifier for the transport type
        """
        return self.__class__.__name__.lower().replace('transport', '')
    
    def supports_method(self, method: str) -> bool:
        """
        Check if the transport supports a specific HTTP method.
        
        Args:
            method: HTTP method to check (GET, POST, PUT, DELETE, etc.)
        
        Returns:
            True if method is supported, False otherwise
        """
        supported_methods = getattr(self, 'supported_methods', ['GET', 'POST', 'PUT', 'DELETE'])
        return method.upper() in supported_methods
    
    def supports_endpoint(self, endpoint: str) -> bool:
        """
        Check if the transport supports a specific API endpoint.
        
        Args:
            endpoint: API endpoint path to check
        
        Returns:
            True if endpoint is supported, False otherwise
        """
        # Default implementation - assume all endpoints are supported
        return True
    
    def get_capabilities(self) -> Dict[str, Any]:
        """
        Get transport capabilities and features.
        
        Returns:
            Dictionary containing transport capabilities
        """
        return {
            'type': self.get_transport_type(),
            'methods': getattr(self, 'supported_methods', ['GET', 'POST', 'PUT', 'DELETE']),
            'features': {
                'connection_pooling': False,
                'keep_alive': False,
                'compression': False,
                'streaming': False,
                'batch_requests': False
            }
        }
