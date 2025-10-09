"""Data models for SAP HANA CDC events."""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, Iterator, List, Optional

from enum import StrEnum, auto


class TriggerType(StrEnum):
    INSERT = auto()
    UPDATE = auto()
    DELETE = auto()


class TableStatus(StrEnum):
    NEW = auto()
    ACTIVE = auto()

@dataclass
class ChangeEvent:
    """Represents a single database change event."""
    
    # Event metadata
    event_id: str
    event_timestamp: datetime
    trigger_type: TriggerType
    transaction_id: str
    
    # Table information
    schema_name: str
    table_name: str
    full_table_name: str
    
    # Change data
    old_values: Optional[List[Dict[str, Any]]] = None
    new_values: Optional[List[Dict[str, Any]]] = None

    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for serialization."""
        return {
            "event_id": self.event_id,
            "event_timestamp": self.event_timestamp.isoformat(),
            "trigger_type": self.trigger_type.value,
            "transaction_id": self.transaction_id,
            "schema_name": self.schema_name,
            "table_name": self.table_name,
            "full_table_name": self.full_table_name,
            "old_values": self.old_values,
            "new_values": self.new_values,
        }

    def diff_values(self) -> Dict[str, Any]:
        """Get the diff values between the old and new values."""
        differences = []
        
        # Handle INSERT events - return only new values with empty old values
        if self.trigger_type == TriggerType.INSERT:
            if self.new_values:
                for key, value in self.new_values[0].items():
                    differences.append({
                        "key": key,
                        "old": None,
                        "new": value,
                    })
            return differences
        elif self.trigger_type == TriggerType.DELETE:
            if self.old_values:
                for key, value in self.old_values[0].items():
                    differences.append({
                        "key": key,
                        "old": value,
                        "new": None,
                    })
            return differences
        elif self.trigger_type == TriggerType.UPDATE:
            for key, value in self.old_values[0].items():
                if key in self.new_values[0] and value != self.new_values[0][key]:
                    differences.append({
                        "key": key,
                        "old": value,
                        "new": self.new_values[0][key],
                    })
            return differences

@dataclass
class BatchChange:
    """Represents a batch of changes across multiple tables."""
    
    changes: List[ChangeEvent]

    def add_change(self, change: ChangeEvent) -> None:
        """Add changes for a table."""
        self.changes.extend(change)
    

    def __len__(self) -> int:
        return self.get_total_changes()
    

    def __iter__(self) -> Iterator[ChangeEvent]:
        return iter(self.changes)

    def get_total_changes(self) -> int:
        """Get total number of changes in this batch."""
        return len(self.changes)
    
    def is_empty(self) -> bool:
        """Check if the batch is empty."""
        return len(self.changes) == 0

    def get_max_event_id(self) -> int:
        """Get the maximum event ID in this batch."""
        return max(change.event_id for change in self.changes)

    def get_newest_change_timestamp(self) -> datetime:
        """Get the timestamp of the newest change in this batch."""
        return max(change.event_timestamp for change in self.changes)

    def __str__(self) -> str:
        """Return a string representation of the batch."""
        return f"BatchChange(changes={len(self.changes)})"


@dataclass
class PruneResult:
    """Represents the result of a database pruning operation."""
    
    entries_deleted: int
    cutoff_timestamp: str  # ISO format timestamp
    
    def __str__(self) -> str:
        """Return a string representation of the prune result."""
        return f"PruneResult(entries_deleted={self.entries_deleted}, cutoff_timestamp={self.cutoff_timestamp})"