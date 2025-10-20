"""SAP HANA CDC Data Reader.

This module handles reading CDC data and managing client status.
Requires regular database privileges (no elevated access needed).
"""

import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Set, Any, Iterator

from hdbcli import dbapi

from .config import SAPHanaCDCConfig
from .models import BatchChange, ChangeEvent, ClientTableStatus, TableStatus, TriggerType, PruneResult
from .base import SAPHanaCDCBase

logger = logging.getLogger(__name__)


class SAPHanaCDCReader(SAPHanaCDCBase):
    """Reads CDC data and manages client processing status.
    
    This class handles operations that require regular database privileges:
    - Reading changes from CDC tables
    - Updating client processing status
    - Managing batch processing
    - Querying monitored tables
    - Getting CDC status information
    - Pruning old CDC entries
    """
    
    def _get_change_table_name(self) -> str:
        """Get the full name of the CDC changes table."""
        return self.full_changes_table_name
    
    def _get_client_status_table_name(self) -> str:
        """Get the full name of the CDC client status table."""
        return self.full_client_status_table_name
    
    def get_changes(self, limit: int = 1000) -> BatchChange:
        """Get changes from the CDC table using the last processed change ID from status table.
        
        Args:
            limit: Maximum number of changes to retrieve
            
        Returns:
            BatchChange: Object containing the retrieved changes
        """
        table_status_table = self.full_client_status_table_name
        client_id = self.config.client_id
        
        try:
            with self.connection.cursor() as cursor:
                change_table = self.full_changes_table_name
                    
                # Build query to get changes after the last processed change ID
                query = f"""
                    SELECT 
                        ct.CHANGE_ID,
                        ct.TABLE_SCHEMA,
                        ct.TABLE_NAME,
                        ct.TRIGGER_TYPE,
                        ct.CHANGE_TIMESTAMP,
                        ct.TRANSACTION_ID,
                        ct.OLD_VALUES,
                        ct.NEW_VALUES
                    FROM {change_table} ct
                    INNER JOIN {table_status_table} tst
                        ON ct.TABLE_SCHEMA = tst.SCHEMA_NAME 
                        AND ct.TABLE_NAME = tst.TABLE_NAME 
                        AND tst.CLIENT_ID = ?
                        AND tst.STATUS = ?
                        AND (
                            (tst.LAST_PROCESSED_CHANGE_ID > 0 AND ct.CHANGE_ID > tst.LAST_PROCESSED_CHANGE_ID) 
                        OR 
                            (tst.LAST_PROCESSED_CHANGE_ID = 0 AND tst.UPDATED_AT > ct.CHANGE_TIMESTAMP)
                        )
                    ORDER BY CHANGE_TIMESTAMP ASC 
                    LIMIT ?
                """
                
                cursor.execute(query, (client_id, TableStatus.ACTIVE.value, limit))
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

                logger.info(f"Retrieved {len(changes)} changes for client {client_id}")
                return BatchChange(changes=changes)
                
        except Exception as e:
            logger.error(f"Error getting changes for client {client_id}: {e}")
            raise
    

    def get_client_status(self) -> List[ClientTableStatus]:
        """Get the client's processing status.
        
        Returns:
            List of tuples containing (schema_name, table_name, status) for each monitored table
        """
        status_table = self.full_client_status_table_name
        client_id = self.config.client_id
        
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(f"""
                    SELECT SCHEMA_NAME, TABLE_NAME, STATUS 
                    FROM {status_table} 
                    WHERE CLIENT_ID = ?
                """, (client_id,))
                
                results = []
                for row in cursor.fetchall():
                    schema_name, table_name, status = row
                    results.append(ClientTableStatus(schema_name=schema_name, table_name=table_name, status=TableStatus[status.upper()]))
                
                logger.info(f"Retrieved status for {len(results)} tables for client {client_id}")
                return results
                
        except Exception as e:
            logger.error(f"Error getting client status for {client_id}: {e}")
            raise

    def update_client_status(self, batch: BatchChange) -> None:
        """Update the client's processing status based on a ChangeEvent.
        
        Args:
            batch: BatchChange object containing the changes to process
        """
        status_table = self.full_client_status_table_name
        client_id = self.config.client_id
        schema_name = self.config.source_schema

        try:
            table_max_change_id = {}
            for change in batch.changes:
                table_max_change_id[change.table_name] = max(table_max_change_id.get(change.table_name, 0), int(change.event_id))
            
            # Prepare the data for upsert (insert or update)
            with self.connection.cursor() as cursor:
                # Use MERGE statement for SAP HANA
                for table_name, max_change_id in table_max_change_id.items():
                    update_sql = f"""
                        UPDATE {status_table}
                        SET LAST_PROCESSED_CHANGE_ID = ?, UPDATED_AT = CURRENT_TIMESTAMP
                        WHERE CLIENT_ID = ? AND SCHEMA_NAME = ? AND TABLE_NAME = ?
                    """
                
                    cursor.execute(update_sql, (
                        max_change_id, 
                        client_id,
                        schema_name,
                        table_name
                    ))
                
                logger.info(f"Updated client status for {client_id}")
                
        except Exception as e:
            logger.error(f"Error updating client status for {client_id}: {e}")
            raise

    def get_all_table_rows(self, table_name: str, page_size: int = 1000, offset: int = 0) -> List[Dict[str, Any]]:
        """Get a page of rows from a given table.
        
        Args:
            table_name: Name of the table to read from
            page_size: Number of rows to fetch per page (default: 1000)
            offset: Number of rows to skip (default: 0)
            
        Returns:
            List[Dict[str, Any]]: List of dictionaries representing rows with column names as keys
        """
        schema_name = self.config.source_schema
        full_table_name = f"{schema_name}.{table_name}"
        
        try:
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
                    return []
                
                column_names = [col[0] for col in columns_info]
                logger.info(f"Reading page of rows from {full_table_name} (offset: {offset}, page_size: {page_size})")
            
            # Get the requested page of rows
            with self.connection.cursor() as cursor:
                query = f"""
                    SELECT * FROM {full_table_name}
                    ORDER BY 1
                    LIMIT ? OFFSET ?
                """
                
                cursor.execute(query, (page_size, offset))
                rows = cursor.fetchall()
                
                # Convert rows to dictionaries
                result = []
                for row in rows:
                    row_dict = {}
                    for i, value in enumerate(row):
                        if i < len(column_names):
                            row_dict[column_names[i]] = value
                    result.append(row_dict)
                
                logger.debug(f"Retrieved {len(result)} rows from {full_table_name}")
                return result
                
        except Exception as e:
            logger.error(f"Error reading rows from {full_table_name}: {e}")
            raise



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
            - max_timestamp: ISO format timestamp of the latest change
            - last_client_update: ISO format timestamp of the last client update
        """
        change_table = self._get_change_table_name()
        status_table = self._get_client_status_table_name()
        
        try:
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
                    SELECT MAX(UPDATED_AT)
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
                    "lag_seconds": int(lag_seconds) if lag_seconds is not None else 0,
                    "max_timestamp": max_timestamp.isoformat() if max_timestamp else None,
                    "last_client_update": last_client_update.isoformat() if last_client_update else None
                }
                
        except Exception as e:
            logger.error(f"Error getting status for client {client_id}: {e}")
            raise
    
    def prune(self, older_than_days: int = 7) -> PruneResult:
        """Prune old entries from the CDC change table.
        
        Args:
            older_than_days: Number of days to keep (entries older than this will be deleted)
            
        Returns:
            PruneResult containing:
            - entries_deleted: Number of entries deleted
            - cutoff_timestamp: The timestamp used as the cutoff (ISO format)
        """
        change_table = self._get_change_table_name()
        
        try:
            with self.connection.cursor() as cursor:
                # Delete entries in a single query using database server timestamp
                cursor.execute(f"""
                    DELETE FROM {change_table} 
                    WHERE CHANGE_TIMESTAMP < CURRENT_TIMESTAMP - INTERVAL ? DAY
                """, (older_than_days,))
                
                entries_deleted = cursor.rowcount
                
                # Calculate cutoff timestamp for logging and return value
                # We approximate this since we can't get the exact timestamp from the DELETE query
                cutoff_timestamp = datetime.now() - timedelta(days=older_than_days)
                
                logger.info(f"Deleted {entries_deleted} entries older than {cutoff_timestamp}")
                
                return PruneResult(
                    entries_deleted=entries_deleted,
                    cutoff_timestamp=cutoff_timestamp.isoformat()
                )
                
        except Exception as e:
            logger.error(f"Error pruning entries older than {older_than_days} days: {e}")
            raise
    
    def get_current_monitored_tables(self) -> Dict[str, Set[str]]:
        """Get currently monitored tables and their enabled change types.
        
        Returns:
            Dict mapping table names to sets of enabled trigger types
        """
        try:
            with self.connection.cursor() as cursor:
                # Query to get all triggers for the source schema
                cursor.execute("""
                    SELECT SUBJECT_TABLE_NAME, TRIGGER_NAME
                    FROM TRIGGERS 
                    WHERE SCHEMA_NAME = ? AND TRIGGER_NAME LIKE ?
                """, (self.config.source_schema, f"%CDC_TRIGGER%"))
                
                monitored_tables = {}
                for row in cursor.fetchall():
                    table_name, trigger_name = row
                    if table_name not in monitored_tables:
                        monitored_tables[table_name] = set()
                    
                    # Extract trigger type from trigger name (e.g., "TABLE_CDC_TRIGGER_INSERT" -> "INSERT")
                    if "INSERT" in trigger_name:
                        monitored_tables[table_name].add("INSERT")
                    elif "UPDATE" in trigger_name:
                        monitored_tables[table_name].add("UPDATE")
                    elif "DELETE" in trigger_name:
                        monitored_tables[table_name].add("DELETE")
                
                logger.info(f"Found {len(monitored_tables)} monitored tables")
                return monitored_tables
                
        except Exception as e:
            logger.error(f"Error getting monitored tables: {e}")
            raise