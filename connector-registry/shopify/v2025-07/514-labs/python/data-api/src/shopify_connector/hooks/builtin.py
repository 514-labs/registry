"""
Built-in hooks for the Shopify connector.

This module provides pre-built hooks for common functionality
such as logging, metrics collection, and observability.
"""

import logging
import time
import uuid
from typing import Any, Dict, Optional, List
from datetime import datetime

from .base import BaseHook, HookContext, HookType, HookPriority


class LoggingHook(BaseHook):
    """
    Built-in hook for comprehensive request/response logging.
    
    This hook logs all requests, responses, and errors with
    structured logging for easy analysis and debugging.
    """
    
    def __init__(self, name: str = "logging", log_level: str = "INFO"):
        """
        Initialize logging hook.
        
        Args:
            name: Hook name
            log_level: Logging level (DEBUG, INFO, WARNING, ERROR)
        """
        super().__init__(name, HookPriority.CRITICAL)
        self.log_level = getattr(logging, log_level.upper(), logging.INFO)
        self.logger = logging.getLogger(f"shopify_connector.hooks.{name}")
        
    def execute(self, context: HookContext) -> None:
        """Execute logging logic based on hook type."""
        if context.hook_type == HookType.BEFORE_REQUEST:
            self._log_request(context)
        elif context.hook_type == HookType.AFTER_RESPONSE:
            self._log_response(context)
        elif context.hook_type == HookType.ON_ERROR:
            self._log_error(context)
        elif context.hook_type == HookType.ON_RETRY:
            self._log_retry(context)
    
    def _log_request(self, context: HookContext) -> None:
        """Log request details."""
        request_options = context.request_options
        method = request_options.get('method', 'UNKNOWN')
        path = request_options.get('path', 'UNKNOWN')
        
        # Generate request ID if not present
        if 'request_id' not in context.metadata:
            context.metadata['request_id'] = str(uuid.uuid4())
        
        request_id = context.metadata['request_id']
        
        self.logger.log(
            self.log_level,
            "Request started",
            extra={
                'request_id': request_id,
                'method': method,
                'path': path,
                'hook_type': context.hook_type.value,
                'timestamp': context.timestamp,
                'query': request_options.get('query', {}),
                'headers': self._sanitize_headers(request_options.get('headers', {}))
            }
        )
    
    def _log_response(self, context: HookContext) -> None:
        """Log response details."""
        response = context.response
        request_id = context.metadata.get('request_id', 'unknown')
        status_code = response.get('status_code', 0)
        
        # Calculate duration if start time is available
        duration = None
        if 'start_time' in context.metadata:
            start_time = context.metadata['start_time']
            duration = (time.time() - start_time) * 1000  # Convert to milliseconds
        
        self.logger.log(
            self.log_level,
            "Request completed",
            extra={
                'request_id': request_id,
                'status_code': status_code,
                'duration_ms': duration,
                'hook_type': context.hook_type.value,
                'timestamp': context.timestamp,
                'response_size': len(str(response.get('body', '')))
            }
        )
    
    def _log_error(self, context: HookContext) -> None:
        """Log error details."""
        error = context.error
        request_id = context.metadata.get('request_id', 'unknown')
        
        self.logger.error(
            "Request failed",
            extra={
                'request_id': request_id,
                'error_type': type(error).__name__,
                'error_message': str(error),
                'hook_type': context.hook_type.value,
                'timestamp': context.timestamp
            },
            exc_info=True
        )
    
    def _log_retry(self, context: HookContext) -> None:
        """Log retry details."""
        request_id = context.metadata.get('request_id', 'unknown')
        retry_count = context.metadata.get('retry_count', 0)
        
        self.logger.warning(
            "Request retry",
            extra={
                'request_id': request_id,
                'retry_count': retry_count,
                'hook_type': context.hook_type.value,
                'timestamp': context.timestamp
            }
        )
    
    def _sanitize_headers(self, headers: Dict[str, str]) -> Dict[str, str]:
        """Remove sensitive information from headers."""
        sensitive_keys = ['authorization', 'x-shopify-access-token', 'cookie']
        sanitized = headers.copy()
        
        for key in sensitive_keys:
            if key.lower() in sanitized:
                sanitized[key.lower()] = '[REDACTED]'
        
        return sanitized


