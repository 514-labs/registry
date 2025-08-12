"""
Hook manager for the Shopify connector.

This module manages the registration, execution, and lifecycle
of hooks in the connector system.
"""

import logging
from typing import Any, Dict, List, Optional, Type
from collections import defaultdict

from .base import BaseHook, HookContext, HookType, HookExecutionError


logger = logging.getLogger(__name__)


class HookManager:
    """
    Manages hook registration, execution, and lifecycle.
    
    This class provides a centralized way to manage hooks
    across the connector system with proper priority ordering
    and error handling.
    """
    
    def __init__(self):
        """Initialize the hook manager."""
        self.hooks: Dict[HookType, List[BaseHook]] = defaultdict(list)
        self.global_hooks: List[BaseHook] = []
        self.execution_stats = {
            'total_executions': 0,
            'successful_executions': 0,
            'failed_executions': 0,
            'hook_type_stats': defaultdict(lambda: {
                'executions': 0,
                'successes': 0,
                'failures': 0
            })
        }
        
        logger.debug("Hook manager initialized")
    
    def add_hook(self, hook_type: HookType, hook: BaseHook) -> None:
        """
        Add a hook to the specified type.
        
        Args:
            hook_type: Type of hook to add
            hook: Hook instance to add
        
        Raises:
            ValueError: If hook name already exists for this type
        """
        # Check for duplicate names
        existing_names = [h.name for h in self.hooks[hook_type]]
        if hook.name in existing_names:
            raise ValueError(f"Hook with name '{hook.name}' already exists for type {hook_type.value}")
        
        # Add hook and sort by priority
        self.hooks[hook_type].append(hook)
        self.hooks[hook_type].sort(key=lambda h: h.priority.value)
        
        logger.debug(f"Added hook '{hook.name}' to {hook_type.value} (priority: {hook.priority.value})")
    
    def add_global_hook(self, hook: BaseHook) -> None:
        """
        Add a global hook that executes for all hook types.
        
        Args:
            hook: Hook instance to add
        
        Raises:
            ValueError: If hook name already exists
        """
        existing_names = [h.name for h in self.global_hooks]
        if hook.name in existing_names:
            raise ValueError(f"Global hook with name '{hook.name}' already exists")
        
        self.global_hooks.append(hook)
        self.global_hooks.sort(key=lambda h: h.priority.value)
        
        logger.debug(f"Added global hook '{hook.name}' (priority: {hook.priority.value})")
    
    def remove_hook(self, hook_type: HookType, hook_name: str) -> bool:
        """
        Remove a hook by name from the specified type.
        
        Args:
            hook_type: Type of hook to remove from
            hook_name: Name of the hook to remove
        
        Returns:
            True if hook was removed, False if not found
        """
        hooks = self.hooks[hook_type]
        for i, hook in enumerate(hooks):
            if hook.name == hook_name:
                removed_hook = hooks.pop(i)
                logger.debug(f"Removed hook '{removed_hook.name}' from {hook_type.value}")
                return True
        
        return False
    
    def remove_global_hook(self, hook_name: str) -> bool:
        """
        Remove a global hook by name.
        
        Args:
            hook_name: Name of the hook to remove
        
        Returns:
            True if hook was removed, False if not found
        """
        for i, hook in enumerate(self.global_hooks):
            if hook.name == hook_name:
                removed_hook = self.global_hooks.pop(i)
                logger.debug(f"Removed global hook '{removed_hook.name}'")
                return True
        
        return False
    
    def get_hooks(self, hook_type: HookType) -> List[BaseHook]:
        """
        Get all hooks for a specific type.
        
        Args:
            hook_type: Type of hooks to retrieve
        
        Returns:
            List of hooks sorted by priority
        """
        return self.hooks[hook_type].copy()
    
    def get_hook(self, hook_type: HookType, hook_name: str) -> Optional[BaseHook]:
        """
        Get a specific hook by name and type.
        
        Args:
            hook_type: Type of hook to retrieve
            hook_name: Name of the hook to retrieve
        
        Returns:
            Hook instance or None if not found
        """
        for hook in self.hooks[hook_type]:
            if hook.name == hook_name:
                return hook
        return None
    
    def execute_hooks(self, hook_type: HookType, context: HookContext) -> None:
        """
        Execute all hooks for a specific type.
        
        Args:
            hook_type: Type of hooks to execute
            context: Context object for the hook execution
        
        Raises:
            HookExecutionError: If any hook fails (depending on configuration)
        """
        # Get hooks for this type
        hooks = self.hooks[hook_type]
        
        # Add global hooks
        all_hooks = self.global_hooks + hooks
        
        if not all_hooks:
            logger.debug(f"No hooks registered for {hook_type.value}")
            return
        
        logger.debug(f"Executing {len(all_hooks)} hooks for {hook_type.value}")
        
        # Execute hooks in priority order
        for hook in all_hooks:
            if not hook.should_execute(context):
                logger.debug(f"Skipping disabled hook '{hook.name}'")
                continue
            
            try:
                # Execute the hook
                hook.execute(context)
                
                # Record success
                hook.on_success(context)
                self._record_execution(hook_type, True)
                
                # Add to execution order
                context.hook_execution_order.append({
                    'name': hook.name,
                    'priority': hook.priority.value,
                    'status': 'success',
                    'timestamp': context.timestamp
                })
                
                logger.debug(f"Hook '{hook.name}' executed successfully")
                
            except Exception as e:
                # Record failure
                hook.on_error(context, e)
                self._record_execution(hook_type, False)
                
                # Add to execution order
                context.hook_execution_order.append({
                    'name': hook.name,
                    'priority': hook.priority.value,
                    'status': 'failed',
                    'error': str(e),
                    'timestamp': context.timestamp
                })
                
                logger.error(f"Hook '{hook.name}' failed: {e}")
                
                # Raise error if hook is critical
                if hook.priority.value <= 10:  # CRITICAL or HIGH priority
                    raise HookExecutionError(hook.name, str(e), e)
    
    def _record_execution(self, hook_type: HookType, success: bool) -> None:
        """Record hook execution statistics."""
        self.execution_stats['total_executions'] += 1
        
        if success:
            self.execution_stats['successful_executions'] += 1
            self.execution_stats['hook_type_stats'][hook_type.value]['successes'] += 1
        else:
            self.execution_stats['failed_executions'] += 1
            self.execution_stats['hook_type_stats'][hook_type.value]['failures'] += 1
        
        self.execution_stats['hook_type_stats'][hook_type.value]['executions'] += 1
    
    def get_hook_stats(self) -> Dict[str, Any]:
        """
        Get comprehensive hook execution statistics.
        
        Returns:
            Dictionary containing hook statistics
        """
        stats = {
            'total_executions': self.execution_stats['total_executions'],
            'successful_executions': self.execution_stats['successful_executions'],
            'failed_executions': self.execution_stats['failed_executions'],
            'success_rate': (
                self.execution_stats['successful_executions'] / 
                self.execution_stats['total_executions'] * 100
                if self.execution_stats['total_executions'] > 0 else 0
            ),
            'hook_type_stats': dict(self.execution_stats['hook_type_stats']),
            'registered_hooks': {}
        }
        
        # Add per-type hook statistics
        for hook_type in HookType:
            hooks = self.hooks[hook_type]
            stats['registered_hooks'][hook_type.value] = {
                'count': len(hooks),
                'hooks': [hook.get_stats() for hook in hooks]
            }
        
        # Add global hook statistics
        stats['registered_hooks']['global'] = {
            'count': len(self.global_hooks),
            'hooks': [hook.get_stats() for hook in self.global_hooks]
        }
        
        return stats
    
    def clear_hooks(self, hook_type: Optional[HookType] = None) -> None:
        """
        Clear all hooks or hooks of a specific type.
        
        Args:
            hook_type: Type of hooks to clear, or None to clear all
        """
        if hook_type is None:
            # Clear all hooks
            self.hooks.clear()
            self.global_hooks.clear()
            logger.info("All hooks cleared")
        else:
            # Clear specific hook type
            count = len(self.hooks[hook_type])
            self.hooks[hook_type].clear()
            logger.info(f"Cleared {count} hooks for {hook_type.value}")
    
    def enable_hooks(self, hook_type: Optional[HookType] = None, hook_name: Optional[str] = None) -> None:
        """
        Enable hooks by type and/or name.
        
        Args:
            hook_type: Type of hooks to enable, or None for all types
            hook_name: Name of specific hook to enable, or None for all
        """
        if hook_type is None:
            # Enable all hooks
            for hooks in self.hooks.values():
                for hook in hooks:
                    hook.enable()
            for hook in self.global_hooks:
                hook.enable()
            logger.info("All hooks enabled")
        elif hook_name is None:
            # Enable all hooks of specific type
            for hook in self.hooks[hook_type]:
                hook.enable()
            logger.info(f"All {hook_type.value} hooks enabled")
        else:
            # Enable specific hook
            hook = self.get_hook(hook_type, hook_name)
            if hook:
                hook.enable()
                logger.info(f"Hook '{hook_name}' enabled")
    
    def disable_hooks(self, hook_type: Optional[HookType] = None, hook_name: Optional[str] = None) -> None:
        """
        Disable hooks by type and/or name.
        
        Args:
            hook_type: Type of hooks to disable, or None for all types
            hook_name: Name of specific hook to disable, or None for all
        """
        if hook_type is None:
            # Disable all hooks
            for hooks in self.hooks.values():
                for hook in hooks:
                    hook.disable()
            for hook in self.global_hooks:
                hook.disable()
            logger.info("All hooks disabled")
        elif hook_name is None:
            # Disable all hooks of specific type
            for hook in self.hooks[hook_type]:
                hook.disable()
            logger.info(f"All {hook_type.value} hooks disabled")
        else:
            # Disable specific hook
            hook = self.get_hook(hook_type, hook_name)
            if hook:
                hook.disable()
                logger.info(f"Hook '{hook_name}' disabled")
    
    def __repr__(self) -> str:
        """String representation of the hook manager."""
        total_hooks = sum(len(hooks) for hooks in self.hooks.values()) + len(self.global_hooks)
        return f"HookManager(total_hooks={total_hooks}, types={list(self.hooks.keys())})"
