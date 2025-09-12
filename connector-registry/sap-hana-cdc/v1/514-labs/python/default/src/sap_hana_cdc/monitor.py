"""Monitoring and metrics for CDC pipeline."""

import asyncio
import time
from collections import defaultdict, deque
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional

import structlog

from .config import CDCConfig
from .models import BatchChange, ChangeEvent, ChangeType


logger = structlog.get_logger(__name__)


class CDCMonitor:
    """Monitors CDC pipeline performance and health."""
    
    def __init__(self, cdc_config: CDCConfig):
        """Initialize the monitor.
        
        Args:
            cdc_config: CDC configuration
        """
        self.config = cdc_config
        self.is_running = False
        
        # Metrics storage
        self.metrics = {
            "batches_processed": 0,
            "changes_processed": 0,
            "errors_count": 0,
            "start_time": datetime.utcnow(),
            "last_batch_time": None,
            "last_error_time": None,
            "last_error_message": None,
        }
        
        # Performance tracking
        self.batch_processing_times = deque(maxlen=100)
        self.change_processing_rates = deque(maxlen=100)
        self.error_counts_by_type = defaultdict(int)
        
        # Table-level metrics
        self.table_metrics = defaultdict(lambda: {
            "changes_processed": 0,
            "last_change_time": None,
            "change_types": defaultdict(int),
        })
        
        logger.info("CDC Monitor initialized")
    
    async def start(self) -> None:
        """Start the monitor."""
        if self.is_running:
            return
        
        self.is_running = True
        logger.info("CDC Monitor started")
    
    async def stop(self) -> None:
        """Stop the monitor."""
        self.is_running = False
        logger.info("CDC Monitor stopped")
    
    async def record_batch(self, batch: BatchChange) -> None:
        """Record metrics for a processed batch."""
        start_time = time.time()
        
        try:
            # Update batch metrics
            self.metrics["batches_processed"] += 1
            self.metrics["last_batch_time"] = datetime.utcnow()
            
            total_changes = batch.get_total_changes()
            self.metrics["changes_processed"] += total_changes
            
            # Record processing time
            processing_time = time.time() - start_time
            self.batch_processing_times.append(processing_time)
            
            # Calculate processing rate
            if processing_time > 0:
                rate = total_changes / processing_time
                self.change_processing_rates.append(rate)
            
            # Update table-level metrics
            for table_key, table_change in batch.table_changes.items():
                table_metrics = self.table_metrics[table_key]
                table_metrics["changes_processed"] += len(table_change.changes)
                table_metrics["last_change_time"] = datetime.utcnow()
                
                # Count change types
                for change in table_change.changes:
                    table_metrics["change_types"][change.change_type.value] += 1
            
            logger.debug(
                "Recorded batch metrics",
                batch_id=batch.batch_id,
                changes_count=total_changes,
                processing_time=processing_time,
            )
            
        except Exception as e:
            logger.error("Error recording batch metrics", error=str(e))
            await self.record_error("batch_metrics_error", str(e))
    
    async def record_error(self, error_type: str, error_message: str) -> None:
        """Record an error."""
        self.metrics["errors_count"] += 1
        self.metrics["last_error_time"] = datetime.utcnow()
        self.metrics["last_error_message"] = error_message
        self.error_counts_by_type[error_type] += 1
        
        logger.warning(
            "Recorded error",
            error_type=error_type,
            error_message=error_message,
            total_errors=self.metrics["errors_count"],
        )
    
    async def get_metrics(self) -> Dict[str, Any]:
        """Get current metrics."""
        uptime = datetime.utcnow() - self.metrics["start_time"]
        
        # Calculate averages
        avg_batch_processing_time = (
            sum(self.batch_processing_times) / len(self.batch_processing_times)
            if self.batch_processing_times else 0
        )
        
        avg_change_processing_rate = (
            sum(self.change_processing_rates) / len(self.change_processing_rates)
            if self.change_processing_rates else 0
        )
        
        # Calculate throughput
        total_changes = self.metrics["changes_processed"]
        total_batches = self.metrics["batches_processed"]
        changes_per_second = total_changes / uptime.total_seconds() if uptime.total_seconds() > 0 else 0
        batches_per_minute = (total_batches / uptime.total_seconds()) * 60 if uptime.total_seconds() > 0 else 0
        
        return {
            "pipeline": {
                "uptime_seconds": uptime.total_seconds(),
                "batches_processed": total_batches,
                "changes_processed": total_changes,
                "errors_count": self.metrics["errors_count"],
                "changes_per_second": changes_per_second,
                "batches_per_minute": batches_per_minute,
                "last_batch_time": self.metrics["last_batch_time"].isoformat() if self.metrics["last_batch_time"] else None,
                "last_error_time": self.metrics["last_error_time"].isoformat() if self.metrics["last_error_time"] else None,
                "last_error_message": self.metrics["last_error_message"],
            },
            "performance": {
                "avg_batch_processing_time_seconds": avg_batch_processing_time,
                "avg_change_processing_rate_per_second": avg_change_processing_rate,
                "recent_batch_processing_times": list(self.batch_processing_times)[-10:],
                "recent_change_processing_rates": list(self.change_processing_rates)[-10:],
            },
            "errors": {
                "total_errors": self.metrics["errors_count"],
                "errors_by_type": dict(self.error_counts_by_type),
            },
            "tables": {
                table_key: {
                    "changes_processed": metrics["changes_processed"],
                    "last_change_time": metrics["last_change_time"].isoformat() if metrics["last_change_time"] else None,
                    "change_types": dict(metrics["change_types"]),
                }
                for table_key, metrics in self.table_metrics.items()
            },
        }
    
    async def get_health_status(self) -> Dict[str, Any]:
        """Get health status."""
        uptime = datetime.utcnow() - self.metrics["start_time"]
        
        # Determine health status
        health_status = "healthy"
        issues = []
        
        # Check for recent errors
        if self.metrics["last_error_time"]:
            time_since_error = datetime.utcnow() - self.metrics["last_error_time"]
            if time_since_error < timedelta(minutes=5):
                health_status = "degraded"
                issues.append("Recent errors detected")
        
        # Check for processing delays
        if self.metrics["last_batch_time"]:
            time_since_batch = datetime.utcnow() - self.metrics["last_batch_time"]
            if time_since_batch > timedelta(minutes=10):
                health_status = "unhealthy"
                issues.append("No recent batch processing")
        
        # Check error rate
        if uptime.total_seconds() > 0:
            error_rate = self.metrics["errors_count"] / uptime.total_seconds()
            if error_rate > 0.1:  # More than 0.1 errors per second
                health_status = "degraded"
                issues.append("High error rate")
        
        return {
            "status": health_status,
            "uptime_seconds": uptime.total_seconds(),
            "issues": issues,
            "last_check": datetime.utcnow().isoformat(),
        }
    
    async def reset_metrics(self) -> None:
        """Reset all metrics."""
        self.metrics = {
            "batches_processed": 0,
            "changes_processed": 0,
            "errors_count": 0,
            "start_time": datetime.utcnow(),
            "last_batch_time": None,
            "last_error_time": None,
            "last_error_message": None,
        }
        
        self.batch_processing_times.clear()
        self.change_processing_rates.clear()
        self.error_counts_by_type.clear()
        self.table_metrics.clear()
        
        logger.info("Metrics reset")
