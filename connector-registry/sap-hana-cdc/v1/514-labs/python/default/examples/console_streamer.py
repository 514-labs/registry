"""Console streamer implementation for testing and debugging CDC events."""

import json
from typing import Dict, Any
from datetime import datetime
import sys
import os
import asyncio

# Add the src/sap_hana_cdc directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src')))
print("sys.path:", "\n".join(sys.path))


from sap_hana_cdc.streamer import BaseStreamer
from sap_hana_cdc.models import BatchChange
from sap_hana_cdc.connector import SAPHanaCDCConnector
from sap_hana_cdc.config import CDCConfig, SAPHanaConfig, PipelineConfig

import argparse
import os

class StreamingError(Exception):
    """Exception raised when streaming operations fail."""
    pass


class ConsoleStreamer(BaseStreamer):
    """A streamer that prints CDC events to the console for testing and debugging."""
    
    def __init__(self, config: Dict[str, Any]):
        """Initialize the console streamer.
        
        Args:
            config: Configuration dictionary. Supported options:
                - pretty_print: Whether to pretty print JSON (default: True)
                - show_metadata: Whether to show batch metadata (default: True)
                - timestamp_format: Format for timestamps (default: "%Y-%m-%d %H:%M:%S")
        """
        super().__init__(config)
        self.pretty_print = config.get("pretty_print", True)
        self.show_metadata = config.get("show_metadata", True)
        self.timestamp_format = config.get("timestamp_format", "%Y-%m-%d %H:%M:%S")
    
    async def connect(self) -> None:
        """Connect to the console streamer.
        
        This is a no-op for console streaming, but we set the connection status.
        """
        self.is_connected = True
        print("🔗 ConsoleStreamer connected - ready to receive events")
    
    async def disconnect(self) -> None:
        """Disconnect from the console streamer.
        
        This is a no-op for console streaming, but we update the connection status.
        """
        self.is_connected = False
        print("🔌 ConsoleStreamer disconnected")
    
    async def send_batch(self, batch: BatchChange) -> None:
        """Send a batch of changes to the console.
        
        Args:
            batch: Batch of changes to send
            
        Raises:
            StreamingError: If printing fails
        """
        if not self.is_connected:
            raise StreamingError("ConsoleStreamer is not connected")
        
        try:
            self._print_batch_header(batch)
            self._print_batch_content(batch)
            print("=" * 80)
        except Exception as e:
            raise StreamingError(f"Failed to print batch to console: {e}")
    
    def _print_batch_header(self, batch: BatchChange) -> None:
        """Print the batch header with metadata."""
        if not self.show_metadata:
            return
            
        print("\n" + "=" * 80)
        print(f"📦 BATCH: {batch.batch_id}")
        print(f"⏰ Timestamp: {batch.batch_timestamp.strftime(self.timestamp_format)}")
        print(f"📊 Total Changes: {batch.get_total_changes()}")
        print(f"🗂️  Tables: {len(batch.table_changes)}")
        print("-" * 80)
    
    def _print_batch_content(self, batch: BatchChange) -> None:
        """Print the batch content with all changes."""
        for table_key, table_change in batch.table_changes.items():
            if table_change.is_empty():
                continue
                
            print(f"\n📋 TABLE: {table_key}")
            print(f"   Changes: {len(table_change.changes)}")
            
            for i, change in enumerate(table_change.changes, 1):
                self._print_change_event(change, i)
    
    def _print_change_event(self, change, index: int) -> None:
        """Print a single change event."""
        print(f"\n   🔄 Change #{index}:")
        print(f"      ID: {change.event_id}")
        print(f"      Type: {change.change_type.value}")
        print(f"      Time: {change.event_timestamp.strftime(self.timestamp_format)}")
        
        if change.transaction_id:
            print(f"      Transaction: {change.transaction_id}")
        
        if change.sequence_number is not None:
            print(f"      Sequence: {change.sequence_number}")
        
        # Print old values if present
        if change.old_values:
            print(f"      📤 Old Values:")
            self._print_values(change.old_values, indent=8)
        
        # Print new values if present
        if change.new_values:
            print(f"      📥 New Values:")
            self._print_values(change.new_values, indent=8)
        
        # Print primary key values if present
        if change.primary_key_values:
            print(f"      🔑 Primary Key:")
            self._print_values(change.primary_key_values, indent=8)
    
    def _print_values(self, values: Dict[str, Any], indent: int = 0) -> None:
        """Print a dictionary of values with proper indentation."""
        indent_str = " " * indent
        for key, value in values.items():
            if self.pretty_print and isinstance(value, (dict, list)):
                # Pretty print complex values as JSON
                json_str = json.dumps(value, indent=2, default=str)
                # Add indentation to each line
                indented_json = "\n".join(
                    indent_str + line for line in json_str.split("\n")
                )
                print(f"{indent_str}{key}: {indented_json}")
            else:
                print(f"{indent_str}{key}: {value}")

