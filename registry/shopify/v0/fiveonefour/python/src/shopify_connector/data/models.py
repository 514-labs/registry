"""
Pydantic models for Shopify resources.

This module defines data models for common Shopify resources
with proper validation, transformation, and serialization.
"""

import re
from datetime import datetime
from typing import Any, Dict, List, Optional, Union
from decimal import Decimal

from pydantic import BaseModel, Field, validator, root_validator


class ShopifyBaseModel(BaseModel):
    """Base model for all Shopify resources."""
    
    class Config:
        """Pydantic configuration."""
        # Allow extra fields from Shopify API
        extra = "allow"
        # Use enum values for validation
        use_enum_values = True
        # Validate assignment
        validate_assignment = True
    
    @root_validator(pre=True)
    def normalize_timestamps(cls, values: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize timestamp fields to UTC ISO-8601 format."""
        timestamp_fields = ['created_at', 'updated_at', 'published_at', 'closed_at']
        
        for field in timestamp_fields:
            if field in values and values[field]:
                try:
                    # Parse and normalize timestamp
                    if isinstance(values[field], str):
                        dt = datetime.fromisoformat(values[field].replace('Z', '+00:00'))
                    elif isinstance(values[field], (int, float)):
                        dt = datetime.fromtimestamp(values[field])
                    else:
                        dt = values[field]
                    
                    # Ensure UTC timezone
                    if dt.tzinfo is None:
                        dt = dt.replace(tzinfo=datetime.utcnow().tzinfo)
                    
                    values[field] = dt.isoformat()
                except Exception:
                    # Keep original value if parsing fails
                    pass
        
        return values


class Money(BaseModel):
    """Money amount with currency."""
    
    amount: Decimal = Field(..., description="Amount value")
    currency_code: str = Field(..., description="Currency code (e.g., USD, EUR)")
    
    @validator('currency_code')
    def validate_currency_code(cls, v: str) -> str:
        """Validate currency code format."""
        if not re.match(r'^[A-Z]{3}$', v):
            raise ValueError('Currency code must be 3 uppercase letters')
        return v
    
    def __str__(self) -> str:
        """String representation."""
        return f"{self.amount} {self.currency_code}"


class Image(BaseModel):
    """Product or collection image."""
    
    id: Optional[int] = Field(None, description="Image ID")
    src: str = Field(..., description="Image URL")
    alt: Optional[str] = Field(None, description="Alt text")
    width: Optional[int] = Field(None, description="Image width")
    height: Optional[int] = Field(None, description="Image height")
    created_at: Optional[str] = Field(None, description="Creation timestamp")
    updated_at: Optional[str] = Field(None, description="Update timestamp")


class Product(ShopifyBaseModel):
    """Shopify product model."""
    
    id: int = Field(..., description="Product ID")
    title: str = Field(..., description="Product title")
    body_html: Optional[str] = Field(None, description="Product description HTML")
    vendor: Optional[str] = Field(None, description="Product vendor")
    product_type: Optional[str] = Field(None, description="Product type")
    handle: str = Field(..., description="Product handle (URL slug)")
    status: str = Field(..., description="Product status (active, draft, archived)")
    published_at: Optional[str] = Field(None, description="Publication timestamp")
    created_at: str = Field(..., description="Creation timestamp")
    updated_at: str = Field(..., description="Update timestamp")
    
    # Optional fields
    tags: Optional[str] = Field(None, description="Comma-separated tags")
    template_suffix: Optional[str] = Field(None, description="Template suffix")
    admin_graphql_api_id: Optional[str] = Field(None, description="GraphQL API ID")
    
    # Related data (may be included in response)
    images: Optional[List[Image]] = Field(None, description="Product images")
    variants: Optional[List[Dict[str, Any]]] = Field(None, description="Product variants")
    options: Optional[List[Dict[str, Any]]] = Field(None, description="Product options")
    
    @validator('status')
    def validate_status(cls, v: str) -> str:
        """Validate product status."""
        valid_statuses = ['active', 'draft', 'archived']
        if v not in valid_statuses:
            raise ValueError(f'Status must be one of: {valid_statuses}')
        return v
    
    @validator('handle')
    def validate_handle(cls, v: str) -> str:
        """Validate product handle format."""
        if not re.match(r'^[a-z0-9-]+$', v):
            raise ValueError('Handle must contain only lowercase letters, numbers, and hyphens')
        return v


class Order(ShopifyBaseModel):
    """Shopify order model."""
    
    id: int = Field(..., description="Order ID")
    order_number: int = Field(..., description="Order number")
    name: str = Field(..., description="Order name (e.g., #1001)")
    email: Optional[str] = Field(None, description="Customer email")
    phone: Optional[str] = Field(None, description="Customer phone")
    created_at: str = Field(..., description="Creation timestamp")
    updated_at: str = Field(..., description="Update timestamp")
    closed_at: Optional[str] = Field(None, description="Closure timestamp")
    
    # Financial information
    total_price: str = Field(..., description="Total order price")
    subtotal_price: str = Field(..., description="Subtotal price")
    total_tax: str = Field(..., description="Total tax amount")
    currency: str = Field(..., description="Order currency")
    
    # Order status
    financial_status: str = Field(..., description="Financial status")
    fulfillment_status: Optional[str] = Field(None, description="Fulfillment status")
    order_status_url: str = Field(..., description="Order status page URL")
    
    # Customer information
    customer: Optional[Dict[str, Any]] = Field(None, description="Customer information")
    shipping_address: Optional[Dict[str, Any]] = Field(None, description="Shipping address")
    billing_address: Optional[Dict[str, Any]] = Field(None, description="Billing address")
    
    # Line items
    line_items: Optional[List[Dict[str, Any]]] = Field(None, description="Order line items")
    
    @validator('financial_status')
    def validate_financial_status(cls, v: str) -> str:
        """Validate financial status."""
        valid_statuses = ['pending', 'authorized', 'paid', 'partially_paid', 'refunded', 'voided']
        if v not in valid_statuses:
            raise ValueError(f'Financial status must be one of: {valid_statuses}')
        return v
    
    @validator('fulfillment_status')
    def validate_fulfillment_status(cls, v: Optional[str]) -> Optional[str]:
        """Validate fulfillment status."""
        if v is not None:
            valid_statuses = ['unfulfilled', 'partial', 'fulfilled']
            if v not in valid_statuses:
                raise ValueError(f'Fulfillment status must be one of: {valid_statuses}')
        return v


class Customer(ShopifyBaseModel):
    """Shopify customer model."""
    
    id: int = Field(..., description="Customer ID")
    email: str = Field(..., description="Customer email")
    first_name: Optional[str] = Field(None, description="First name")
    last_name: Optional[str] = Field(None, description="Last name")
    phone: Optional[str] = Field(None, description="Phone number")
    created_at: str = Field(..., description="Creation timestamp")
    updated_at: str = Field(..., description="Update timestamp")
    
    # Customer status
    verified_email: bool = Field(False, description="Email verification status")
    accepts_marketing: bool = Field(False, description="Marketing consent")
    state: str = Field(..., description="Customer state (enabled, disabled)")
    
    # Addresses
    addresses: Optional[List[Dict[str, Any]]] = Field(None, description="Customer addresses")
    default_address: Optional[Dict[str, Any]] = Field(None, description="Default address")
    
    # Statistics
    orders_count: int = Field(0, description="Total orders count")
    total_spent: str = Field("0.00", description="Total amount spent")
    
    @validator('email')
    def validate_email(cls, v: str) -> str:
        """Validate email format."""
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, v):
            raise ValueError('Invalid email format')
        return v.lower()
    
    @validator('state')
    def validate_state(cls, v: str) -> str:
        """Validate customer state."""
        valid_states = ['enabled', 'disabled']
        if v not in valid_states:
            raise ValueError(f'State must be one of: {valid_states}')
        return v


class Collection(ShopifyBaseModel):
    """Shopify collection model."""
    
    id: int = Field(..., description="Collection ID")
    title: str = Field(..., description="Collection title")
    handle: str = Field(..., description="Collection handle (URL slug)")
    body_html: Optional[str] = Field(None, description="Collection description HTML")
    published_at: Optional[str] = Field(None, description="Publication timestamp")
    created_at: str = Field(..., description="Creation timestamp")
    updated_at: str = Field(..., description="Update timestamp")
    
    # Collection settings
    sort_order: str = Field(..., description="Sort order (manual, best-selling, etc.)")
    template_suffix: Optional[str] = Field(None, description="Template suffix")
    published_scope: str = Field(..., description="Published scope (web, global)")
    
    # SEO
    seo_title: Optional[str] = Field(None, description="SEO title")
    seo_description: Optional[str] = Field(None, description="SEO description")
    
    # Image
    image: Optional[Image] = Field(None, description="Collection image")
    
    @validator('sort_order')
    def validate_sort_order(cls, v: str) -> str:
        """Validate sort order."""
        valid_orders = ['manual', 'best-selling', 'title', 'price', 'price-desc', 'created', 'created-desc']
        if v not in valid_orders:
            raise ValueError(f'Sort order must be one of: {valid_orders}')
        return v
    
    @validator('published_scope')
    def validate_published_scope(cls, v: str) -> str:
        """Validate published scope."""
        valid_scopes = ['web', 'global']
        if v not in valid_scopes:
            raise ValueError(f'Published scope must be one of: {valid_scopes}')
        return v


class Shop(ShopifyBaseModel):
    """Shopify shop model."""
    
    id: int = Field(..., description="Shop ID")
    name: str = Field(..., description="Shop name")
    email: str = Field(..., description="Shop email")
    domain: str = Field(..., description="Shop domain")
    province: Optional[str] = Field(None, description="Province/state")
    country: str = Field(..., description="Country")
    address1: Optional[str] = Field(None, description="Address line 1")
    city: Optional[str] = Field(None, description="City")
    zip: Optional[str] = Field(None, description="Postal code")
    phone: Optional[str] = Field(None, description="Phone number")
    latitude: Optional[float] = Field(None, description="Latitude")
    longitude: Optional[float] = Field(None, description="Longitude")
    
    # Shop settings
    primary_locale: str = Field(..., description="Primary locale")
    address2: Optional[str] = Field(None, description="Address line 2")
    created_at: str = Field(..., description="Creation timestamp")
    updated_at: str = Field(..., description="Update timestamp")
    
    # Shop status
    customer_email: Optional[str] = Field(None, description="Customer service email")
    timezone: str = Field(..., description="Timezone")
    iana_timezone: str = Field(..., description="IANA timezone")
    shop_owner: str = Field(..., description="Shop owner name")
    money_format: str = Field(..., description="Money format")
    money_with_currency_format: str = Field(..., description="Money with currency format")
    weight_unit: str = Field(..., description="Weight unit")
    province_code: Optional[str] = Field(None, description="Province/state code")
    country_code: str = Field(..., description="Country code")
    country_name: str = Field(..., description="Country name")
    currency: str = Field(..., description="Shop currency")
    has_storefront: bool = Field(False, description="Has online store")
    setup_required: bool = Field(False, description="Setup required")
    
    @validator('country_code')
    def validate_country_code(cls, v: str) -> str:
        """Validate country code format."""
        if not re.match(r'^[A-Z]{2}$', v):
            raise ValueError('Country code must be 2 uppercase letters')
        return v
    
    @validator('currency')
    def validate_currency(cls, v: str) -> str:
        """Validate currency format."""
        if not re.match(r'^[A-Z]{3}$', v):
            raise ValueError('Currency must be 3 uppercase letters')
        return v


# Model registry for easy access
SHOPIFY_MODELS = {
    'product': Product,
    'order': Order,
    'customer': Customer,
    'collection': Collection,
    'shop': Shop,
    'image': Image,
    'money': Money
}


def get_model_for_resource(resource_type: str) -> Optional[type]:
    """
    Get the appropriate model class for a resource type.
    
    Args:
        resource_type: Resource type (e.g., 'products', 'orders')
    
    Returns:
        Model class or None if not found
    """
    # Remove pluralization
    if resource_type.endswith('s'):
        resource_type = resource_type[:-1]
    
    return SHOPIFY_MODELS.get(resource_type.lower())


def validate_resource_data(resource_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate and transform resource data using appropriate model.
    
    Args:
        resource_type: Resource type (e.g., 'products', 'orders')
        data: Raw resource data
    
    Returns:
        Validated and transformed data
    """
    model_class = get_model_for_resource(resource_type)
    if model_class:
        try:
            # Handle both single objects and lists
            if isinstance(data, list):
                return [model_class(**item).dict() for item in data]
            else:
                return model_class(**data).dict()
        except Exception as e:
            # Log validation error but return original data
            import logging
            logger = logging.getLogger(__name__)
            logger.warning(f"Data validation failed for {resource_type}: {e}")
            return data
    
    return data
