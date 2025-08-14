"""
Data package for the Shopify connector.

This package provides data models, validation, and transformation
utilities for Shopify resources.
"""

from .models import (
    ShopifyBaseModel, Product, Order, Customer, Collection, 
    Shop, Image, Money, SHOPIFY_MODELS,
    get_model_for_resource, validate_resource_data
)

__all__ = [
    'ShopifyBaseModel',
    'Product',
    'Order',
    'Customer',
    'Collection',
    'Shop',
    'Image',
    'Money',
    'SHOPIFY_MODELS',
    'get_model_for_resource',
    'validate_resource_data',
]
