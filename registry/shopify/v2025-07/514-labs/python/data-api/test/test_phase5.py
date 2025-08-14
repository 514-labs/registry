#!/usr/bin/env python3
"""
Test script for Phase 5 components (Hooks & Observability).

This script tests the hook system, built-in hooks, and
observability infrastructure for the Shopify connector.
"""

import sys
import os
import time
import logging

# Add src to path for local development
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from shopify_connector.hooks.base import (
    BaseHook, HookContext, HookType, HookPriority, HookExecutionError
)
from shopify_connector.hooks.manager import HookManager
from shopify_connector.hooks.builtin import (
    LoggingHook, MetricsHook, TimingHook, ValidationHook, CorrelationHook
)


def test_hook_base_interface():
    """Test base hook interface and types."""
    print("🔧 Testing Base Hook Interface")
    print("=" * 40)
    
    try:
        # Test hook priority enum
        print("✅ HookPriority enum working")
        print(f"   CRITICAL: {HookPriority.CRITICAL.value}")
        print(f"   HIGH: {HookPriority.HIGH.value}")
        print(f"   NORMAL: {HookPriority.NORMAL.value}")
        print(f"   LOW: {HookPriority.LOW.value}")
        print(f"   LOWEST: {HookPriority.LOWEST.value}")
        
        # Test hook type enum
        print("✅ HookType enum working")
        print(f"   BEFORE_REQUEST: {HookType.BEFORE_REQUEST.value}")
        print(f"   AFTER_RESPONSE: {HookType.AFTER_RESPONSE.value}")
        print(f"   ON_ERROR: {HookType.ON_ERROR.value}")
        print(f"   ON_RETRY: {HookType.ON_RETRY.value}")
        
        # Test hook context
        context = HookContext(
            hook_type=HookType.BEFORE_REQUEST,
            request_options={'method': 'GET', 'path': '/products'},
            metadata={'test': 'value'}
        )
        print("✅ HookContext working")
        print(f"   Type: {context.hook_type.value}")
        print(f"   Timestamp: {context.timestamp}")
        print(f"   Metadata: {context.metadata}")
        
        # Test hook context methods
        context.add_metadata('new_key', 'new_value')
        print(f"   Added metadata: {context.get_metadata('new_key')}")
        print(f"   Has metadata 'test': {context.has_metadata('test')}")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Base hook interface test failed: {e}")
        return False


def test_hook_manager():
    """Test hook manager functionality."""
    print("🎯 Testing Hook Manager")
    print("=" * 40)
    
    try:
        # Create hook manager
        manager = HookManager()
        print("✅ HookManager created successfully")
        
        # Test adding hooks
        test_hook = TestHook("test_hook", HookPriority.NORMAL)
        manager.add_hook(HookType.BEFORE_REQUEST, test_hook)
        print("✅ Hook added successfully")
        
        # Test duplicate hook prevention
        try:
            manager.add_hook(HookType.BEFORE_REQUEST, test_hook)
            print("❌ Should have prevented duplicate hook")
            return False
        except ValueError:
            print("✅ Duplicate hook prevention working")
        
        # Test hook retrieval
        hooks = manager.get_hooks(HookType.BEFORE_REQUEST)
        print(f"✅ Retrieved {len(hooks)} hooks")
        
        # Test hook execution
        context = HookContext(HookType.BEFORE_REQUEST, {'method': 'GET', 'path': '/test'})
        manager.execute_hooks(HookType.BEFORE_REQUEST, context)
        print("✅ Hook execution working")
        
        # Test hook statistics
        stats = manager.get_hook_stats()
        print("✅ Hook statistics working")
        print(f"   Total executions: {stats['total_executions']}")
        print(f"   Success rate: {stats['success_rate']:.1f}%")
        
        # Test hook removal
        removed = manager.remove_hook(HookType.BEFORE_REQUEST, "test_hook")
        print(f"✅ Hook removal working: {removed}")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Hook manager test failed: {e}")
        return False


