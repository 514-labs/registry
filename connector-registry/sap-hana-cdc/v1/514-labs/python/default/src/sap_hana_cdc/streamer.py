"""Base streamer class for CDC events."""

from abc import ABC, abstractmethod
from typing import Dict, Any

from .models import BatchChange


class BaseStreamer(ABC):
    """Base class for streaming CDC events to various destinations."""
    
    def __init__(self, config: Dict[str, Any]):
        """Initialize the base streamer.
        
        Args:
            config: Streamer-specific configuration
        """
        self.config = config
        self.is_connected = False
    
    @abstractmethod
    async def connect(self) -> None:
        """Connect to the streaming destination.
        
        Raises:
            ConnectionError: If connection fails
        """
        pass
    
    @abstractmethod
    async def disconnect(self) -> None:
        """Disconnect from the streaming destination."""
        pass
    
    @abstractmethod
    async def send_batch(self, batch: BatchChange) -> None:
        """Send a batch of changes to the streaming destination.
        
        Args:
            batch: Batch of changes to send
            
        Raises:
            StreamingError: If sending fails
        """
        pass
    
    async def health_check(self) -> Dict[str, Any]:
        """Check the health status of the streamer.
        
        Returns:
            Dictionary containing health status information
        """
        return {
            "is_connected": self.is_connected,
            "streamer_type": self.__class__.__name__,
            "config": self.config
        }
