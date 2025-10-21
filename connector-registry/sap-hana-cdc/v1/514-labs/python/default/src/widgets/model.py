from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

class ChangeEventWidget(BaseModel):
    """Widget model for displaying change events."""
    
    event_id: str = Field(..., description="Unique event identifier")
    table_name: str = Field(..., description="Name of the changed table")
    change_type: str = Field(..., description="Type of change (INSERT/UPDATE/DELETE)")
    timestamp: str = Field(..., description="When the change occurred")
    transaction_id: str = Field(..., description="Database transaction ID")
    
    # Summary fields for display
    summary: str = Field(..., description="Human-readable summary of the change")
    has_old_values: bool = Field(False, description="Whether old values are present")
    has_new_values: bool = Field(False, description="Whether new values are present")
    
    # Optional detailed data
    old_values: Optional[Dict[str, Any]] = Field(None, description="Previous values")
    new_values: Optional[Dict[str, Any]] = Field(None, description="New values")
    
    class Config:
        json_encoders = {
            # Add any custom encoders if needed
        }

class ChangeEventListWidget(BaseModel):
    """Widget model for displaying lists of change events."""
    
    events: List[ChangeEventWidget] = Field(default_factory=list)
    total_count: int = Field(0, description="Total number of events")
    has_more: bool = Field(False, description="Whether more events are available")
    
    # Filtering and pagination info
    filters: Dict[str, Any] = Field(default_factory=dict)
    page_size: int = Field(100, description="Number of events per page")
    current_page: int = Field(1, description="Current page number")

class TableMonitorWidget(BaseModel):
    """Widget model for displaying table monitoring status."""
    
    table_name: str = Field(..., description="Name of the monitored table")
    is_monitored: bool = Field(False, description="Whether the table is being monitored")
    change_count: int = Field(0, description="Number of changes captured")
    last_change: Optional[str] = Field(None, description="Timestamp of last change")
    
    # CDC configuration
    change_types: List[str] = Field(default_factory=list, description="Types of changes being monitored")
    triggers_active: bool = Field(False, description="Whether CDC triggers are active")

class ConnectionStatusWidget(BaseModel):
    """Widget model for displaying connection status."""
    
    is_connected: bool = Field(False, description="Whether connected to database")
    host: str = Field("", description="Database host")
    port: int = Field(0, description="Database port")
    schema: str = Field("", description="Database schema")
    
    # Connection health
    last_ping: Optional[str] = Field(None, description="Last successful ping")
    connection_uptime: Optional[str] = Field(None, description="How long connected")
    error_message: Optional[str] = Field(None, description="Last error message if any")
