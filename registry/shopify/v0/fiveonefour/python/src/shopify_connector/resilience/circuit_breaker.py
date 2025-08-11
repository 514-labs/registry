"""
Circuit breaker pattern for the Shopify connector.

This module implements a circuit breaker that prevents cascading failures
by temporarily stopping requests when the failure rate exceeds a threshold.
"""

import time
import logging
from typing import Any, Dict, Optional, Callable
from enum import Enum

from ..errors.base import ConnectorError, NetworkError, ServerError
from ..config.schema import CircuitBreakerConfig


logger = logging.getLogger(__name__)


class CircuitState(Enum):
    """Circuit breaker states."""
    CLOSED = "closed"      # Normal operation
    OPEN = "open"          # Failing, reject requests
    HALF_OPEN = "half_open"  # Testing recovery


class CircuitBreaker:
    """
    Circuit breaker implementation for failure handling.
    
    The circuit breaker has three states:
    - CLOSED: Normal operation, requests pass through
    - OPEN: Failing, requests are rejected immediately
    - HALF_OPEN: Testing recovery, limited requests allowed
    """
    
    def __init__(self, config: CircuitBreakerConfig):
        """
        Initialize the circuit breaker.
        
        Args:
            config: Circuit breaker configuration
        """
        self.failure_threshold = config.failureThreshold
        self.recovery_timeout = config.recoveryTimeout
        self.minimum_requests = config.minimumRequests
        
        # State management
        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.success_count = 0
        self.last_failure_time = 0
        self.last_state_change = time.time()
        
        # Statistics
        self.total_requests = 0
        self.rejected_requests = 0
        self.state_changes = 0
        
        logger.debug("Circuit breaker initialized", extra={
            'failure_threshold': self.failure_threshold,
            'recovery_timeout': self.recovery_timeout,
            'minimum_requests': self.minimum_requests
        })
    
    def call(self, func: Callable, *args, **kwargs) -> Any:
        """
        Execute a function with circuit breaker protection.
        
        Args:
            func: Function to execute
            *args: Function arguments
            **kwargs: Function keyword arguments
        
        Returns:
            Function result
        
        Raises:
            ConnectorError: If circuit is open or function fails
        """
        self.total_requests += 1
        
        # Check if circuit is open
        if self.state == CircuitState.OPEN:
            if self._should_attempt_reset():
                self._set_state(CircuitState.HALF_OPEN)
                logger.info("Circuit breaker transitioning to HALF_OPEN")
            else:
                self.rejected_requests += 1
                raise ConnectorError(
                    "Circuit breaker is OPEN - requests rejected",
                    code="CIRCUIT_OPEN",
                    details={
                        'state': self.state.value,
                        'failure_count': self.failure_count,
                        'last_failure': self.last_failure_time
                    }
                )
        
        # Execute function
        try:
            result = func(*args, **kwargs)
            
            # Success - update circuit state
            self._on_success()
            return result
            
        except Exception as e:
            # Failure - update circuit state
            self._on_failure(e)
            raise
    
    def _should_attempt_reset(self) -> bool:
        """Check if enough time has passed to attempt reset."""
        if self.state != CircuitState.OPEN:
            return False
        
        time_since_failure = time.time() - self.last_failure_time
        return time_since_failure >= self.recovery_timeout
    
    def _on_success(self) -> None:
        """Handle successful request."""
        if self.state == CircuitState.HALF_OPEN:
            self.success_count += 1
            
            # If we have enough successful requests, close the circuit
            if self.success_count >= self.minimum_requests:
                self._set_state(CircuitState.CLOSED)
                logger.info("Circuit breaker closed - service recovered")
        
        # Reset failure count in closed state
        if self.state == CircuitState.CLOSED:
            self.failure_count = 0
    
    def _on_failure(self, error: Exception) -> None:
        """Handle failed request."""
        self.failure_count += 1
        self.last_failure_time = time.time()
        
        # Check if we should open the circuit
        if (self.state == CircuitState.CLOSED and 
            self.failure_count >= self.failure_threshold):
            self._set_state(CircuitState.OPEN)
            logger.warning("Circuit breaker opened - too many failures", extra={
                'failure_count': self.failure_count,
                'failure_threshold': self.failure_threshold,
                'error': str(error)
            })
        
        # In half-open state, any failure reopens the circuit
        elif self.state == CircuitState.HALF_OPEN:
            self._set_state(CircuitState.OPEN)
            logger.warning("Circuit breaker reopened - failure in HALF_OPEN state")
    
    def _set_state(self, new_state: CircuitState) -> None:
        """Change circuit state and update tracking."""
        if new_state != self.state:
            old_state = self.state
            self.state = new_state
            self.last_state_change = time.time()
            self.state_changes += 1
            
            # Reset counters based on new state
            if new_state == CircuitState.CLOSED:
                self.failure_count = 0
                self.success_count = 0
            elif new_state == CircuitState.HALF_OPEN:
                self.failure_count = 0
                self.success_count = 0
            
            logger.debug("Circuit breaker state changed", extra={
                'old_state': old_state.value,
                'new_state': new_state.value,
                'state_changes': self.state_changes
            })
    
    def is_open(self) -> bool:
        """Check if circuit is open."""
        return self.state == CircuitState.OPEN
    
    def is_closed(self) -> bool:
        """Check if circuit is closed."""
        return self.state == CircuitState.CLOSED
    
    def is_half_open(self) -> bool:
        """Check if circuit is half-open."""
        return self.state == CircuitState.HALF_OPEN
    
    def force_open(self) -> None:
        """Force the circuit to open (useful for testing or manual control)."""
        self._set_state(CircuitState.OPEN)
        logger.info("Circuit breaker forced open")
    
    def force_close(self) -> None:
        """Force the circuit to close (useful for testing or manual control)."""
        self._set_state(CircuitState.CLOSED)
        logger.info("Circuit breaker forced closed")
    
    def force_reset(self) -> None:
        """Force reset the circuit breaker (useful for testing)."""
        self._set_state(CircuitState.CLOSED)
        self.failure_count = 0
        self.success_count = 0
        self.last_failure_time = 0
        logger.info("Circuit breaker force reset")
    
    def get_stats(self) -> Dict[str, Any]:
        """
        Get circuit breaker statistics.
        
        Returns:
            Dictionary containing circuit breaker statistics
        """
        current_time = time.time()
        
        return {
            'state': self.state.value,
            'failure_threshold': self.failure_threshold,
            'recovery_timeout': self.recovery_timeout,
            'minimum_requests': self.minimum_requests,
            'failure_count': self.failure_count,
            'success_count': self.success_count,
            'total_requests': self.total_requests,
            'rejected_requests': self.rejected_requests,
            'state_changes': self.state_changes,
            'last_failure_time': self.last_failure_time,
            'last_state_change': self.last_state_change,
            'time_since_failure': current_time - self.last_failure_time,
            'time_since_state_change': current_time - self.last_state_change,
            'failure_rate': (
                self.failure_count / max(self.total_requests, 1) * 100
            ),
            'rejection_rate': (
                self.rejected_requests / max(self.total_requests, 1) * 100
            )
        }
    
    def __repr__(self) -> str:
        """String representation of the circuit breaker."""
        return (f"CircuitBreaker(state={self.state.value}, "
                f"failures={self.failure_count}/{self.failure_threshold})")