class MetricsHook(BaseHook):
    """
    Built-in hook for metrics collection.
    
    This hook collects various metrics about requests, responses,
    and errors for monitoring and alerting purposes.
    """
    
    def __init__(self, name: str = "metrics"):
        """Initialize metrics hook."""
        super().__init__(name, HookPriority.HIGH)
        self.metrics = {
            'requests_total': 0,
            'responses_total': 0,
            'errors_total': 0,
            'retries_total': 0,
            'request_durations': [],
            'status_codes': {},
            'endpoints': {}
        }
    
    def execute(self, context: HookContext) -> None:
        """Execute metrics collection logic."""
        if context.hook_type == HookType.BEFORE_REQUEST:
            self._record_request_start(context)
        elif context.hook_type == HookType.AFTER_RESPONSE:
            self._record_response(context)
        elif context.hook_type == HookType.ON_ERROR:
            self._record_error(context)
        elif context.hook_type == HookType.ON_RETRY:
            self._record_retry(context)
    
    def _record_request_start(self, context: HookContext) -> None:
        """Record request start metrics."""
        self.metrics['requests_total'] += 1
        
        # Record endpoint usage
        path = context.request_options.get('path', 'unknown')
        self.metrics['endpoints'][path] = self.metrics['endpoints'].get(path, 0) + 1
        
        # Record start time for duration calculation
        context.metadata['start_time'] = time.time()
    
    def _record_response(self, context: HookContext) -> None:
        """Record response metrics."""
        self.metrics['responses_total'] += 1
        
        response = context.response
        status_code = response.get('status_code', 0)
        
        # Record status code
        self.metrics['status_codes'][status_code] = self.metrics['status_codes'].get(status_code, 0) + 1
        
        # Record duration
        if 'start_time' in context.metadata:
            duration = time.time() - context.metadata['start_time']
            self.metrics['request_durations'].append(duration)
            
            # Keep only last 1000 durations to prevent memory issues
            if len(self.metrics['request_durations']) > 1000:
                self.metrics['request_durations'] = self.metrics['request_durations'][-1000:]
    
    def _record_error(self, context: HookContext) -> None:
        """Record error metrics."""
        self.metrics['errors_total'] += 1
    
    def _record_retry(self, context: HookContext) -> None:
        """Record retry metrics."""
        self.metrics['retries_total'] += 1
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get collected metrics."""
        metrics = self.metrics.copy()
        
        # Calculate derived metrics
        if metrics['request_durations']:
            metrics['avg_duration'] = sum(metrics['request_durations']) / len(metrics['request_durations'])
            metrics['min_duration'] = min(metrics['request_durations'])
            metrics['max_duration'] = max(metrics['request_durations'])
            metrics['p95_duration'] = sorted(metrics['request_durations'])[int(len(metrics['request_durations']) * 0.95)]
        else:
            metrics['avg_duration'] = 0
            metrics['min_duration'] = 0
            metrics['max_duration'] = 0
            metrics['p95_duration'] = 0
        
        # Calculate success rate
        if metrics['requests_total'] > 0:
            metrics['success_rate'] = (
                (metrics['responses_total'] - metrics['errors_total']) / 
                metrics['requests_total'] * 100
            )
        else:
            metrics['success_rate'] = 0
        
        return metrics
    
    def reset_metrics(self) -> None:
        """Reset all metrics to zero."""
        self.metrics = {
            'requests_total': 0,
            'responses_total': 0,
            'errors_total': 0,
            'retries_total': 0,
            'request_durations': [],
            'status_codes': {},
            'endpoints': {}
        }


class TimingHook(BaseHook):
    """
    Built-in hook for request timing and performance monitoring.
    
    This hook measures request duration and provides timing
    information for performance analysis.
    """
    
    def __init__(self, name: str = "timing"):
        """Initialize timing hook."""
        super().__init__(name, HookPriority.HIGH)
        self.timings = {}
    
    def execute(self, context: HookContext) -> None:
        """Execute timing logic."""
        if context.hook_type == HookType.BEFORE_REQUEST:
            self._start_timing(context)
        elif context.hook_type == HookType.AFTER_RESPONSE:
            self._end_timing(context)
    
    def _start_timing(self, context: HookContext) -> None:
        """Start timing for a request."""
        request_id = context.metadata.get('request_id', str(uuid.uuid4()))
        context.metadata['request_id'] = request_id
        
        self.timings[request_id] = {
            'start_time': time.time(),
            'path': context.request_options.get('path', 'unknown'),
            'method': context.request_options.get('method', 'unknown')
        }
    
    def _end_timing(self, context: HookContext) -> None:
        """End timing for a request."""
        request_id = context.metadata.get('request_id')
        if not request_id or request_id not in self.timings:
            return
        
        end_time = time.time()
        timing_info = self.timings[request_id]
        duration = (end_time - timing_info['start_time']) * 1000  # Convert to milliseconds
        
        # Add timing information to context
        context.metadata['duration_ms'] = duration
        context.metadata['timing_info'] = {
            'start_time': timing_info['start_time'],
            'end_time': end_time,
            'duration_ms': duration
        }
        
        # Clean up timing data
        del self.timings[request_id]
    
    def get_timing_stats(self) -> Dict[str, Any]:
        """Get timing statistics."""
        if not self.timings:
            return {'active_timings': 0}
        
        return {
            'active_timings': len(self.timings),
            'timing_details': self.timings
        }


class ValidationHook(BaseHook):
    """
    Built-in hook for request and response validation.
    
    This hook validates request options and response data
    to ensure data integrity and catch issues early.
    """
    
    def __init__(self, name: str = "validation"):
        """Initialize validation hook."""
        super().__init__(name, HookPriority.HIGH)
        self.validation_errors = []
    
    def execute(self, context: HookContext) -> None:
        """Execute validation logic."""
        if context.hook_type == HookType.BEFORE_REQUEST:
            self._validate_request(context)
        elif context.hook_type == HookType.AFTER_RESPONSE:
            self._validate_response(context)
    
    def _validate_request(self, context: HookContext) -> None:
        """Validate request options."""
        request_options = context.request_options
        
        # Check required fields
        required_fields = ['method', 'path']
        for field in required_fields:
            if field not in request_options:
                error = f"Missing required field: {field}"
                self.validation_errors.append(error)
                context.metadata[f'validation_error_{field}'] = error
        
        # Validate method
        if 'method' in request_options:
            method = request_options['method'].upper()
            valid_methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
            if method not in valid_methods:
                error = f"Invalid HTTP method: {method}"
                self.validation_errors.append(error)
                context.metadata['validation_error_method'] = error
        
        # Validate path
        if 'path' in request_options:
            path = request_options['path']
            if not path.startswith('/'):
                error = f"Invalid path format: {path}"
                self.validation_errors.append(error)
                context.metadata['validation_error_path'] = error
    
    def _validate_response(self, context: HookContext) -> None:
        """Validate response data."""
        response = context.response
        
        # Check required response fields
        required_fields = ['status_code']
        for field in required_fields:
            if field not in response:
                error = f"Missing required response field: {field}"
                self.validation_errors.append(error)
                context.metadata[f'validation_error_response_{field}'] = error
        
        # Validate status code
        if 'status_code' in response:
            status_code = response['status_code']
            if not isinstance(status_code, int) or status_code < 100 or status_code > 599:
                error = f"Invalid status code: {status_code}"
                self.validation_errors.append(error)
                context.metadata['validation_error_status_code'] = error
    
    def get_validation_errors(self) -> List[str]:
        """Get all validation errors."""
        return self.validation_errors.copy()
    
    def clear_validation_errors(self) -> None:
        """Clear validation errors."""
        self.validation_errors.clear()


class CorrelationHook(BaseHook):
    """
    Built-in hook for request correlation and tracing.
    
    This hook adds correlation IDs and tracing information
    to requests for distributed tracing support.
    """
    
    def __init__(self, name: str = "correlation"):
        """Initialize correlation hook."""
        super().__init__(name, HookPriority.CRITICAL)
    
    def execute(self, context: HookContext) -> None:
        """Execute correlation logic."""
        if context.hook_type == HookType.BEFORE_REQUEST:
            self._add_correlation_info(context)
    
    def _add_correlation_info(self, context: HookContext) -> None:
        """Add correlation information to request."""
        # Generate correlation ID if not present
        if 'correlation_id' not in context.metadata:
            context.metadata['correlation_id'] = str(uuid.uuid4())
        
        # Generate trace ID if not present
        if 'trace_id' not in context.metadata:
            context.metadata['trace_id'] = str(uuid.uuid4())
        
        # Add correlation headers to request
        headers = context.request_options.get('headers', {})
        headers['X-Correlation-ID'] = context.metadata['correlation_id']
        headers['X-Trace-ID'] = context.metadata['trace_id']
        headers['X-Request-ID'] = context.metadata.get('request_id', str(uuid.uuid4()))
        
        context.request_options['headers'] = headers
        
        # Add timestamp for request start
        context.metadata['request_start'] = datetime.utcnow().isoformat()
    
    def get_correlation_info(self, context: HookContext) -> Dict[str, str]:
        """Get correlation information from context."""
        return {
            'correlation_id': context.metadata.get('correlation_id', ''),
            'trace_id': context.metadata.get('trace_id', ''),
            'request_id': context.metadata.get('request_id', ''),
            'request_start': context.metadata.get('request_start', '')
        }
