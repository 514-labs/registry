"""SAP HANA CDC Infrastructure Management.

This module handles the creation and management of CDC infrastructure including
tables and triggers. Requires elevated database privileges.
"""

import logging
from typing import List
import re


from hdbcli import dbapi

from .base import SAPHanaCDCBase
from .config import SAPHanaCDCConfig
from .models import TriggerType, TableStatus


logger = logging.getLogger(__name__)



class SAPHanaCDCInfrastructure(SAPHanaCDCBase):
    """Manages CDC infrastructure setup and maintenance.
    
    This class handles operations that require elevated database privileges:
    - Creating CDC tables
    - Creating and dropping triggers
    - Managing CDC infrastructure lifecycle
    """
    TRIGGER_NAME_SUFFIX = "_CDC_TRIGGER"

    def __init__(self, connection: dbapi.Connection, config: SAPHanaCDCConfig):
        super().__init__(connection, config)
    
    def setup_cdc_infrastructure(self) -> None:
        """Set up complete CDC infrastructure for the given configuration."""
        self.create_change_table()
        self.create_client_status_table()
        self.create_table_status_table()
        # Setup triggers for monitored tables
        self.setup_table_triggers()
        
        logger.info("CDC infrastructure setup completed")
    
    def create_change_table(self) -> None:
        """Create the main change table for storing CDC events."""
        
        table_definition = f"""
            CREATE TABLE <TABLENAME> (
                CHANGE_ID BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                TABLE_SCHEMA VARCHAR(128) NOT NULL,
                TABLE_NAME VARCHAR(128) NOT NULL,
                TRIGGER_TYPE VARCHAR(10) NOT NULL,
                CHANGE_TIMESTAMP TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                TRANSACTION_ID VARCHAR(50) NOT NULL,
                OLD_VALUES NCLOB,
                NEW_VALUES NCLOB
            )
        """
        
        self._ensure_table_exists(self.CDC_CHANGES_TABLE, table_definition)
    
    def create_client_status_table(self) -> None:
        """Create the status table for tracking client processing status."""
        table_definition = f"""
            CREATE TABLE <TABLENAME> (
                CLIENT_ID VARCHAR(128) NOT NULL,
                LAST_PROCESSED_TIMESTAMP TIMESTAMP,
                LAST_PROCESSED_CHANGE_ID BIGINT,
                CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (CLIENT_ID)
            )
        """
        
        self._ensure_table_exists(self.CDC_CLIENT_CHANGES_STATUS_TABLE, table_definition)
    
    def create_client_status_table(self) -> None:
        """Create the status table for tracking client processing status."""
        table_definition = f"""
            CREATE TABLE <TABLENAME> (
                CLIENT_ID VARCHAR(128) NOT NULL,
                LAST_PROCESSED_TIMESTAMP TIMESTAMP,
                LAST_PROCESSED_CHANGE_ID BIGINT,
                CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (CLIENT_ID)
            )
        """
        
        self._ensure_table_exists(self.CDC_CLIENT_CHANGES_STATUS_TABLE, table_definition)
    
    def create_table_status_table(self) -> None:
        """Create the status table for tracking table processing status."""
        table_definition = f"""
            CREATE TABLE <TABLENAME> (
                SCHEMA_NAME VARCHAR(128) NOT NULL,
                TABLE_NAME VARCHAR(128) NOT NULL,
                STATUS VARCHAR(128) NOT NULL,
                PRIMARY KEY (SCHEMA_NAME, TABLE_NAME)
            )
        """
        self._ensure_table_exists(self.CDC_TABLE_CHANGES_STATUS_TABLE, table_definition)

    def setup_table_triggers(self) -> None:
        """Set up triggers for the specified tables and change types."""

        with self.connection.cursor() as cursor:
            current_tables = set(self.get_monitored_tables())
            desired_tables = set(self.config.tables)

            tables_to_add = desired_tables - current_tables
            tables_to_remove = current_tables - desired_tables

            # Add triggers for new tables
            for table in tables_to_add:
                if self._setup_table_cdc(cursor, table):
                    self._update_table_status(cursor, table, TableStatus.NEW)
                logger.info(f"CDC triggers setup completed for new table {table}")

            # Remove triggers for tables no longer in config
            for table in tables_to_remove:
                self._cleanup_table_cdc(cursor, table)
                self._remove_table_status(cursor, table)
                logger.info(f"CDC triggers cleaned up for removed table {table}")


    def set_table_status_active(self, table_name: str) -> None:
        """Update the status of a table."""
        with self.connection.cursor() as cursor:
            self._update_table_status(cursor, table_name, TableStatus.ACTIVE)


    def get_monitored_tables(self) -> List[str]:
        """Get list of currently monitored tables by examining existing triggers.
        
        This method queries the SAP HANA database to find all tables that have
        CDC triggers installed, indicating they are being monitored for changes.
        
        Returns:
            List[str]: List of table names that are currently monitored
        """
        with self.connection.cursor() as cursor:
            cursor.execute("""
                SELECT DISTINCT SUBJECT_TABLE_NAME
                FROM TRIGGERS 
                WHERE SCHEMA_NAME = ? AND TRIGGER_NAME LIKE ?
            """, (self.config.source_schema, f"%{self.TRIGGER_NAME_SUFFIX}"))
            
            result = [row[0] for row in cursor.fetchall()]
        
        logger.info(f"Found {len(result)} monitored tables: {result}")
        return result

    def _update_table_status(self, cursor: dbapi.Cursor, table_name: str, status: TableStatus) -> None:
        """Update the status of a table."""
        table_status_table = self._get_table_status_table_name()
        if status == TableStatus.NEW:
            cursor.execute(f"DELETE FROM {table_status_table} WHERE SCHEMA_NAME = ? AND TABLE_NAME = ?", (self.config.cdc_schema, table_name))
            cursor.execute(f"INSERT INTO {table_status_table} (SCHEMA_NAME, TABLE_NAME, STATUS) VALUES (?, ?, ?)", (self.config.cdc_schema, table_name, status.value))
        else:
            cursor.execute(f"UPDATE {table_status_table} SET STATUS = ? WHERE SCHEMA_NAME = ? AND TABLE_NAME = ?", (status.value, self.config.cdc_schema, table_name))

    def _remove_table_status(self, cursor: dbapi.Cursor, table_name: str) -> None:
        """Remove the status of a table."""
        table_status_table = self._get_table_status_table_name()
        cursor.execute(f"DELETE FROM {table_status_table} WHERE SCHEMA_NAME = ? AND TABLE_NAME = ?", (self.config.cdc_schema, table_name))


    def cleanup_cdc_infrastructure(self) -> None:
        """Remove all CDC infrastructure (tables and triggers)."""
        
        # Get all monitored tables first
        monitored_tables = self.get_monitored_tables()
        
        with self.connection.cursor() as cursor:
            # Remove triggers for all tables
            for table_name in monitored_tables:
                self._cleanup_table_cdc(cursor, table_name)
            
            # Drop status table
            tables_to_drop = [self._get_client_status_table_name(), self._get_table_status_table_name(), self._get_change_table_name()]
            for table_name in tables_to_drop:
                try:
                    cursor.execute(f"DROP TABLE {table_name}")
                    logger.info(f"Dropped status table {table_name}")
                except Exception as e:
                    logger.warning(f"Could not drop status table: {e}")
        
        logger.info("CDC infrastructure cleanup completed")
    

    def get_newly_added_tables(self) -> List[str]:
        """Get list of tables that have been added."""
        with self.connection.cursor() as cursor:
            cursor.execute(f"SELECT TABLE_NAME FROM {self._get_table_status_table_name()} WHERE STATUS = ?", (TableStatus.NEW.value,))
            return [row[0] for row in cursor.fetchall()]

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
    
    def _ensure_table_exists(self, table_name: str, table_definition: str) -> None:
        """Ensure a table exists with the given definition, creating it if necessary."""
        # Always in the CDC schema, we're not creating tables in the source schema
        full_table_name = f"{self.config.cdc_schema}.{table_name}"
        
        # Check if table already exists
        table_exists = self._table_exists(self.config.cdc_schema, table_name)
        
        if table_exists:
            logger.info(f"Table {full_table_name} already exists")
            return
        
        # Create the table
        with self.connection.cursor() as cursor:
            cursor.execute(table_definition.replace("<TABLENAME>", full_table_name))
            logger.info(f"Created table {full_table_name}")
    
    def _setup_table_cdc(self, cursor: dbapi.Cursor, table_name: str) -> None:
        """Set up CDC for a specific table."""
        try:
            trigger_created = False
            # Create triggers for each change type
            for trigger_type in TriggerType:
                trigger_created = self._create_trigger(cursor, table_name, trigger_type)

            return trigger_created

        except Exception as e:
            logger.error(f"Failed to setup CDC for table {table_name}: {e}")
            raise
  
    
    def _create_trigger(self, cursor: dbapi.Cursor, table_name: str, trigger_type: TriggerType) -> bool:
        """Create a trigger for a table."""
        trigger_name = self._get_trigger_name(table_name, trigger_type)
        
        # Check if trigger already exists
        if self._check_trigger_exists(cursor, table_name, trigger_type):
            return False
        
        change_table = self._get_change_table_name()

        try:
            quoted_table_name = f'"{table_name}"'
            quoted_schema_name = f'{self.config.source_schema}'
            trigger_sql = f"""
                CREATE TRIGGER {trigger_name}
                AFTER {trigger_type.value} ON {quoted_schema_name}.{quoted_table_name}
                REFERENCING OLD ROW AS old_row, NEW ROW AS new_row
                FOR EACH ROW
                BEGIN
                    DECLARE old_json NCLOB;
                    DECLARE new_json NCLOB;
                    {self._create_select_stmt(table_name, "old_row", "old_json") if trigger_type != TriggerType.INSERT else ""}
                    {self._create_select_stmt(table_name, "new_row", "new_json") if trigger_type != TriggerType.DELETE else ""}

                    INSERT INTO {change_table} (
                        TABLE_SCHEMA, TABLE_NAME, TRIGGER_TYPE, TRANSACTION_ID, OLD_VALUES, NEW_VALUES
                    ) VALUES (
                        '{self.config.source_schema}',
                        '{table_name}',
                        '{trigger_type.value}',
                        CURRENT_UPDATE_TRANSACTION(),
                        :old_json,
                        :new_json
                    );
                END
            """
            cursor.execute(trigger_sql)
            logger.debug(f"Created trigger {trigger_name} for table {table_name}")
            return True

        except Exception as e:
            logger.error(f"Failed to create trigger {trigger_name}: {e}")
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
        
        with self.connection.cursor() as cursor:
            cursor.execute(query, (self.config.source_schema, table_name))
            columns = [row[0] for row in cursor.fetchall()]
        
        if not columns:
            raise ValueError(f"No columns found for table {table_name}")

        select_columns = ", ".join([f":{source_var}.\"{col}\"" for col in columns])
        query = f"""
                SELECT {select_columns} INTO {dest_var} FROM DUMMY FOR JSON;
        """
        return query
    
    def _get_trigger_name(self, table_name: str, trigger_type: TriggerType) -> str:
        """Get the name of a trigger for a table."""
        # Sanitize table_name to be a valid trigger name (alphanumeric and underscores only)
        safe_table_name = re.sub(r'[^A-Za-z0-9_]', '_', table_name)
        # Ensure safe_table_name does not start with an underscore
        safe_table_name = safe_table_name.lstrip('_')
        if not safe_table_name:
            safe_table_name = "TABLE"
        return f"{safe_table_name}_{trigger_type.value.upper()}{self.TRIGGER_NAME_SUFFIX}"
    
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
            logger.warning(f"Error checking trigger existence: {e}")
            return False

    def _drop_trigger(self, cursor: dbapi.Cursor, table_name: str, trigger_type: TriggerType) -> None:
        """Drop a trigger."""
        trigger_name = self._get_trigger_name(table_name, trigger_type)
        try:
            cursor.execute(f"DROP TRIGGER {trigger_name}")
            logger.info(f"Dropped trigger {trigger_name}")
        except Exception as e:
            logger.warning(f"Could not drop trigger {trigger_name}: {e}")

    def _cleanup_table_cdc(self, cursor: dbapi.Cursor, table_name: str) -> None:
        """Clean up CDC infrastructure for a table (triggers)."""
        for trigger_type in TriggerType:
            self._drop_trigger(cursor, table_name, trigger_type)