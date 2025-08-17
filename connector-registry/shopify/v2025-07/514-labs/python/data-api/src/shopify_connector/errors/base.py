"""
Base error classes for the Shopify connector.

All connector errors follow the standardized structure defined in the
API Connector Specification.
"""

from typing import Any, Dict, Optional
from .codes import ErrorCode


class ConnectorError(Exception):
    """
    Base error class for the Shopify connector.
    
    Follows the API Connector Specification error structure:
    - message: Human-readable error description
    - code: Machine-readable error code
    - statusCode: HTTP status code (if applicable)
    - details: Additional error context or data
    - retryable: Boolean indicating if the request can be retried
    - requestId: Correlation identifier if available
    - source: Subsystem where the error occurred
    """
    
    def __init__(
        self,
        code: ErrorCode,
        message: str,
        status_code: Optional[int] = None,
        details: Optional[Dict[str, Any]] = None,
        retryable: Optional[bool] = None,
        request_id: Optional[str] = None,
        source: Optional[str] = None,
    ):
        super().__init__(message)
        
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        self.retryable = retryable if retryable is not None else self._is_retryable_by_default()
        self.request_id = request_id
        self.source = source or "unknown"
    
    def _is_retryable_by_default(self) -> bool:
        """Determine if error is retryable by default based on error code."""
        from .codes import is_retryable_error_code
        return is_retryable_error_code(self.code)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert error to dictionary format for serialization."""
        return {
            "code": self.code.value,
            "message": self.message,
            "statusCode": self.status_code,
            "details": self.details,
            "retryable": self.retryable,
            "requestId": self.request_id,
            "source": self.source,
        }
    
    def __str__(self) -> str:
        """String representation of the error."""
        parts = [f"{self.code.value}: {self.message}"]
        
        if self.status_code:
            parts.append(f"Status: {self.status_code}")
        
        if self.request_id:
            parts.append(f"Request ID: {self.request_id}")
        
        if self.source != "unknown":
            parts.append(f"Source: {self.source}")
        
        if self.retryable is not None:
            parts.append(f"Retryable: {self.retryable}")
        
        return " | ".join(parts)
    
    def __repr__(self) -> str:
        """Detailed representation of the error."""
        return (
            f"{self.__class__.__name__}("
            f"code={self.code.value}, "
            f"message='{self.message}', "
            f"status_code={self.status_code}, "
            f"retryable={self.retryable}, "
            f"request_id='{self.request_id}', "
            f"source='{self.source}')"
        )


class NetworkError(ConnectorError):
    """Network connectivity issues."""
    
    def __init__(
        self,
        message: str = "Network connectivity issue",
        details: Optional[Dict[str, Any]] = None,
        request_id: Optional[str] = None,
    ):
        super().__init__(
            code=ErrorCode.NETWORK_ERROR,
            message=message,
            details=details,
            retryable=True,
            request_id=request_id,
            source="transport",
        )


class TimeoutError(ConnectorError):
    """Request exceeded timeout limit."""
    
    def __init__(
        self,
        message: str = "Request exceeded timeout limit",
        timeout_ms: Optional[int] = None,
        request_id: Optional[str] = None,
    ):
        details = {}
        if timeout_ms:
            details["timeout_ms"] = timeout_ms
        
        super().__init__(
            code=ErrorCode.TIMEOUT,
            message=message,
            details=details,
            retryable=True,
            request_id=request_id,
            source="transport",
        )


class AuthFailedError(ConnectorError):
    """Authentication or authorization failure."""
    
    def __init__(
        self,
        message: str = "Authentication or authorization failed",
        status_code: Optional[int] = None,
        details: Optional[Dict[str, Any]] = None,
        request_id: Optional[str] = None,
    ):
        super().__init__(
            code=ErrorCode.AUTH_FAILED,
            message=message,
            status_code=status_code,
            details=details,
            retryable=False,
            request_id=request_id,
            source="auth",
        )


class RateLimitError(ConnectorError):
    """Rate limit exceeded."""
    
    def __init__(
        self,
        message: str = "Rate limit exceeded",
        retry_after: Optional[int] = None,
        request_id: Optional[str] = None,
    ):
        details = {}
        if retry_after:
            details["retry_after"] = retry_after
        
        super().__init__(
            code=ErrorCode.RATE_LIMIT,
            message=message,
            status_code=429,
            details=details,
            retryable=True,
            request_id=request_id,
            source="rateLimit",
        )


class InvalidRequestError(ConnectorError):
    """Malformed or invalid request."""
    
    def __init__(
        self,
        message: str = "Invalid request",
        status_code: Optional[int] = None,
        details: Optional[Dict[str, Any]] = None,
        request_id: Optional[str] = None,
    ):
        super().__init__(
            code=ErrorCode.INVALID_REQUEST,
            message=message,
            status_code=status_code,
            details=details,
            retryable=False,
            request_id=request_id,
            source="validation",
        )


class ServerError(ConnectorError):
    """Server-side error."""
    
    def __init__(
        self,
        message: str = "Server error",
        status_code: Optional[int] = None,
        details: Optional[Dict[str, Any]] = None,
        request_id: Optional[str] = None,
    ):
        super().__init__(
            code=ErrorCode.SERVER_ERROR,
            message=message,
            status_code=status_code,
            details=details,
            retryable=True,
            request_id=request_id,
            source="server",
        )


class ParsingError(ConnectorError):
    """Failed to parse response."""
    
    def __init__(
        self,
        message: str = "Failed to parse response",
        details: Optional[Dict[str, Any]] = None,
        request_id: Optional[str] = None,
    ):
        super().__init__(
            code=ErrorCode.PARSING_ERROR,
            message=message,
            details=details,
            retryable=False,
            request_id=request_id,
            source="parsing",
        )


class ValidationError(ConnectorError):
    """Data validation failed."""
    
    def __init__(
        self,
        message: str = "Data validation failed",
        details: Optional[Dict[str, Any]] = None,
        request_id: Optional[str] = None,
    ):
        super().__init__(
            code=ErrorCode.VALIDATION_ERROR,
            message=message,
            details=details,
            retryable=False,
            request_id=request_id,
            source="validation",
        )


class CancelledError(ConnectorError):
    """Request was cancelled by caller."""
    
    def __init__(
        self,
        message: str = "Request was cancelled",
        request_id: Optional[str] = None,
    ):
        super().__init__(
            code=ErrorCode.CANCELLED,
            message=message,
            retryable=False,
            request_id=request_id,
            source="client",
        )


class UnsupportedError(ConnectorError):
    """Operation not supported by target API."""
    
    def __init__(
        self,
        message: str = "Operation not supported",
        details: Optional[Dict[str, Any]] = None,
        request_id: Optional[str] = None,
    ):
        super().__init__(
            code=ErrorCode.UNSUPPORTED,
            message=message,
            details=details,
            retryable=False,
            request_id=request_id,
            source="api",
        )


class ConnectionError(ConnectorError):
    """Connection establishment failure."""

    def __init__(
        self,
        message: str = "Failed to establish connection",
        details: Optional[Dict[str, Any]] = None,
        request_id: Optional[str] = None,
    ):
        super().__init__(
            code=ErrorCode.NETWORK_ERROR,
            message=message,
            details=details,
            retryable=True,
            request_id=request_id,
            source="connection",
        )


class PaginationError(ConnectorError):
    """Errors encountered during pagination."""

    def __init__(
        self,
        message: str = "Pagination failed",
        details: Optional[Dict[str, Any]] = None,
        request_id: Optional[str] = None,
    ):
        super().__init__(
            code=ErrorCode.INVALID_REQUEST,
            message=message,
            details=details,
            retryable=False,
            request_id=request_id,
            source="pagination",
        )
