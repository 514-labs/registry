"""
Bearer token authentication for Shopify Admin API.

This module implements bearer token authentication using Shopify's
Admin API access tokens (shpat_*).
"""

import re
from typing import Any, Dict

from .base import BaseAuth
from ..errors.base import AuthFailedError


class BearerAuth(BaseAuth):
    """
    Bearer token authentication for Shopify Admin API.
    
    This authentication method uses Shopify's Admin API access tokens
    which are sent in the X-Shopify-Access-Token header.
    """
    
    def __init__(self, access_token: str):
        """
        Initialize bearer authentication with access token.
        
        Args:
            access_token: Shopify Admin API access token (should start with 'shpat_')
        
        Raises:
            AuthFailedError: If access token format is invalid
        """
        self.access_token = self._validate_token(access_token)
    
    def _validate_token(self, token: str) -> str:
        """
        Validate the access token format.
        
        Args:
            token: Access token to validate
        
        Returns:
            Validated token string
        
        Raises:
            AuthFailedError: If token format is invalid
        """
        if not token:
            raise AuthFailedError("Access token cannot be empty")
        
        if not isinstance(token, str):
            raise AuthFailedError("Access token must be a string")
        
        # Shopify Admin API tokens start with 'shpat_' and are typically 40+ characters
        if not token.startswith('shpat_'):
            raise AuthFailedError("Access token must start with 'shpat_'")
        
        if len(token) < 20:
            raise AuthFailedError("Access token appears to be too short")
        
        # Basic format validation - should contain only alphanumeric and underscores
        if not re.match(r'^shpat_[a-zA-Z0-9_]+$', token):
            raise AuthFailedError("Access token contains invalid characters")
        
        return token
    
    def authenticate(self, request: Dict[str, Any]) -> None:
        """
        Apply bearer token authentication to the request.
        
        This method adds the X-Shopify-Access-Token header to the request.
        
        Args:
            request: Request dictionary to modify
        
        Raises:
            AuthFailedError: If authentication cannot be applied
        """
        if not self.isValid():
            raise AuthFailedError("Access token is not valid")
        
        # Ensure headers dictionary exists
        if 'headers' not in request:
            request['headers'] = {}
        
        # Add Shopify access token header
        request['headers']['X-Shopify-Access-Token'] = self.access_token
        
        # Remove Authorization header to match Shopify Admin API expectations
        if 'Authorization' in request['headers']:
            request['headers'].pop('Authorization', None)
    
    def isValid(self) -> bool:
        """
        Check if the access token is valid.
        
        For bearer tokens, we perform basic format validation.
        A full validation would require making an API call, which
        is expensive and not suitable for frequent checks.
        
        Returns:
            True if token format is valid, False otherwise
        """
        try:
            # Basic format validation
            self._validate_token(self.access_token)
            return True
        except AuthFailedError:
            return False
    
    def refresh(self) -> bool:
        """
        Refresh the access token.
        
        Shopify Admin API access tokens are long-lived and typically
        don't need refresh. This method always returns True.
        
        Returns:
            True (no refresh needed)
        """
        # Shopify Admin API tokens are long-lived and don't need refresh
        return True
    
    def get_credentials_info(self) -> Dict[str, Any]:
        """
        Get information about the bearer token credentials.
        
        Returns:
            Dictionary containing credential metadata (without exposing the token)
        """
        base_info = super().get_credentials_info()
        base_info.update({
            'token_length': len(self.access_token),
            'token_prefix': self.access_token[:10] + '...' if len(self.access_token) > 10 else self.access_token,
            'expires': False,  # Shopify Admin API tokens don't expire
            'refreshable': False
        })
        return base_info
    
    def __repr__(self) -> str:
        """String representation of the BearerAuth instance."""
        return f"BearerAuth(token_length={len(self.access_token)}, valid={self.isValid()})"
