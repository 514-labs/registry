"""
Pagination package for the Shopify connector.

This package provides pagination implementations for different
Shopify API pagination mechanisms.
"""

from .base import BasePagination
from .cursor import CursorPagination

__all__ = [
    'BasePagination',
    'CursorPagination',
]
