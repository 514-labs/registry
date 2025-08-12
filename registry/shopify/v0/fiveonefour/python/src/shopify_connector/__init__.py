"""
Shopify Python Connector

A production-ready, read-only Python connector for Shopify that adheres to our
API Connector Specification. This connector provides a standardized interface
for extracting data from Shopify stores with built-in resilience, rate limiting,
and pagination.

Example:
    from shopify_connector import ShopifyConnector
    
    connector = ShopifyConnector({
        "shop": "your-store.myshopify.com",
        "apiVersion": "2025-07",
        "accessToken": "your-admin-api-token"
    })
    
    connector.connect()
    products = connector.get('/products')
    connector.disconnect()
"""

from .connector import ShopifyConnector
from .config.schema import ShopifyConnectorConfig
from .auth import BaseAuth, BearerAuth
from .transport import BaseTransport, HTTPClient, GraphQLTransport
from .resilience import RetryPolicy, TokenBucketRateLimiter, CircuitBreaker, CircuitState
from .pagination import BasePagination
from .data import (
    ShopifyBaseModel, Product, Order, Customer, Collection, 
    Shop, Image, Money, get_model_for_resource, validate_resource_data
)
from .hooks import (
    BaseHook, HookContext, HookType, HookPriority, HookExecutionError,
    HookManager, LoggingHook, MetricsHook, TimingHook, ValidationHook, CorrelationHook
)
from .errors.base import (
    ConnectorError,
    NetworkError,
    TimeoutError,
    AuthFailedError,
    RateLimitError,
    InvalidRequestError,
    ServerError,
    ParsingError,
    ValidationError,
    CancelledError,
    UnsupportedError
)
from .errors.codes import ErrorCode

__version__ = "0.1.0"
__author__ = "FiveOneFour"
__description__ = "Production-ready Shopify connector implementing the API Connector Specification"

__all__ = [
    # Main connector class
    "ShopifyConnector",
    
    # Configuration
    "ShopifyConnectorConfig",
    
    # Authentication
    "BaseAuth",
    "BearerAuth",
    
    # Transport
    "BaseTransport",
    "HTTPClient",
    "GraphQLTransport",
    
    # Resilience
    "RetryPolicy",
    "TokenBucketRateLimiter",
    "CircuitBreaker",
    "CircuitState",
    
    # Pagination
    "BasePagination",
    
    # Data Models
    "ShopifyBaseModel",
    "Product",
    "Order",
    "Customer",
    "Collection",
    "Shop",
    "Image",
    "Money",
    "get_model_for_resource",
    "validate_resource_data",
    
    # Hooks & Observability
    "BaseHook",
    "HookContext",
    "HookType",
    "HookPriority",
    "HookExecutionError",
    "HookManager",
    "LoggingHook",
    "MetricsHook",
    "TimingHook",
    "ValidationHook",
    "CorrelationHook",
    
    # Error classes
    "ConnectorError",
    "NetworkError",
    "TimeoutError",
    "AuthFailedError",
    "RateLimitError",
    "InvalidRequestError",
    "ServerError",
    "ParsingError",
    "ValidationError",
    "CancelledError",
    "UnsupportedError",
    
    # Error codes
    "ErrorCode",
]