def test_builtin_hooks():
    """Test built-in hooks functionality."""
    print("🏗️  Testing Built-in Hooks")
    print("=" * 40)
    
    try:
        # Test logging hook
        logging_hook = LoggingHook("test_logging", "DEBUG")
        print("✅ LoggingHook created successfully")
        print(f"   Priority: {logging_hook.priority.value}")
        print(f"   Enabled: {logging_hook.enabled}")
        
        # Test metrics hook
        metrics_hook = MetricsHook("test_metrics")
        print("✅ MetricsHook created successfully")
        
        # Test timing hook
        timing_hook = TimingHook("test_timing")
        print("✅ TimingHook created successfully")
        
        # Test validation hook
        validation_hook = ValidationHook("test_validation")
        print("✅ ValidationHook created successfully")
        
        # Test correlation hook
        correlation_hook = CorrelationHook("test_correlation")
        print("✅ CorrelationHook created successfully")
        
        # Test hook execution
        context = HookContext(
            HookType.BEFORE_REQUEST,
            {'method': 'GET', 'path': '/products'},
            metadata={'test': 'value'}
        )
        
        # Execute hooks
        logging_hook.execute(context)
        metrics_hook.execute(context)
        timing_hook.execute(context)
        validation_hook.execute(context)
        correlation_hook.execute(context)
        
        print("✅ All built-in hooks executed successfully")
        
        # Test metrics collection
        metrics = metrics_hook.get_metrics()
        print("✅ Metrics collection working")
        print(f"   Requests: {metrics['requests_total']}")
        print(f"   Endpoints: {metrics['endpoints']}")
        
        # Test timing stats
        timing_stats = timing_hook.get_timing_stats()
        print("✅ Timing stats working")
        print(f"   Active timings: {timing_stats['active_timings']}")
        
        # Test validation errors
        validation_errors = validation_hook.get_validation_errors()
        print("✅ Validation working")
        print(f"   Validation errors: {len(validation_errors)}")
        
        # Test correlation info
        correlation_info = correlation_hook.get_correlation_info(context)
        print("✅ Correlation working")
        print(f"   Correlation ID: {correlation_info['correlation_id']}")
        print(f"   Trace ID: {correlation_info['trace_id']}")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Built-in hooks test failed: {e}")
        return False


def test_hook_integration():
    """Test hook system integration."""
    print("🔗 Testing Hook Integration")
    print("=" * 40)
    
    try:
        # Create hook manager with built-in hooks
        manager = HookManager()
        
        # Add built-in hooks
        manager.add_hook(HookType.BEFORE_REQUEST, LoggingHook("logging"))
        manager.add_hook(HookType.BEFORE_REQUEST, MetricsHook("metrics"))
        manager.add_hook(HookType.BEFORE_REQUEST, TimingHook("timing"))
        manager.add_hook(HookType.BEFORE_REQUEST, ValidationHook("validation"))
        manager.add_hook(HookType.BEFORE_REQUEST, CorrelationHook("correlation"))
        
        manager.add_hook(HookType.AFTER_RESPONSE, LoggingHook("logging"))
        manager.add_hook(HookType.AFTER_RESPONSE, MetricsHook("metrics"))
        manager.add_hook(HookType.AFTER_RESPONSE, TimingHook("timing"))
        
        print("✅ Built-in hooks added to manager")
        
        # Test before request execution
        request_context = HookContext(
            HookType.BEFORE_REQUEST,
            {'method': 'GET', 'path': '/products', 'query': {'limit': 10}}
        )
        
        manager.execute_hooks(HookType.BEFORE_REQUEST, request_context)
        print("✅ Before request hooks executed")
        
        # Simulate response
        response_context = HookContext(
            HookType.AFTER_RESPONSE,
            {'method': 'GET', 'path': '/products'},
            {'status_code': 200, 'body': {'products': []}}
        )
        
        # Copy metadata from request context
        response_context.metadata.update(request_context.metadata)
        
        manager.execute_hooks(HookType.AFTER_RESPONSE, response_context)
        print("✅ After response hooks executed")
        
        # Test hook statistics
        stats = manager.get_hook_stats()
        print("✅ Integration statistics working")
        print(f"   Total executions: {stats['total_executions']}")
        print(f"   Success rate: {stats['success_rate']:.1f}%")
        
        # Test hook type statistics
        before_request_stats = stats['registered_hooks']['beforeRequest']
        after_response_stats = stats['registered_hooks']['afterResponse']
        print(f"   Before request hooks: {before_request_stats['count']}")
        print(f"   After response hooks: {after_response_stats['count']}")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Hook integration test failed: {e}")
        return False


