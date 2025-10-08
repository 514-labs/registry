"""SAP HANA CDC Data Reader.

This module handles reading CDC data and managing client status.
Requires regular database privileges (no elevated access needed).
"""

import json
import logging
from datetime import datetime
from typing import Dict, List, Optional, Set, Any, Iterator

from hdbcli import dbapi

from .config import SAPHanaCDCConfig
from .models import BatchChange, ChangeEvent, TriggerType
from .base import SAPHanaCDCBase

logger = logging.getLogger(__name__)


class SAPHanaCDCReader(SAPHanaCDCBase):
    """Reads CDC data and manages client processing status.
    
    This class handles operations that require regular database privileges:
    - Reading changes from CDC tables
    - Updating client processing status
    - Managing batch processing
    - Querying monitored tables
    """
    
    def get_changes(self, limit: int = 1000, auto_update_client_status: bool = True) -> BatchChange:
        """Get changes from the CDC table using the last processed change ID from status table."""

        status_table = self._get_client_status_table_name()
        client_id = self.config.client_id
        
        with self.connection.cursor() as cursor:
            # Get the minimum last processed change ID across all monitored tables for this client
            # This ensures we don't miss any changes
            cursor.execute(f"""
                SELECT MAX(LAST_PROCESSED_CHANGE_ID) as max_change_id
                FROM {status_table}
                WHERE CLIENT_ID = ?
            """, (client_id,))
            
            result = cursor.fetchone()
            max_change_id = result[0] if result and result[0] is not None else 0
            change_table = self._get_change_table_name()
                
            # Build query to get changes after the last processed change ID
            query = f"""
                SELECT 
                    CHANGE_ID,
                    TABLE_SCHEMA,
                    TABLE_NAME,
                    TRIGGER_TYPE,
                    CHANGE_TIMESTAMP,
                    TRANSACTION_ID,
                    OLD_VALUES,
                    NEW_VALUES
                FROM {change_table}
                WHERE CHANGE_ID > ?
                ORDER BY CHANGE_TIMESTAMP ASC 
                LIMIT ?
            """
            
            cursor.execute(query, (max_change_id, limit))
            changes = []
            for row in cursor.fetchall():
                change = ChangeEvent(
                    event_id=str(row[0]),
                    event_timestamp=row[4],
                    trigger_type=TriggerType[row[3].upper()],
                    transaction_id=str(row[5]),
                    schema_name=row[1],
                    table_name=row[2],
                    full_table_name=f"{row[1]}.{row[2]}",
                    old_values=self._parse_json(row[6]) if row[6] else None,
                    new_values=self._parse_json(row[7]) if row[7] else None,
                )
                changes.append(change)

            if auto_update_client_status and changes:
                max_change = max(changes, key=lambda c: int(c.event_id))
                self.update_client_status(max_change)
                
            logger.info(f"Retrieved {len(changes)} changes for client {client_id}")
            return BatchChange(changes=changes)
    
    def update_client_status(self, change_event: ChangeEvent) -> None:
        """Update the client's processing status based on a ChangeEvent."""
        
        status_table = self._get_client_status_table_name()
        client_id = self.config.client_id
        
        # Prepare the data for upsert (insert or update)
        with self.connection.cursor() as cursor:
            # Use MERGE statement for SAP HANA
            merge_sql = f"""
                MERGE INTO {status_table} AS target
                USING (SELECT ? CLIENT_ID FROM DUMMY) AS source
                ON target.CLIENT_ID = source.CLIENT_ID 
                WHEN MATCHED THEN
                    UPDATE SET 
                        LAST_PROCESSED_TIMESTAMP = ?,
                        LAST_PROCESSED_CHANGE_ID = ?,
                        UPDATED_AT = CURRENT_TIMESTAMP
                WHEN NOT MATCHED THEN
                    INSERT (CLIENT_ID, LAST_PROCESSED_TIMESTAMP, LAST_PROCESSED_CHANGE_ID, CREATED_AT, UPDATED_AT)
                    VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """
            
            # Convert event_id to integer if possible, otherwise use a hash
            change_id = int(change_event.event_id)

            cursor.execute(merge_sql, (
                # Source values for MERGE
                client_id,
                # UPDATE values
                change_event.event_timestamp,
                change_id,
                # INSERT values
                client_id,
                change_event.event_timestamp,
                change_id
            ))
            
            logger.info(f"Updated client status for {client_id} - {change_event.schema_name}.{change_event.table_name} at {change_event.event_timestamp}")

    def get_all_table_rows(self, table_name: str, page_size: int = 1000) -> Iterator[Dict[str, Any]]:
        """Get all rows from a given table with transparent pagination.
        
        Args:
            table_name: Name of the table to read from
            page_size: Number of rows to fetch per page (default: 1000)
            
        Yields:
            Dict[str, Any]: Dictionary representing a single row with column names as keys
        """
        schema_name = self.config.source_schema
        full_table_name = f"{schema_name}.{table_name}"
        
        # First, get the column information
        with self.connection.cursor() as cursor:
            cursor.execute("""
                SELECT COLUMN_NAME, DATA_TYPE_NAME
                FROM TABLE_COLUMNS 
                WHERE SCHEMA_NAME = ? AND TABLE_NAME = ?
                ORDER BY POSITION
            """, (schema_name, table_name))
            
            columns_info = cursor.fetchall()
            if not columns_info:
                logger.warning(f"Table {full_table_name} not found or has no columns")
                return
            
            column_names = [col[0] for col in columns_info]
            logger.info(f"Reading all rows from {full_table_name}")
        
        # Now iterate through all rows with pagination
        offset = 0
        while True:
            with self.connection.cursor() as cursor:
                query = f"""
                    SELECT * FROM {full_table_name}
                    ORDER BY 1
                    LIMIT ? OFFSET ?
                """
                
                cursor.execute(query, (page_size, offset))
                rows = cursor.fetchall()
                
                if not rows:
                    # No more rows to fetch
                    break
                
                # Convert rows to dictionaries
                for row in rows:
                    row_dict = {}
                    for i, value in enumerate(row):
                        if i < len(column_names):
                            row_dict[column_names[i]] = value
                    yield row_dict
                
                # If we got fewer rows than page_size, we've reached the end
                if len(rows) < page_size:
                    break
                
                offset += page_size
                
        logger.info(f"Finished reading all rows from {full_table_name}")



    def _parse_json(self, json_str: str) -> Dict[str, Any]:
        """Parse JSON string to dictionary."""
        try:
            return json.loads(json_str) if json_str else {}
        except json.JSONDecodeError as e:
            logger.warning(f"Failed to parse JSON: {e}")
            return {}
    
    def get_status(self, client_id: str) -> Dict[str, Any]:
        """Get CDC status for a specific client.
        
        Args:
            client_id: The client ID to get status for
            
        Returns:
            Dict containing:
            - total_entries: Total number of entries in the CDC change table
            - lag_seconds: Lag in seconds (max insert timestamp - last client update)
        """
        change_table = self._get_change_table_name()
        status_table = self._get_client_status_table_name()
        
        with self.connection.cursor() as cursor:
            # Get total entries in CDC change table
            cursor.execute(f"SELECT COUNT(*) FROM {change_table}")
            total_entries = cursor.fetchone()[0]
            
            # Get max insert timestamp from change table
            cursor.execute(f"SELECT MAX(CHANGE_TIMESTAMP) FROM {change_table}")
            max_timestamp_result = cursor.fetchone()
            max_timestamp = max_timestamp_result[0] if max_timestamp_result[0] else None
            
            # Get last client update timestamp
            cursor.execute(f"""
                SELECT LAST_PROCESSED_TIMESTAMP 
                FROM {status_table} 
                WHERE CLIENT_ID = ?
            """, (client_id,))
            
            client_status_result = cursor.fetchone()
            last_client_update = client_status_result[0] if client_status_result else None
            
            # Calculate lag in seconds
            lag_seconds = None
            if max_timestamp and last_client_update:
                time_diff = max_timestamp - last_client_update
                lag_seconds = time_diff.total_seconds()
                
                # If lag is greater than 1 second, calculate from max_timestamp to now instead
                if lag_seconds > 1:
                    now = datetime.now()
                    time_diff = now - max_timestamp
                    lag_seconds = time_diff.total_seconds()
            elif max_timestamp and not last_client_update:
                # Client has never processed any changes, so lag is from max timestamp to now
                now = datetime.now()
                time_diff = now - max_timestamp
                lag_seconds = time_diff.total_seconds()
            
            return {
                "total_entries": total_entries,
                "lag_seconds": int(lag_seconds),
                "max_timestamp": max_timestamp.isoformat() if max_timestamp else None,
                "last_client_update": last_client_update.isoformat() if last_client_update else None
            }