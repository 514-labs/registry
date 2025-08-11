"""
Pagination package for the Shopify connector.

This package provides pagination implementations for different
Shopify API pagination mechanisms.
"""

from .base import BasePagination
from .link_header import LinkHeaderPagination

__all__ = [
    'BasePagination',
    'LinkHeaderPagination',
]