async def main():
    parser = argparse.ArgumentParser(description="Console Streamer for SAP HANA CDC")
    parser.add_argument("--sap-username", dest="sap_username", default=None, help="SAP HANA username")
    parser.add_argument("--sap-password", dest="sap_password", default=None, help="SAP HANA password")
    parser.add_argument("--sap-host", dest="sap_host", default=None, help="SAP HANA host")
    parser.add_argument("--sap-port", dest="sap_port", default=None, help="SAP HANA port")
    parser.add_argument("--sap-db", dest="sap_db", default=None, help="SAP HANA database name")
    parser.add_argument("--sap-schema", dest="sap_schema", default=None, help="SAP HANA schema")
    args = parser.parse_args()

    # Load environment variables from .env file if present
    try:
        from dotenv import load_dotenv
        load_dotenv()
    except ImportError:
        pass  # dotenv is optional; continue if not installed

    # Fallback to environment variables if not provided in arguments
    sap_username = args.sap_username or os.getenv("SAP_USERNAME") or os.getenv("SAP_HANA_USER")
    sap_password = args.sap_password or os.getenv("SAP_PASSWORD") or os.getenv("SAP_HANA_PASSWORD")
    sap_host = args.sap_host or os.getenv("SAP_HOST") or os.getenv("SAP_HANA_HOST", "localhost")
    sap_port = args.sap_port or os.getenv("SAP_PORT") or os.getenv("SAP_HANA_PORT", "30015")
    sap_db = args.sap_db or os.getenv("SAP_DB") or os.getenv("SAP_HANA_DATABASE", "HDB")
    sap_schema = args.sap_schema or os.getenv("SAP_SCHEMA")

    # Optionally, print or use these variables as needed
    print(f"Using SAP HANA connection:")
    print(f"  Host: {sap_host}")
    print(f"  Port: {sap_port}")
    print(f"  User: {sap_username}")
    print(f"  Database: {sap_db}")
    print(f"  Schema: {sap_schema}")

    # Create the console streamer
    streamer = ConsoleStreamer(config={
        "pretty_print": True,
        "show_metadata": True,
        "timestamp_format": "%Y-%m-%d %H:%M:%S"
    })
    hana_config = SAPHanaConfig(
        host=sap_host,
        port=sap_port,
        user=sap_username,
        password=sap_password,
        database=sap_db,
        schema=sap_schema,
    )
    cdc_config = CDCConfig(
        tables=["MARA"],
        poll_interval_ms=5000,
        batch_size=1000,
        change_schema=sap_username,
    )
    pipeline_config = PipelineConfig(
        sap_hana=hana_config,
        cdc=cdc_config
    )
    connector = SAPHanaCDCConnector(config=pipeline_config, streamer=streamer)

    # Start the connector
    await connector.start()

    # Keep running until interrupted
    while True:
        await asyncio.sleep(1)

if __name__ == "__main__":


    asyncio.run(main())