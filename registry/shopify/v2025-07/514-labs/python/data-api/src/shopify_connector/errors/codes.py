"""
Standardized error codes for the Shopify connector.

These codes align with the API Connector Specification and provide
consistent error handling across the connector.
"""

from enum import Enum


class ErrorCode(str, Enum):
    """Standardized error codes from the API connector specification."""
    
    # Network and transport errors
    NETWORK_ERROR = "NETWORK_ERROR"
    TIMEOUT = "TIMEOUT"
    
    # Authentication and authorization errors
    AUTH_FAILED = "AUTH_FAILED"
    
    # Rate limiting errors
    RATE_LIMIT = "RATE_LIMIT"
    
    # Request and validation errors
    INVALID_REQUEST = "INVALID_REQUEST"
    VALIDATION_ERROR = "VALIDATION_ERROR"
    
    # Server and processing errors
    SERVER_ERROR = "SERVER_ERROR"
    PARSING_ERROR = "PARSING_ERROR"
    
    # Operation errors
    CANCELLED = "CANCELLED"
    UNSUPPORTED = "UNSUPPORTED"


# Mapping of HTTP status codes to error codes
HTTP_STATUS_TO_ERROR_CODE = {
    400: ErrorCode.INVALID_REQUEST,
    401: ErrorCode.AUTH_FAILED,
    403: ErrorCode.AUTH_FAILED,
    404: ErrorCode.INVALID_REQUEST,
    408: ErrorCode.TIMEOUT,
    409: ErrorCode.INVALID_REQUEST,
    422: ErrorCode.VALIDATION_ERROR,
    425: ErrorCode.TIMEOUT,
    429: ErrorCode.RATE_LIMIT,
    500: ErrorCode.SERVER_ERROR,
    502: ErrorCode.SERVER_ERROR,
    503: ErrorCode.SERVER_ERROR,
    504: ErrorCode.SERVER_ERROR,
}


def get_error_code_from_status(status_code: int) -> ErrorCode:
    """Get standardized error code from HTTP status code."""
    return HTTP_STATUS_TO_ERROR_CODE.get(status_code, ErrorCode.SERVER_ERROR)


def is_retryable_error_code(error_code: ErrorCode) -> bool:
    """Determine if an error code represents a retryable error."""
    retryable_codes = {
        ErrorCode.NETWORK_ERROR,
        ErrorCode.TIMEOUT,
        ErrorCode.RATE_LIMIT,
        ErrorCode.SERVER_ERROR,
    }
    return error_code in retryable_codes


def is_retryable_status_code(status_code: int) -> bool:
    """Determine if an HTTP status code represents a retryable error."""
    retryable_statuses = {408, 425, 429, 500, 502, 503, 504}
    return status_code in retryable_statuses
