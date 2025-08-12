"""
Token bucket rate limiter for the Shopify connector.

This module implements a rate limiter that respects Shopify's rate limiting
characteristics, including adaptive behavior from response headers and
Retry-After hints.
"""

import time
import logging
from typing import Any, Dict, Optional

from ..errors.base import RateLimitError
from ..config.schema import RateLimitConfig


logger = logging.getLogger(__name__)


class TokenBucketRateLimiter:
    """
    Token bucket rate limiter tuned for Shopify's rate limiting.
    
    Shopify uses a leaky bucket rate limiting system with:
    - 40 tokens per bucket
    - 2 tokens per second refill rate
    - X-Shopify-Shop-Api-Call-Limit header for current usage
    - Retry-After header for explicit wait times
    """
    
    def __init__(self, config: RateLimitConfig):
        """
        Initialize the rate limiter.
        
        Args:
            config: Rate limiting configuration
        """
        # Use configured burst capacity as token bucket size (default 40)
        self.max_tokens = float(config.burstCapacity)
        # Use configured steady requests per second as refill rate (default 2 rps)
        self.refill_rate = float(config.requestsPerSecond)
        self.burst_size = int(config.burstCapacity)
        
        # Current token count and last refill time
        self.tokens = self.max_tokens
        self.last_refill = time.time()
        
        # Adaptive rate limiting from Shopify headers
        self.adaptive_tokens = self.max_tokens
        self.adaptive_refill_rate = self.refill_rate
        
        # Retry-After tracking
        self.retry_after_until = 0
        
        # Statistics
        self.total_requests = 0
        self.rate_limited_requests = 0
        self.total_wait_time = 0
        
        logger.debug("Rate limiter initialized", extra={
            'max_tokens': self.max_tokens,
            'refill_rate': self.refill_rate,
            'burst_size': self.burst_size
        })
    
    def _refill_tokens(self) -> None:
        """Refill tokens based on time elapsed since last refill."""
        now = time.time()
        time_elapsed = now - self.last_refill
        
        if time_elapsed > 0:
            # Calculate tokens to add
            tokens_to_add = time_elapsed * self.adaptive_refill_rate
            
            # Add tokens, but don't exceed max
            self.tokens = min(self.max_tokens, self.tokens + tokens_to_add)
            self.last_refill = now
            
            logger.debug("Tokens refilled", extra={
                'tokens_added': tokens_to_add,
                'current_tokens': self.tokens,
                'time_elapsed': time_elapsed
            })
    
    def wait_for_slot(self, timeout_ms: Optional[int] = None) -> None:
        """
        Wait for a rate limit slot to become available.
        
        Args:
            timeout_ms: Maximum time to wait in milliseconds
        
        Raises:
            RateLimitError: If timeout is exceeded
        """
        start_time = time.time()
        timeout_seconds = timeout_ms / 1000.0 if timeout_ms else None
        
        while True:
            # Check if we need to wait for Retry-After
            if time.time() < self.retry_after_until:
                wait_time = self.retry_after_until - time.time()
                logger.debug("Waiting for Retry-After", extra={
                    'wait_time_seconds': wait_time
                })
                
                if timeout_seconds and wait_time > timeout_seconds:
                    raise RateLimitError(
                        "Rate limit Retry-After timeout exceeded",
                        retry_after_seconds=int(wait_time)
                    )
                
                time.sleep(min(wait_time, 1.0))  # Sleep in 1-second chunks
                continue
            
            # Refill tokens
            self._refill_tokens()
            
            # Check if we have tokens available
            if self.tokens >= 1:
                self.tokens -= 1
                self.total_requests += 1
                
                logger.debug("Rate limit slot acquired", extra={
                    'tokens_remaining': self.tokens,
                    'total_requests': self.total_requests
                })
                return
            
            # Calculate wait time for next token
            wait_time = (1.0 - self.tokens) / self.adaptive_refill_rate
            
            # Check timeout
            if timeout_seconds:
                elapsed = time.time() - start_time
                if elapsed + wait_time > timeout_seconds:
                    raise RateLimitError(
                        "Rate limit timeout exceeded",
                        wait_time_seconds=wait_time,
                        timeout_seconds=timeout_seconds
                    )
            
            # Wait for next token
            logger.debug("Waiting for rate limit slot", extra={
                'wait_time_seconds': wait_time,
                'tokens_remaining': self.tokens
            })
            
            time.sleep(wait_time)
            self.total_wait_time += wait_time
    
    def update_from_headers(self, headers: Dict[str, str]) -> None:
        """
        Update rate limiting based on Shopify response headers.
        
        Args:
            headers: Response headers from Shopify API
        """
        # Parse X-Shopify-Shop-Api-Call-Limit header
        rate_limit_header = headers.get('X-Shopify-Shop-Api-Call-Limit')
        if rate_limit_header:
            try:
                used, limit = rate_limit_header.split('/')
                used = int(used)
                limit = int(limit)
                
                # Update adaptive tokens based on current usage
                self.adaptive_tokens = limit
                self.adaptive_refill_rate = limit / 20.0  # Assume 20-second window
                
                logger.debug("Rate limit updated from headers", extra={
                    'used': used,
                    'limit': limit,
                    'adaptive_tokens': self.adaptive_tokens,
                    'adaptive_refill_rate': self.adaptive_refill_rate
                })
                
            except (ValueError, IndexError) as e:
                logger.warning("Failed to parse rate limit header", extra={
                    'header': rate_limit_header,
                    'error': str(e)
                })
        
        # Parse Retry-After header
        retry_after = headers.get('Retry-After')
        if retry_after:
            try:
                retry_seconds = int(retry_after)
                self.retry_after_until = time.time() + retry_seconds
                
                logger.debug("Retry-After header received", extra={
                    'retry_after_seconds': retry_seconds,
                    'retry_until': self.retry_after_until
                })
                
            except ValueError as e:
                logger.warning("Failed to parse Retry-After header", extra={
                    'header': retry_after,
                    'error': str(e)
                })
    
    def acquire_slot(self, timeout_ms: Optional[int] = None) -> bool:
        """
        Try to acquire a rate limit slot without waiting.
        
        Args:
            timeout_ms: Maximum time to wait in milliseconds
        
        Returns:
            True if slot was acquired immediately, False if waiting is required
        """
        # Check if we need to wait for Retry-After
        if time.time() < self.retry_after_until:
            return False
        
        # Refill tokens
        self._refill_tokens()
        
        # Check if we have tokens available
        if self.tokens >= 1:
            self.tokens -= 1
            self.total_requests += 1
            
            logger.debug("Rate limit slot acquired immediately", extra={
                'tokens_remaining': self.tokens,
                'total_requests': self.total_requests
            })
            return True
        
        return False
    
    def get_stats(self) -> Dict[str, Any]:
        """
        Get rate limiter statistics.
        
        Returns:
            Dictionary containing rate limiter statistics
        """
        return {
            'max_tokens': self.max_tokens,
            'current_tokens': self.tokens,
            'refill_rate': self.refill_rate,
            'adaptive_tokens': self.adaptive_tokens,
            'adaptive_refill_rate': self.adaptive_refill_rate,
            'total_requests': self.total_requests,
            'rate_limited_requests': self.rate_limited_requests,
            'total_wait_time': self.total_wait_time,
            'retry_after_active': time.time() < self.retry_after_until,
            'retry_after_until': self.retry_after_until,
            'utilization_percent': (
                (self.max_tokens - self.tokens) / self.max_tokens * 100
                if self.max_tokens > 0 else 0
            )
        }
    
    def reset(self) -> None:
        """Reset the rate limiter state (useful for testing)."""
        self.tokens = self.max_tokens
        self.last_refill = time.time()
        self.adaptive_tokens = self.max_tokens
        self.adaptive_refill_rate = self.refill_rate
        self.retry_after_until = 0
        self.total_requests = 0
        self.rate_limited_requests = 0
        self.total_wait_time = 0
        
        logger.debug("Rate limiter reset")
    
    def __repr__(self) -> str:
        """String representation of the rate limiter."""
        return (f"TokenBucketRateLimiter(tokens={self.tokens:.1f}/{self.max_tokens}, "
                f"requests={self.total_requests})")
