"""
Base hook interface for the Shopify connector.

This module defines the abstract base class that all hooks
must implement to work with the connector's hook system.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from enum import Enum


class HookPriority(Enum):
    """Hook execution priority levels."""
    
    CRITICAL = 0      # Critical hooks (e.g., security, logging)
    HIGH = 10         # High priority hooks (e.g., metrics, validation)
    NORMAL = 50       # Normal priority hooks (e.g., transformation)
    LOW = 100         # Low priority hooks (e.g., monitoring, debugging)
    LOWEST = 1000     # Lowest priority hooks (e.g., analytics)


class HookType(Enum):
    """Types of hooks supported by the connector."""
    
    BEFORE_REQUEST = "beforeRequest"
    AFTER_RESPONSE = "afterResponse"
    ON_ERROR = "onError"
    ON_RETRY = "onRetry"
    BEFORE_PAGINATION = "beforePagination"
    AFTER_PAGINATION = "afterPagination"


class HookContext:
    """Context object passed to hooks during execution."""
    
    def __init__(
        self,
        hook_type: HookType,
        request_options: Optional[Dict[str, Any]] = None,
        response: Optional[Dict[str, Any]] = None,
        error: Optional[Exception] = None,
        metadata: Optional[Dict[str, Any]] = None
    ):
        """
        Initialize hook context.
        
        Args:
            hook_type: Type of hook being executed
            request_options: Request options (for beforeRequest hooks)
            response: Response data (for afterResponse hooks)
            error: Error information (for onError hooks)
            metadata: Additional metadata for the hook
        """
        self.hook_type = hook_type
        self.request_options = request_options or {}
        self.response = response or {}
        self.error = error
        self.metadata = metadata or {}
        self.timestamp = self._get_timestamp()
        self.hook_execution_order = []
        
    def _get_timestamp(self) -> str:
        """Get current timestamp in ISO format."""
        from datetime import datetime
        return datetime.utcnow().isoformat()
    
    def add_metadata(self, key: str, value: Any) -> None:
        """Add metadata to the context."""
        self.metadata[key] = value
    
    def get_metadata(self, key: str, default: Any = None) -> Any:
        """Get metadata from the context."""
        return self.metadata.get(key, default)
    
    def has_metadata(self, key: str) -> bool:
        """Check if metadata key exists."""
        return key in self.metadata
    
    def __repr__(self) -> str:
        """String representation of the hook context."""
        return (f"HookContext(type={self.hook_type.value}, "
                f"timestamp={self.timestamp}, "
                f"metadata_keys={list(self.metadata.keys())})")


class BaseHook(ABC):
    """
    Abstract base class for all hooks.
    
    All hooks must inherit from this class and implement
    the required methods for integration with the connector.
    """
    
    def __init__(self, name: str, priority: HookPriority = HookPriority.NORMAL):
        """
        Initialize hook.
        
        Args:
            name: Unique name for the hook
            priority: Execution priority (lower numbers execute first)
        """
        self.name = name
        self.priority = priority
        self.enabled = True
        self.execution_count = 0
        self.last_execution = None
        self.error_count = 0
        
    @abstractmethod
    def execute(self, context: HookContext) -> None:
        """
        Execute the hook logic.
        
        Args:
            context: Hook context containing request/response data
        
        Raises:
            HookExecutionError: If hook execution fails
        """
        pass
    
    def should_execute(self, context: HookContext) -> bool:
        """
        Determine if the hook should execute.
        
        Args:
            context: Hook context
        
        Returns:
            True if hook should execute, False otherwise
        """
        return self.enabled
    
    def on_success(self, context: HookContext) -> None:
        """
        Called when hook executes successfully.
        
        Args:
            context: Hook context
        """
        self.execution_count += 1
        self.last_execution = context.timestamp
    
    def on_error(self, context: HookContext, error: Exception) -> None:
        """
        Called when hook execution fails.
        
        Args:
            context: Hook context
            error: Exception that occurred
        """
        self.error_count += 1
        self.last_execution = context.timestamp
    
    def get_stats(self) -> Dict[str, Any]:
        """
        Get hook execution statistics.
        
        Returns:
            Dictionary containing hook statistics
        """
        return {
            'name': self.name,
            'priority': self.priority.value,
            'enabled': self.enabled,
            'execution_count': self.execution_count,
            'error_count': self.error_count,
            'last_execution': self.last_execution,
            'success_rate': (
                (self.execution_count - self.error_count) / self.execution_count * 100
                if self.execution_count > 0 else 0
            )
        }
    
    def enable(self) -> None:
        """Enable the hook."""
        self.enabled = True
    
    def disable(self) -> None:
        """Disable the hook."""
        self.enabled = False
    
    def __repr__(self) -> str:
        """String representation of the hook."""
        return (f"{self.__class__.__name__}(name='{self.name}', "
                f"priority={self.priority.value}, enabled={self.enabled})")
    
    def __lt__(self, other: 'BaseHook') -> bool:
        """Compare hooks by priority for sorting."""
        if not isinstance(other, BaseHook):
            return NotImplemented
        return self.priority.value < other.priority.value


class HookExecutionError(Exception):
    """Exception raised when hook execution fails."""
    
    def __init__(self, hook_name: str, message: str, original_error: Optional[Exception] = None):
        """
        Initialize hook execution error.
        
        Args:
            hook_name: Name of the hook that failed
            message: Error message
            original_error: Original exception that caused the failure
        """
        super().__init__(f"Hook '{hook_name}' failed: {message}")
        self.hook_name = hook_name
        self.message = message
        self.original_error = original_error
    
    def __repr__(self) -> str:
        """String representation of the error."""
        return (f"HookExecutionError(hook_name='{self.hook_name}', "
                f"message='{self.message}')")
