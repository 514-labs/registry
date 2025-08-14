"""
Authentication package for the Shopify connector.

This package provides authentication implementations for different
Shopify authentication methods.
"""

from .base import BaseAuth
from .bearer import BearerAuth

__all__ = [
    'BaseAuth',
    'BearerAuth',
]
