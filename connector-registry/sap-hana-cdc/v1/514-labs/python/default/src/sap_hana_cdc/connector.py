"""Main SAP HANA CDC connector implementation."""

import asyncio
import logging
import uuid
from datetime import datetime
from typing import AsyncGenerator, Dict, List, Optional, Set

import structlog
from tenacity import retry, stop_after_attempt, wait_exponential

from .config import CDCConfig, ChangeType, PipelineConfig, SAPHanaConfig
from .models import BatchChange, CDCState, ChangeEvent, TableChange
from .extractor import SAPHanaExtractor
from .streamer import BaseStreamer
from .monitor import CDCMonitor


logger = structlog.get_logger(__name__)


class SAPHanaCDCConnector:
    """Main SAP HANA CDC connector class."""
    
    def __init__(self, config: PipelineConfig, streamer: BaseStreamer):
        """Initialize the CDC connector.
        
        Args:
            config: Complete pipeline configuration
            streamer: Custom streamer implementation (required)
        """
        self.config = config
        self.state = CDCState()
        self.is_running = False
        
        # Initialize components
        self.extractor = SAPHanaExtractor(config.sap_hana, config.cdc)
        self.streamer = streamer
        self.monitor = CDCMonitor(config.cdc) if config.cdc.enable_metrics else None
        
        # Setup logging
        self._setup_logging()
        
        logger.info(
            "SAP HANA CDC Connector initialized",
            pipeline_id=config.pipeline_id,
            version=config.version,
            tables=config.cdc.tables,
        )
        
        # Log the logging configuration for verification
        logger.debug(
            "Logging configuration applied",
            log_level=self.config.cdc.log_level,
            log_format=self.config.cdc.log_format
        )
    
    def _setup_logging(self) -> None:
        """Setup structured logging."""
        # Set the Python logging level first
        log_level = getattr(logging, self.config.cdc.log_level.upper(), logging.INFO)
        logging.basicConfig(level=log_level)
        
        structlog.configure(
            processors=[
                structlog.stdlib.filter_by_level,
                structlog.stdlib.add_logger_name,
                structlog.stdlib.add_log_level,
                structlog.stdlib.PositionalArgumentsFormatter(),
                structlog.processors.TimeStamper(fmt="iso"),
                structlog.processors.StackInfoRenderer(),
                structlog.processors.format_exc_info,
                structlog.processors.UnicodeDecoder(),
                structlog.processors.JSONRenderer() if self.config.cdc.log_format == "json" 
                else structlog.dev.ConsoleRenderer(),
            ],
            context_class=dict,
            logger_factory=structlog.stdlib.LoggerFactory(),
            wrapper_class=structlog.stdlib.BoundLogger,
            cache_logger_on_first_use=True,
        )
    
    async def start(self) -> None:
        """Start the CDC connector."""
        if self.is_running:
            logger.warning("CDC connector is already running")
            return
        
        logger.info("Starting SAP HANA CDC connector")
        
        try:
            # Connect to database
            await self.extractor.connect()
            await self.streamer.connect()
            
            # Initialize CDC infrastructure
            await self.extractor.init_cdc()
            
            if self.monitor:
                await self.monitor.start()
            
            self.is_running = True
            
            # Start CDC processing
            await self._run_cdc_loop()
            
        except Exception as e:
            logger.error("Failed to start CDC connector", error=str(e))
            await self.stop()
            raise
    
    async def stop(self) -> None:
        """Stop the CDC connector."""
        if not self.is_running:
            return
        
        logger.info("Stopping SAP HANA CDC connector")
        self.is_running = False
        
        try:
            if self.monitor:
                await self.monitor.stop()
            
            await self.streamer.disconnect()
            await self.extractor.disconnect()
            
        except Exception as e:
            logger.error("Error during shutdown", error=str(e))
    
    async def _run_cdc_loop(self) -> None:
        """Main CDC processing loop."""
        logger.info("Starting CDC processing loop")
        
        while self.is_running:
            try:
                # Poll for changese
                batch = await self._poll_changes()
                
                if not batch.is_empty():
                    # Process and stream changes
                    await self._process_batch(batch)
                    self.state.update_processed(batch)
                    
                    logger.info(
                        "Processed batch",
                        total_changes=batch.get_total_changes(),
                    )
                
                # Wait before next poll
                await asyncio.sleep(self.config.cdc.poll_interval_ms / 1000.0)
                
            except Exception as e:
                logger.error("Error in CDC loop", error=str(e))
                self.state.record_error(str(e))
                
                # Wait before retry
                await asyncio.sleep(self.config.cdc.retry_delay_ms / 1000.0)
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10)
    )
    async def _poll_changes(self) -> BatchChange:
        # Get changes from extractor
        changes = await self.extractor.get_changes(
            since=self.state.last_processed_timestamp,
            limit=self.config.cdc.batch_size,
        )
        
        # Group changes by table
        return BatchChange(changes)
        
    
    async def _process_batch(self, batch: BatchChange) -> None:
        """Process a batch of changes."""
        # Stream changes
        await self.streamer.send_batch(batch)
        
        # Update metrics
        if self.monitor:
            await self.monitor.record_batch(batch)
    
    async def get_health_status(self) -> Dict[str, any]:
        """Get health status of the connector."""
        return {
            "status": "healthy" if self.is_running else "stopped",
            "is_running": self.is_running,
            "state": {
                "last_processed_timestamp": self.state.last_processed_timestamp.isoformat() 
                if self.state.last_processed_timestamp else None,
                "processed_batches": self.state.processed_batches,
                "processed_changes": self.state.processed_changes,
                "last_error": self.state.last_error,
                "last_error_timestamp": self.state.last_error_timestamp.isoformat() 
                if self.state.last_error_timestamp else None,
            },
            "components": {
                "extractor": await self.extractor.get_health_status(),
                "streamer": await self.streamer.get_health_status(),
                "monitor": await self.monitor.get_health_status() if self.monitor else None,
            },
        }
    
    async def get_metrics(self) -> Dict[str, any]:
        """Get performance metrics."""
        if not self.monitor:
            return {"error": "Metrics not enabled"}
        
        return await self.monitor.get_metrics()
    
    async def reinitialize_cdc(self) -> None:
        """Re-initialize CDC infrastructure to detect configuration changes.
        
        This method should be called when the table configuration has changed
        and you want to update the CDC infrastructure accordingly.
        """
        if self.is_running:
            logger.warning("Cannot reinitialize CDC while connector is running. Stop first.")
            return
        
        logger.info("Re-initializing CDC infrastructure for configuration changes")
        
        try:
            # Re-initialize CDC infrastructure with current configuration
            await self.extractor.connect()
            await self.extractor.init_cdc(force_recreate=True)
            
            logger.info(
                "CDC infrastructure re-initialized",
                monitored_tables=list(self.extractor.monitored_tables),
            )
            
        except Exception as e:
            logger.error("Failed to re-initialize CDC infrastructure", error=str(e))
            raise
