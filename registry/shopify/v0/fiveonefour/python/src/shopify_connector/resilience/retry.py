"""
Retry mechanism with exponential backoff and jitter for the Shopify connector.

This module implements a retry policy that follows the API Connector Specification
requirements for retry behavior, including exponential backoff and jitter.
"""

import random
import time
import logging
from typing import Any, Dict, Optional, Type, Union

from ..errors.base import (
    ConnectorError, NetworkError, TimeoutError, 
    RateLimitError, ServerError
)
from ..errors.codes import ErrorCode
from ..config.schema import RetryConfig


logger = logging.getLogger(__name__)


class RetryPolicy:
    """
    Retry policy implementation with exponential backoff and jitter.
    
    This class implements the retry mechanism as specified in the API
    Connector Specification, including:
    - Exponential backoff with configurable multiplier
    - Jitter to prevent thundering herd problems
    - Retry budget management
    - Configurable retry conditions
    """
    
    def __init__(self, config: RetryConfig):
        """
        Initialize retry policy with configuration.
        
        Args:
            config: Retry configuration from connector config
        """
        self.max_attempts = config.maxAttempts
        self.initial_delay = config.initialDelay
        self.max_delay = config.maxDelay
        self.backoff_multiplier = config.backoffMultiplier
        self.retry_budget_ms = config.retryBudgetMs
        self.jitter_factor = config.jitterFactor
        
        # Track retry budget usage
        self.used_budget_ms = 0
        self.start_time = time.time()
        
        logger.debug("Retry policy initialized", extra={
            'max_attempts': self.max_attempts,
            'initial_delay': self.initial_delay,
            'max_delay': self.max_delay,
            'backoff_multiplier': self.backoff_multiplier,
            'retry_budget_ms': self.retry_budget_ms,
            'jitter_factor': self.jitter_factor
        })
    
    def should_retry(self, error: Exception, attempt: int) -> bool:
        """
        Determine if request should be retried per API spec.
        
        Args:
            error: Exception that occurred
            attempt: Current attempt number (1-based)
        
        Returns:
            True if request should be retried, False otherwise
        """
        # Check attempt limit
        if attempt >= self.max_attempts:
            logger.debug("Max retry attempts reached", extra={
                'attempt': attempt,
                'max_attempts': self.max_attempts
            })
            return False
        
        # Check retry budget
        if self.used_budget_ms >= self.retry_budget_ms:
            logger.debug("Retry budget exhausted", extra={
                'used_budget_ms': self.used_budget_ms,
                'retry_budget_ms': self.retry_budget_ms
            })
            return False
        
        # Always retry network and timeout errors
        if isinstance(error, (NetworkError, TimeoutError)):
            logger.debug("Retrying network/timeout error", extra={
                'error_type': type(error).__name__,
                'attempt': attempt
            })
            return True
        
        # Check if error has status code and retry based on that
        if hasattr(error, 'status_code'):
            status_code = error.status_code
            
            # Retry on specific status codes per API spec
            retryable_statuses = [408, 425, 429, 500, 502, 503, 504]
            if status_code in retryable_statuses:
                logger.debug("Retrying based on status code", extra={
                    'status_code': status_code,
                    'attempt': attempt
                })
                return True
            
            # Don't retry client errors (4xx) except specific ones above
            if 400 <= status_code < 500:
                logger.debug("Not retrying client error", extra={
                    'status_code': status_code,
                    'attempt': attempt
                })
                return False
        
        # Check if error has error code
        if hasattr(error, 'code'):
            error_code = error.code
            
            # Retry on specific error codes
            retryable_codes = [
                ErrorCode.NETWORK_ERROR,
                ErrorCode.TIMEOUT,
                ErrorCode.RATE_LIMIT,
                ErrorCode.SERVER_ERROR
            ]
            
            if error_code in retryable_codes:
                logger.debug("Retrying based on error code", extra={
                    'error_code': error_code,
                    'attempt': attempt
                })
                return True
        
        # Default: don't retry
        logger.debug("Not retrying error", extra={
            'error_type': type(error).__name__,
            'attempt': attempt
        })
        return False
    
    def calculate_delay(self, attempt: int) -> int:
        """
        Calculate delay with exponential backoff + jitter per API spec.
        
        Args:
            attempt: Current attempt number (1-based)
        
        Returns:
            Delay in milliseconds
        """
        # Calculate base delay with exponential backoff
        base_delay = self.initial_delay * (self.backoff_multiplier ** (attempt - 1))
        
        # Cap at maximum delay
        base_delay = min(base_delay, self.max_delay)
        
        # Add jitter: random factor between jitter_factor and 1.0
        jitter = self.jitter_factor + (random.random() * (1.0 - self.jitter_factor))
        delay = int(base_delay * jitter)
        
        logger.debug("Calculated retry delay", extra={
            'attempt': attempt,
            'base_delay': base_delay,
            'jitter': jitter,
            'final_delay': delay
        })
        
        return delay
    
    def wait_before_retry(self, attempt: int) -> None:
        """
        Wait before retrying, respecting retry budget.
        
        Args:
            attempt: Current attempt number (1-based)
        """
        delay = self.calculate_delay(attempt)
        
        # Check if delay would exceed retry budget
        if self.used_budget_ms + delay > self.retry_budget_ms:
            remaining_budget = self.retry_budget_ms - self.used_budget_ms
            if remaining_budget > 0:
                delay = remaining_budget
                logger.debug("Adjusted delay to fit retry budget", extra={
                    'original_delay': self.calculate_delay(attempt),
                    'adjusted_delay': delay,
                    'remaining_budget': remaining_budget
                })
            else:
                logger.debug("No retry budget remaining, not waiting")
                return
        
        # Wait for the calculated delay
        logger.debug("Waiting before retry", extra={
            'attempt': attempt,
            'delay_ms': delay
        })
        
        time.sleep(delay / 1000.0)  # Convert to seconds
        
        # Update used budget
        self.used_budget_ms += delay
    
    def can_retry(self, attempt: int) -> bool:
        """
        Check if retry is possible based on attempt count and budget.
        
        Args:
            attempt: Current attempt number (1-based)
        
        Returns:
            True if retry is possible, False otherwise
        """
        if attempt >= self.max_attempts:
            return False
        
        if self.used_budget_ms >= self.retry_budget_ms:
            return False
        
        return True
    
    def get_retry_info(self) -> Dict[str, Any]:
        """
        Get retry policy information and statistics.
        
        Returns:
            Dictionary containing retry policy info
        """
        elapsed_time = time.time() - self.start_time
        
        return {
            'max_attempts': self.max_attempts,
            'initial_delay': self.initial_delay,
            'max_delay': self.max_delay,
            'backoff_multiplier': self.backoff_multiplier,
            'retry_budget_ms': self.retry_budget_ms,
            'used_budget_ms': self.used_budget_ms,
            'remaining_budget_ms': self.retry_budget_ms - self.used_budget_ms,
            'budget_usage_percent': (
                self.used_budget_ms / self.retry_budget_ms * 100 
                if self.retry_budget_ms > 0 else 0
            ),
            'elapsed_time_seconds': int(elapsed_time),
            'jitter_factor': self.jitter_factor
        }
    
    def reset_budget(self) -> None:
        """Reset the retry budget (useful for testing or long-running operations)."""
        self.used_budget_ms = 0
        self.start_time = time.time()
        logger.debug("Retry budget reset")
    
    def __repr__(self) -> str:
        """String representation of the retry policy."""
        return (f"RetryPolicy(max_attempts={self.max_attempts}, "
                f"budget={self.used_budget_ms}/{self.retry_budget_ms}ms)")
