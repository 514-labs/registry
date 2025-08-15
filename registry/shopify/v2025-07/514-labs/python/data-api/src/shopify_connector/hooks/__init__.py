"""
Hooks package for the Shopify connector.

This package provides the hook system for extending connector
behavior with custom logic and observability.
"""

from .base import (
    BaseHook, HookContext, HookType, HookPriority, HookExecutionError
)
from .manager import HookManager
from .builtin import (
    LoggingHook, MetricsHook, TimingHook, ValidationHook, CorrelationHook
)

__all__ = [
    # Base classes and types
    'BaseHook',
    'HookContext', 
    'HookType',
    'HookPriority',
    'HookExecutionError',
    
    # Hook management
    'HookManager',
    
    # Built-in hooks
    'LoggingHook',
    'MetricsHook',
    'TimingHook',
    'ValidationHook',
    'CorrelationHook',
]
