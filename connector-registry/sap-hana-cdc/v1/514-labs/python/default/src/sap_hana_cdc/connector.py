"""SAP HANA database extractor for CDC."""

from enum import StrEnum, auto
import json
from datetime import datetime
import logging
from typing import List, Optional, Dict, Any, Set

from hdbcli import dbapi

from .config import CDCConfig, ChangeType, SAPHanaConfig
from .models import BatchChange, ChangeEvent


logger = logging.getLogger(__name__)


class TriggerType(StrEnum):
    INSERT = auto()
    UPDATE = auto()
    DELETE = auto()


class SAPHanaCDCConnector:
    """Extracts change data from SAP HANA database."""
    
    def __init__(self, sap_config: SAPHanaConfig, cdc_config: CDCConfig):
        self.sap_config : SAPHanaConfig = sap_config
        self.cdc_config : CDCConfig = cdc_config
        self.connection: Optional[dbapi.Connection] = None
        self.is_connected = False
        
    def init_cdc(self, force_recreate: bool = False) -> None:
        if not self.connection:
            raise RuntimeError("Not connected to database")
        
        # Ensure change table exists
        self._create_change_table(force_recreate)
        
        # Ensure status table exists
        self._create_change_status_table(force_recreate)
        
        # Get current list of tables to monitor
        current_tables = self._get_monitored_tables()
        current_tables_set = set(current_tables)
        configured_tables_set = set(self.cdc_config.tables)
        
        # Detect changes
        tables_to_remove = current_tables_set - configured_tables_set
        self._remove_table_cdc(tables_to_remove)
        
        self._ensure_cdc_infrastructure(current_tables, force_recreate)

        # Remove CDC infrastructure for tables no longer monitored
        if tables_to_remove:
            self._remove_table_cdc(tables_to_remove)
        
        # Update monitored tables set
        self.monitored_tables = current_tables_set
    
    def connect(self) -> None:
        try:
            # Create connection
            self.connection = dbapi.connect(
                address=self.sap_config.host,
                port=self.sap_config.port,
                user=self.sap_config.user,
                password=self.sap_config.password,
                autocommit=True,
            )
            
            self.is_connected = True
            
            logger.info("Connected to SAP HANA database")
            
        except Exception as e:
            logger.error("Failed to connect to SAP HANA", e)
            raise
    
    def disconnect(self) -> None:
        if self.connection:
            self.connection.close()
            self.connection = None
            self.is_connected = False
        
    def _add_table_cdc(self, tables: Set[str], force_recreate: bool = False) -> None:
        with self.connection.cursor() as cursor:
            for table in tables:
                self._setup_table_cdc(cursor, table, force_recreate)
    
    def _remove_table_cdc(self, tables: Set[str]) -> None:
        """Remove CDC infrastructure for tables no longer monitored."""
        with self.connection.cursor() as cursor:
            for table in tables:
                self._cleanup_table_cdc(cursor, table)
    
    def _ensure_cdc_infrastructure(self, tables: List[str], force_recreate: bool = False) -> None:
        with self.connection.cursor() as cursor:
            for table in tables:
                # Check if CDC infrastructure exists
                if self._check_table_cdc_exists(cursor, table):
                    self._setup_table_cdc(cursor, table, force_recreate)
    
    def _get_change_table_name(self, with_schema: bool = True) -> str:
        schema = self.cdc_config.change_schema or self.sap_config.schema
        table_name = self.cdc_config.change_table_name.upper()
        return f"{schema}.{table_name}" if with_schema else table_name
    
    def _table_exists(self, schema_name: str, table_name: str) -> bool:
        """Check if a table exists in the specified schema."""
        with self.connection.cursor() as cursor:
            try:
                cursor.execute("""
                    SELECT COUNT(*) 
                    FROM TABLES 
                    WHERE SCHEMA_NAME = ? AND TABLE_NAME = ?
                """, (schema_name, table_name))
                
                result = cursor.fetchone()
                exists = result[0] > 0 if result else False
                return exists
            except Exception as e:
                logger.error(f"Error checking if table {schema_name}.{table_name} exists: {e}")
                return False

    def _ensure_table_exists(self, schema_name: str, table_name: str, table_definition: str, force_recreate: bool = False) -> None:
        """Ensure a table exists with the given definition, creating it if necessary."""
        if not self.connection:
            raise RuntimeError("Not connected to database")
        
        full_table_name = f"{schema_name}.{table_name}"
        
        # Check if table already exists
        table_exists = self._table_exists(schema_name, table_name)
        
        if table_exists:
            logger.info(f"Table {full_table_name} already exists")
            if force_recreate:
                with self.connection.cursor() as cursor:
                    cursor.execute(f"DROP TABLE {full_table_name}")
                    logger.info(f"Dropped table {full_table_name}")
            else:
                return
        
        # Create the table
        with self.connection.cursor() as cursor:
            cursor.execute(table_definition)
            logger.info(f"Created table {full_table_name}")

    def _check_change_table_exists(self, cursor: dbapi.Cursor) -> bool:
        """Check if the change table already exists."""
        schema = self.cdc_config.change_schema or self.sap_config.schema
        table_name = self._get_change_table_name(with_schema=False)
        return self._table_exists(schema, table_name)
    
    def _check_trigger_exists(self, cursor: dbapi.Cursor, table_name: str, trigger_type: TriggerType) -> bool:
        """Check if a trigger already exists."""
        try:
            trigger_name = self._get_trigger_name(table_name, trigger_type)
            cursor.execute("""
                SELECT COUNT(*) 
                FROM TRIGGERS 
                WHERE TRIGGER_NAME = ?
            """, (trigger_name,))
            
            result = cursor.fetchone()
            exists = result[0] > 0 if result else False
            
            return exists
            
        except Exception as e:
            return False
    
    def _create_change_table(self, force_recreate: bool = False) -> None:
        """Create the single change table for all CDC changes."""
        schema = self.cdc_config.change_schema or self.sap_config.schema
        table_name = self._get_change_table_name(with_schema=False)
        change_table = f"{schema}.{table_name}"
        
        table_definition = f"""
            CREATE TABLE {change_table} (
                CHANGE_ID BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                TABLE_SCHEMA VARCHAR(128) NOT NULL,
                TABLE_NAME VARCHAR(128) NOT NULL,
                CHANGE_TYPE VARCHAR(10) NOT NULL,
                CHANGE_TIMESTAMP TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                TRANSACTION_ID VARCHAR(50) NOT NULL,
                OLD_VALUES NCLOB,
                NEW_VALUES NCLOB
            )
        """
        
        self._ensure_table_exists(schema, table_name, table_definition, force_recreate)
    
    def _get_monitored_tables(self) -> List[str]:
        """Get list of tables to monitor for changes."""
        
        # Build query based on table selection
        if "*" in self.cdc_config.tables:
            # Get all tables in schema
            query = """
                SELECT TABLE_NAME 
                FROM TABLES 
                WHERE SCHEMA_NAME = ?
            """
            params = (self.sap_config.schema,)
        else:
            # Get specific tables
            placeholders = ",".join(["?" for _ in self.cdc_config.tables])
            query = f"""
                SELECT TABLE_NAME 
                FROM TABLES 
                WHERE SCHEMA_NAME = ? 
                AND TABLE_NAME IN ({placeholders})
            """
            
            params = [self.sap_config.schema] + self.cdc_config.tables
        
        tables = [row[0] for row in self._fetch_all(query, params)]
        
        # Filter out excluded tables
        tables = [t for t in tables if t not in self.cdc_config.exclude_tables]
        
        return tables
            
    
    def _fetch_all(self, query: str, params: tuple) -> Any:
        with self.connection.cursor() as cursor:
            cursor.execute(query, params)
            return cursor.fetchall()
    
    def _setup_table_cdc(self, cursor: dbapi.Cursor, table_name: str, force_recreate: bool = False) -> None:
        """Setup CDC for a specific table."""
        try:
            change_table = self._get_change_table_name()
            
            # Create trigger for INSERT
            for change_type in self.cdc_config.change_types:
                match(change_type):
                    case ChangeType.INSERT:
                        trigger_type = TriggerType.INSERT
                    case ChangeType.UPDATE:
                        trigger_type = TriggerType.UPDATE
                    case ChangeType.DELETE:
                        trigger_type = TriggerType.DELETE
                    case _:
                        raise ValueError(f"Invalid change type: {change_type}")
                self._create_trigger(cursor, table_name, change_table, trigger_type, force_recreate)
        
        except Exception as e:
            raise
    
    def _create_select_stmt(self, table_name: str, source_var: str, dest_var: str) -> str:
        """Create a SELECT statement for a table."""
        # Get column information directly from the database
        query = """
            SELECT COLUMN_NAME
            FROM TABLE_COLUMNS 
            WHERE SCHEMA_NAME = ? AND TABLE_NAME = ?
            ORDER BY POSITION
        """
        
        columns = [row[0] for row in self._fetch_all(query, (self.sap_config.schema, table_name))]
        if not columns:
            return

        select_columns = ", ".join([f":{source_var}.\"{col}\"" for col in columns])
        # SELECT new_row.* doesn't work
        query = f"""
                SELECT {select_columns} INTO {dest_var} FROM DUMMY FOR JSON;
        """

        return query
    

    def _create_trigger(self, cursor: dbapi.Cursor, table_name: str, change_table: str, trigger_type: TriggerType, force_recreate: bool = False) -> None:
        """Create trigger for a table."""
        trigger_name = self._get_trigger_name(table_name, trigger_type)
        
        # Check if trigger already exists
        if self._check_trigger_exists(cursor, table_name, trigger_type):
            if not force_recreate:
                return
        
        try:
            quoted_table_name = f'"{table_name}"'
            quoted_schema_name = f'{self.sap_config.schema}'
            trigger_sql = f"""
                CREATE {"OR REPLACE " if force_recreate else ""}TRIGGER {trigger_name}
                AFTER {trigger_type.value} ON {quoted_schema_name}.{quoted_table_name}
                REFERENCING OLD ROW AS old_row, NEW ROW AS new_row
                FOR EACH ROW
                BEGIN
                    DECLARE old_json NCLOB;
                    DECLARE new_json NCLOB;
                    {self._create_select_stmt(table_name, "old_row", "old_json") if trigger_type != TriggerType.INSERT else ""}
                    {self._create_select_stmt(table_name, "new_row", "new_json") if trigger_type != TriggerType.DELETE else ""}

                    INSERT INTO {change_table} (
                        TABLE_SCHEMA, TABLE_NAME, CHANGE_TYPE, TRANSACTION_ID, OLD_VALUES, NEW_VALUES
                    ) VALUES (
                        '{self.sap_config.schema}',
                        '{table_name}',
                        '{trigger_type.value}',
                        CURRENT_UPDATE_TRANSACTION(),
                        :old_json,
                        :new_json
                    );
                END
            """
            cursor.execute(trigger_sql)
            
        except Exception as e:
            raise

    def _get_trigger_name(self, table_name: str, trigger_type: TriggerType) -> str:
        """Get the name of a trigger for a table."""
        return f"{table_name}_{trigger_type.value.upper()}_TRIGGER"
    
    def _drop_trigger(self, cursor: dbapi.Cursor, table_name: str, trigger_type: TriggerType) -> None:
        """Drop a trigger."""
        trigger_name = self._get_trigger_name(table_name, trigger_type)
        cursor.execute(f"DROP TRIGGER {trigger_name}")

    def _cleanup_table_cdc(self, cursor: dbapi.Cursor, table_name: str) -> None:
        """Clean up CDC infrastructure for a table (triggers)."""
        
        for trigger_type in TriggerType:
            self._drop_trigger(cursor, table_name, trigger_type)
            
        
    def _check_table_cdc_exists(self, cursor: dbapi.Cursor, table_name: str) -> bool:
        # Check if at least one trigger exists for the table
        cursor.execute("""
            SELECT COUNT(*) 
            FROM TRIGGERS 
            WHERE SCHEMA_NAME = ? AND TRIGGER_NAME LIKE ?
        """, (self.sap_config.schema, f"{table_name}_%_TRIGGER"))
        
        result = cursor.fetchone()
        exists = result[0] > 0 if result else False
        
        return exists
        
    
    def get_changes(self, limit: int = 1000, auto_update_client_status: bool = True) -> BatchChange:
        """Get changes from the CDC table using the last processed change ID from status table."""
        if not self.connection:
            raise RuntimeError("Not connected to database")

        change_table = self._get_change_table_name()
        schema = self.cdc_config.change_schema or self.sap_config.schema
        status_table = f"{schema}.CDC_CHANGES_STATUS"
        client_id = self.cdc_config.client_id
        
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
            
            # Build query to get changes after the last processed change ID
            query = f"""
                SELECT 
                    CHANGE_ID,
                    TABLE_SCHEMA,
                    TABLE_NAME,
                    CHANGE_TYPE,
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
                    change_type=ChangeType(row[3].upper()),
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
            return BatchChange(changes=changes)
    
    def _create_change_status_table(self, force_recreate: bool = False) -> None:
        """Create the cdc_changes_status table for tracking CDC status."""
        schema = self.cdc_config.change_schema or self.sap_config.schema
        table_name = "CDC_CHANGES_STATUS"
        status_table = f"{schema}.{table_name}"
        
        table_definition = f"""
            CREATE TABLE {status_table} (
                CLIENT_ID VARCHAR(128) NOT NULL,
                LAST_PROCESSED_TIMESTAMP TIMESTAMP,
                LAST_PROCESSED_CHANGE_ID BIGINT,
                CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (CLIENT_ID)
            )
        """
        
        self._ensure_table_exists(schema, table_name, table_definition, force_recreate)
        
    def update_client_status(self, change_event: 'ChangeEvent') -> None:
        """Update the client's processing status based on a ChangeEvent."""
        if not self.connection:
            raise RuntimeError("Not connected to database")
        
        schema = self.cdc_config.change_schema or self.sap_config.schema
        status_table = f"{schema}.CDC_CHANGES_STATUS"
        client_id = self.cdc_config.client_id
        
        # Prepare the data for upsert (insert or update)
        with self.connection.cursor() as cursor:
            # Use UPSERT (INSERT ... ON DUPLICATE KEY UPDATE) or equivalent
            # For SAP HANA, we'll use MERGE statement
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
        
    def _parse_json(self, json_str: str) -> Dict[str, Any]:
        """Parse JSON string to dictionary."""
        return json.loads(json_str) if json_str else {}
    