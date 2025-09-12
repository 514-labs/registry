"""Data models for SAP HANA CDC events."""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, List, Optional, Union
from enum import Enum

from .config import ChangeType


@dataclass
class ChangeEvent:
    """Represents a single database change event."""
    
    # Event metadata
    event_id: str
    event_timestamp: datetime
    change_type: ChangeType
    
    # Table information
    schema_name: str
    table_name: str
    full_table_name: str
    
    # Change data
    old_values: Optional[Dict[str, Any]] = None
    new_values: Optional[Dict[str, Any]] = None
    primary_key_values: Optional[Dict[str, Any]] = None
    
    # Additional metadata
    transaction_id: Optional[str] = None
    sequence_number: Optional[int] = None
    source_timestamp: Optional[datetime] = None
    
    # Pipeline metadata
    pipeline_id: str = "sap-hana-cdc"
    version: str = "1.0.0"
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for serialization."""
        return {
            "event_id": self.event_id,
            "event_timestamp": self.event_timestamp.isoformat(),
            "change_type": self.change_type.value,
            "schema_name": self.schema_name,
            "table_name": self.table_name,
            "full_table_name": self.full_table_name,
            "old_values": self.old_values,
            "new_values": self.new_values,
            "primary_key_values": self.primary_key_values,
            "transaction_id": self.transaction_id,
            "sequence_number": self.sequence_number,
            "source_timestamp": self.source_timestamp.isoformat() if self.source_timestamp else None,
            "pipeline_id": self.pipeline_id,
            "version": self.version,
        }


@dataclass
class TableChange:
    """Represents changes for a specific table."""
    
    schema_name: str
    table_name: str
    changes: List[ChangeEvent] = field(default_factory=list)
    
    def add_change(self, change: ChangeEvent) -> None:
        """Add a change event to this table."""
        self.changes.append(change)
    
    def get_changes_by_type(self, change_type: ChangeType) -> List[ChangeEvent]:
        """Get all changes of a specific type."""
        return [c for c in self.changes if c.change_type == change_type]
    
    def is_empty(self) -> bool:
        """Check if there are any changes."""
        return len(self.changes) == 0


@dataclass
class BatchChange:
    """Represents a batch of changes across multiple tables."""
    
    batch_id: str
    batch_timestamp: datetime
    table_changes: Dict[str, TableChange] = field(default_factory=dict)
    
    def add_table_change(self, table_change: TableChange) -> None:
        """Add changes for a table."""
        key = f"{table_change.schema_name}.{table_change.table_name}"
        self.table_changes[key] = table_change
    
    def get_total_changes(self) -> int:
        """Get total number of changes in this batch."""
        return sum(len(tc.changes) for tc in self.table_changes.values())
    
    def is_empty(self) -> bool:
        """Check if the batch is empty."""
        return all(tc.is_empty() for tc in self.table_changes.values())


@dataclass
class CDCState:
    """Represents the current state of CDC processing."""
    
    last_processed_timestamp: Optional[datetime] = None
    last_sequence_number: Optional[int] = None
    processed_batches: int = 0
    processed_changes: int = 0
    last_error: Optional[str] = None
    last_error_timestamp: Optional[datetime] = None
    
    def update_processed(self, batch: BatchChange) -> None:
        """Update state after processing a batch."""
        self.processed_batches += 1
        self.processed_changes += batch.get_total_changes()
        
        if batch.table_changes:
            # Update to the latest timestamp in the batch
            latest_timestamp = max(
                change.event_timestamp 
                for table_change in batch.table_changes.values()
                for change in table_change.changes
            )
            self.last_processed_timestamp = latest_timestamp
    
    def record_error(self, error: str) -> None:
        """Record an error."""
        self.last_error = error
        self.last_error_timestamp = datetime.utcnow()