def test_hook_priority_ordering():
    """Test hook priority ordering and execution."""
    print("📊 Testing Hook Priority Ordering")
    print("=" * 40)
    
    try:
        # Create hook manager
        manager = HookManager()
        
        # Create test hooks with different priorities
        critical_hook = TestHook("critical", HookPriority.CRITICAL)
        high_hook = TestHook("high", HookPriority.HIGH)
        normal_hook = TestHook("normal", HookPriority.NORMAL)
        low_hook = TestHook("low", HookPriority.LOW)
        
        # Add hooks in random order
        manager.add_hook(HookType.BEFORE_REQUEST, normal_hook)
        manager.add_hook(HookType.BEFORE_REQUEST, critical_hook)
        manager.add_hook(HookType.BEFORE_REQUEST, low_hook)
        manager.add_hook(HookType.BEFORE_REQUEST, high_hook)
        
        print("✅ Hooks added in random order")
        
        # Execute hooks
        context = HookContext(HookType.BEFORE_REQUEST, {'method': 'GET', 'path': '/test'})
        manager.execute_hooks(HookType.BEFORE_REQUEST, context)
        
        # Check execution order (should be by priority)
        expected_order = ['critical', 'high', 'normal', 'low']
        actual_order = [hook['name'] for hook in context.hook_execution_order]
        
        print("✅ Hook priority ordering working")
        print(f"   Expected order: {expected_order}")
        print(f"   Actual order: {actual_order}")
        
        if actual_order == expected_order:
            print("   ✅ Priority ordering correct")
        else:
            print("   ❌ Priority ordering incorrect")
            return False
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Hook priority ordering test failed: {e}")
        return False


def test_hook_error_handling():
    """Test hook error handling and recovery."""
    print("⚠️  Testing Hook Error Handling")
    print("=" * 40)
    
    try:
        # Create hook manager
        manager = HookManager()
        
        # Create hooks that will fail
        failing_hook = FailingHook("failing", HookPriority.LOW)
        critical_failing_hook = FailingHook("critical_failing", HookPriority.CRITICAL)
        
        # Add hooks
        manager.add_hook(HookType.BEFORE_REQUEST, failing_hook)
        manager.add_hook(HookType.BEFORE_REQUEST, critical_failing_hook)
        
        print("✅ Failing hooks added")
        
        # Test execution with low priority failing hook
        context = HookContext(HookType.BEFORE_REQUEST, {'method': 'GET', 'path': '/test'})
        
        try:
            manager.execute_hooks(HookType.BEFORE_REQUEST, context)
            print("✅ Low priority failing hook handled gracefully")
        except HookExecutionError:
            print("❌ Low priority failing hook should not raise exception")
            return False
        
        # Test execution with critical failing hook
        try:
            manager.execute_hooks(HookType.BEFORE_REQUEST, context)
            print("❌ Critical failing hook should raise exception")
            return False
        except HookExecutionError as e:
            print("✅ Critical failing hook properly raised exception")
            print(f"   Error: {e}")
        
        # Check statistics
        stats = manager.get_hook_stats()
        print("✅ Error handling statistics working")
        print(f"   Failed executions: {stats['failed_executions']}")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Hook error handling test failed: {e}")
        return False


class TestHook(BaseHook):
    """Test hook for testing purposes."""
    
    def __init__(self, name: str, priority: HookPriority = HookPriority.NORMAL):
        super().__init__(name, priority)
        self.execution_count = 0
    
    def execute(self, context: HookContext) -> None:
        """Execute test hook logic."""
        self.execution_count += 1
        context.metadata[f'hook_{self.name}_executed'] = True
        context.metadata[f'hook_{self.name}_count'] = self.execution_count


class FailingHook(BaseHook):
    """Hook that always fails for testing error handling."""
    
    def __init__(self, name: str, priority: HookPriority = HookPriority.NORMAL):
        super().__init__(name, priority)
    
    def execute(self, context: HookContext) -> None:
        """Execute failing hook logic."""
        raise Exception(f"Hook {self.name} intentionally failed for testing")


def main():
    """Run all Phase 5 tests."""
    print("🚀 Phase 5 Testing: Hooks & Observability")
    print("=" * 60)
    print()
    
    tests = [
        ("Base Hook Interface", test_hook_base_interface),
        ("Hook Manager", test_hook_manager),
        ("Built-in Hooks", test_builtin_hooks),
        ("Hook Integration", test_hook_integration),
        ("Hook Priority Ordering", test_hook_priority_ordering),
        ("Hook Error Handling", test_hook_error_handling),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
            else:
                print(f"❌ {test_name} test failed")
        except Exception as e:
            print(f"❌ {test_name} test crashed: {e}")
    
    print("=" * 60)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All Phase 5 tests passed! Ready for Phase 6.")
        return 0
    else:
        print("⚠️  Some tests failed. Check the implementation.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
