"""
Base authentication interface for the Shopify connector.

This module defines the abstract base class that all authentication
methods must implement to work with the connector.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional

from ..errors.base import AuthFailedError

class BaseAuth(ABC):
    """
    Abstract base class for authentication methods.
    
    All authentication implementations must inherit from this class
    and implement the required methods.
    """
    
    @abstractmethod
    def authenticate(self, request: Dict[str, Any]) -> None:
        """
        Apply authentication to the outgoing request.
        
        This method should modify the request dictionary to include
        the necessary authentication headers, query parameters, or
        other authentication mechanisms.
        
        Args:
            request: Request dictionary containing method, path, headers, etc.
                   The method should modify this dictionary in-place.
        
        Raises:
            AuthFailedError: If authentication cannot be applied
        """
        pass
    
    @abstractmethod
    def isValid(self) -> bool:
        """
        Check if the current authentication credentials are valid.
        
        Returns:
            True if credentials are valid and can be used, False otherwise
        
        Note:
            This method should perform a lightweight check without
            making network requests when possible.
        """
        pass
    
    def refresh(self) -> bool:
        """
        Refresh expired authentication credentials.
        
        This method is optional and may not be implemented by all
        authentication types. For example, API keys don't need refresh.
        
        Returns:
            True if refresh was successful, False otherwise
        
        Raises:
            AuthFailedError: If refresh fails and credentials are invalid
        """
        # Default implementation - no refresh needed
        return True
    
    def get_auth_type(self) -> str:
        """
        Get the type of authentication method.
        
        Returns:
            String identifier for the authentication type
        """
        return self.__class__.__name__.lower().replace('auth', '')
    
    def get_credentials_info(self) -> Dict[str, Any]:
        """
        Get information about the current credentials.
        
        This method should return metadata about the credentials
        without exposing sensitive information.
        
        Returns:
            Dictionary containing credential metadata
        """
        return {
            'type': self.get_auth_type(),
            'valid': self.isValid(),
            'refreshable': hasattr(self, 'refresh') and self.refresh != BaseAuth.refresh
        }


class InvalidAuth(BaseAuth):
    """
    Fallback auth used when provided credentials are invalid at construction time.
    
    This allows components to be initialized while clearly reporting invalid auth
    via isValid() and by raising on authenticate().
    """

    def __init__(self, reason: str = "invalid_credentials"):
        self.reason = reason

    def authenticate(self, request: Dict[str, Any]) -> None:
        raise AuthFailedError(f"Authentication not available: {self.reason}")

    def isValid(self) -> bool:
        return False
