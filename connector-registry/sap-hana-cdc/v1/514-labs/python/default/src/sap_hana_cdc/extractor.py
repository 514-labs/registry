"""SAP HANA database extractor for CDC."""

import asyncio
import logging
from datetime import datetime
from typing import List, Optional, Dict, Any, Set
from tenacity import retry, stop_after_attempt, wait_exponential

import structlog
from hdbcli import dbapi

from .config import CDCConfig, ChangeType, SAPHanaConfig
from .models import ChangeEvent


logger = structlog.get_logger(__name__)


class SAPHanaExtractor:
    """Extracts change data from SAP HANA database."""
    
    def __init__(self, sap_config: SAPHanaConfig, cdc_config: CDCConfig):
        """Initialize the extractor.
        
        Args:
            sap_config: SAP HANA connection configuration
            cdc_config: CDC configuration
        """
        self.sap_config : SAPHanaConfig = sap_config
        self.cdc_config = cdc_config
        self.connection: Optional[dbapi.Connection] = None
        self.is_connected = False
        
        # Track monitored tables
        self.monitored_tables: Set[str] = set()
        
        logger.info(
            "SAP HANA Extractor initialized",
            host=sap_config.host,
            port=sap_config.port,
            database=sap_config.database,
            schema=sap_config.schema,
        )
        
        # Log CDC configuration details
        logger.info(
            "CDC Configuration",
            change_table_name=cdc_config.change_table_name,
            change_schema=cdc_config.change_schema or sap_config.schema,
            tables_to_monitor=cdc_config.tables,
            excluded_tables=cdc_config.exclude_tables,
            change_types=[ct.value for ct in cdc_config.change_types],
            batch_size=cdc_config.batch_size,
            poll_interval_ms=cdc_config.poll_interval_ms,
        )
    
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def init_cdc(self) -> None:
        """Initialize CDC infrastructure.
        
        This method will:
        1. Detect changes in the table list
        2. Add CDC infrastructure for new tables
        3. Remove CDC infrastructure for tables no longer monitored
        4. Update the monitored_tables set accordingly
        """
        logger.info("Initializing CDC infrastructure")
        try:
            if not self.connection:
                raise RuntimeError("Not connected to database")
            
            # Ensure change table exists
            cursor = self.connection.cursor()
            try:
                await self._create_change_table(cursor)
            finally:
                cursor.close()
            
            # Get current list of tables to monitor
            current_tables = await self._get_monitored_tables()
            current_tables_set = set(current_tables)
            
            # Get previously monitored tables
            previously_monitored = set(self.monitored_tables)
            
            # Detect changes
            tables_to_add = current_tables_set - previously_monitored
            tables_to_remove = previously_monitored - current_tables_set
            
            logger.info(
                "CDC table changes detected",
                current_tables=list(current_tables_set),
                previously_monitored=list(previously_monitored),
                tables_to_add=list(tables_to_add),
                tables_to_remove=list(tables_to_remove),
            )
            
            # Remove CDC infrastructure for tables no longer monitored
            if tables_to_remove:
                await self._remove_table_cdc(tables_to_remove)
                logger.info("Removed CDC infrastructure", tables=list(tables_to_remove))
            
            # Add CDC infrastructure for new tables
            if tables_to_add:
                await self._add_table_cdc(tables_to_add)
                logger.info("Added CDC infrastructure", tables=list(tables_to_add))
            
            # Update monitored tables set
            self.monitored_tables = current_tables_set
            
            # If no changes, just ensure all tables have proper CDC setup
            if not tables_to_add and not tables_to_remove:
                await self._ensure_cdc_infrastructure(current_tables)
                logger.info("Verified CDC infrastructure for all tables")
            
            logger.info(
                "CDC infrastructure initialization complete",
                monitored_tables=list(self.monitored_tables),
            )
            
        except Exception as e:
            logger.error("Failed to initialize CDC infrastructure", error=str(e))
            raise
    
    async def connect(self) -> None:
        """Connect to SAP HANA database."""
        try:
            # Create connection
            self.connection = dbapi.connect(
                address=self.sap_config.host,
                port=self.sap_config.port,
                user=self.sap_config.user,
                password=self.sap_config.password,
                #databaseName=self.sap_config.database,
                autocommit=True,
            )
            
            self.is_connected = True
            
            logger.info("Connected to SAP HANA database")
            
        except Exception as e:
            logger.error("Failed to connect to SAP HANA", error=str(e))
            raise
    
    async def disconnect(self) -> None:
        """Disconnect from SAP HANA database."""
        if self.connection:
            try:
                self.connection.close()
                self.connection = None
                self.is_connected = False
                logger.info("Disconnected from SAP HANA database")
            except Exception as e:
                logger.error("Error disconnecting from SAP HANA", error=str(e))
    
    async def _setup_cdc_infrastructure(self) -> None:
        """Setup CDC infrastructure (triggers, single change table, etc.)."""        
        logger.info("Starting CDC infrastructure setup")
        cursor = self.connection.cursor()
        
        try:
            # Create single change table
            logger.info("Creating change table for CDC events")
            await self._create_change_table(cursor)
            
            # Get list of tables to monitor
            logger.info("Retrieving list of tables to monitor")
            tables = await self._get_monitored_tables()
            
            logger.info(
                "Found tables to monitor",
                table_count=len(tables),
                tables=tables
            )
            
            for table in tables:
                logger.info(f"Setting up CDC for table: {table}")
                await self._setup_table_cdc(cursor, table)
                self.monitored_tables.add(table)
                logger.info(f"Successfully configured CDC for table: {table}")
            
            logger.info(
                "CDC infrastructure setup complete",
                monitored_tables=list(self.monitored_tables),
                change_table=self._get_change_table_name(),
                total_tables=len(self.monitored_tables),
            )
            
        finally:
            cursor.close()
    
    async def _add_table_cdc(self, tables: Set[str]) -> None:
        """Add CDC infrastructure for new tables."""

        cursor = self.connection.cursor()
        
        try:
            for table in tables:
                await self._setup_table_cdc(cursor, table)
                logger.info(f"Added CDC infrastructure for table: {table}")
        finally:
            cursor.close()
    
    async def _remove_table_cdc(self, tables: Set[str]) -> None:
        """Remove CDC infrastructure for tables no longer monitored."""
        cursor = self.connection.cursor()
        
        try:
            for table in tables:
                await self._cleanup_table_cdc(cursor, table)
                logger.info(f"Removed CDC infrastructure for table: {table}")
        finally:
            cursor.close()
    
    async def _ensure_cdc_infrastructure(self, tables: List[str]) -> None:
        """Ensure CDC infrastructure exists for all tables."""
        cursor = self.connection.cursor()
        
        try:
            for table in tables:
                # Check if CDC infrastructure exists
                if await self._check_table_cdc_exists(cursor, table):
                    logger.debug(f"CDC infrastructure already exists for table: {table}")
                else:
                    await self._setup_table_cdc(cursor, table)
                    logger.info(f"Created missing CDC infrastructure for table: {table}")
        finally:
            cursor.close()
    
    def _get_change_table_name(self) -> str:
        """Get the full name of the change table."""
        schema = self.cdc_config.change_schema or self.sap_config.schema
        return f"{schema}.{self.cdc_config.change_table_name}"
    
    async def _check_change_table_exists(self, cursor: dbapi.Cursor) -> bool:
        """Check if the change table already exists."""
        change_table = self._get_change_table_name()
        schema = self.cdc_config.change_schema or self.sap_config.schema
        table_name = self.cdc_config.change_table_name
        
        try:
            cursor.execute("""
                SELECT COUNT(*) 
                FROM TABLES 
                WHERE SCHEMA_NAME = ? AND TABLE_NAME = ?
            """, (schema, table_name))
            
            result = cursor.fetchone()
            exists = result[0] > 0 if result else False
            
            logger.debug(
                "Checked change table existence",
                change_table=change_table,
                exists=exists
            )
            
            return exists
            
        except Exception as e:
            logger.debug(f"Error checking change table existence: {e}")
            return False
    
    async def _check_trigger_exists(self, cursor: dbapi.Cursor, trigger_name: str) -> bool:
        """Check if a trigger already exists."""
        try:
            cursor.execute("""
                SELECT COUNT(*) 
                FROM TRIGGERS 
                WHERE TRIGGER_NAME = ?
            """, (trigger_name,))
            
            result = cursor.fetchone()
            exists = result[0] > 0 if result else False
            
            logger.debug(
                "Checked trigger existence",
                trigger_name=trigger_name,
                exists=exists
            )
            
            return exists
            
        except Exception as e:
            logger.debug(f"Error checking trigger existence {trigger_name}: {e}")
            return False
    
    async def _create_change_table(self, cursor: dbapi.Cursor) -> None:
        """Create the single change table for all CDC changes."""
        change_table = self._get_change_table_name()
        
        # Check if table already exists
        if await self._check_change_table_exists(cursor):
            logger.info(f"Change table already exists: {change_table}")
            return
        
        logger.info(
            "Creating change table for CDC events",
            change_table=change_table,
            schema=self.cdc_config.change_schema or self.sap_config.schema
        )
        
        create_change_table_sql = f"""
            CREATE TABLE {change_table} (
                CHANGE_ID BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                TABLE_SCHEMA VARCHAR(128) NOT NULL,
                TABLE_NAME VARCHAR(128) NOT NULL,
                CHANGE_TYPE VARCHAR(10) NOT NULL,
                CHANGE_TIMESTAMP TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                OLD_VALUES NCLOB,
                NEW_VALUES NCLOB,
                TRANSACTION_ID VARCHAR(100),
                SEQUENCE_NUMBER BIGINT,
                PRIMARY_KEY_VALUES NCLOB
            )
        """
        
        try:
            cursor.execute(create_change_table_sql)
            logger.info(
                "Successfully created change table",
                change_table=change_table,
                columns=[
                    "CHANGE_ID", "TABLE_SCHEMA", "TABLE_NAME", "CHANGE_TYPE",
                    "CHANGE_TIMESTAMP", "OLD_VALUES", "NEW_VALUES", 
                    "TRANSACTION_ID", "SEQUENCE_NUMBER", "PRIMARY_KEY_VALUES"
                ]
            )
        except Exception as e:
            logger.error(f"Failed to create change table {change_table}: {e}")
            raise
    
    async def _get_monitored_tables(self) -> List[str]:
        """Get list of tables to monitor for changes."""
        cursor = self.connection.cursor()
        
        try:
            # Build query based on table selection
            if "*" in self.cdc_config.tables:
                # Get all tables in schema
                query = """
                    SELECT TABLE_NAME 
                    FROM TABLES 
                    WHERE SCHEMA_NAME = ?
                """
                cursor.execute(query, (self.sap_config.schema,))
            else:
                # Get specific tables
                placeholders = ",".join(["?" for _ in self.cdc_config.tables])
                query = f"""
                    SELECT TABLE_NAME 
                    FROM TABLES 
                    WHERE SCHEMA_NAME = ? 
                    AND TABLE_NAME IN ({placeholders})
                """
                cursor.execute(query, [self.sap_config.schema] + self.cdc_config.tables)
            
            tables = [row[0] for row in cursor.fetchall()]
            
            # Filter out excluded tables
            tables = [t for t in tables if t not in self.cdc_config.exclude_tables]
            
            return tables
            
        finally:
            cursor.close()
    
    async def _get_table_columns(self, table_name: str) -> List[Dict[str, str]]:
        """Get column information for a table."""
        cursor = self.connection.cursor()
        
        try:
            query = """
                SELECT COLUMN_NAME, DATA_TYPE_NAME, IS_NULLABLE
                FROM TABLE_COLUMNS 
                WHERE SCHEMA_NAME = ? AND TABLE_NAME = ?
                ORDER BY POSITION
            """
            cursor.execute(query, (self.sap_config.schema, table_name))
            
            columns = []
            for row in cursor.fetchall():
                columns.append({
                    'name': row[0],
                    'type': row[1],
                    'nullable': row[2] == 'TRUE'
                })
            
            return columns
            
        finally:
            cursor.close()
    
    async def _setup_table_cdc(self, cursor: dbapi.Cursor, table_name: str) -> None:
        """Setup CDC for a specific table."""
        try:
            change_table = self._get_change_table_name()
            
            logger.info(
                "Setting up CDC infrastructure for table",
                table_name=table_name,
                change_table=change_table,
                change_types=[ct.value for ct in self.cdc_config.change_types]
            )
            
            # Create sequence for the table
            await self._create_sequence(cursor, table_name)
            
            # Create trigger for INSERT
            if ChangeType.INSERT in self.cdc_config.change_types:
                logger.info(f"Creating INSERT trigger for table: {table_name}")
                await self._create_insert_trigger(cursor, table_name, change_table)
            
            # Create trigger for UPDATE
            if ChangeType.UPDATE in self.cdc_config.change_types:
                logger.info(f"Creating UPDATE trigger for table: {table_name}")
                await self._create_update_trigger(cursor, table_name, change_table)
            
            # Create trigger for DELETE
            if ChangeType.DELETE in self.cdc_config.change_types:
                logger.info(f"Creating DELETE trigger for table: {table_name}")
                await self._create_delete_trigger(cursor, table_name, change_table)
            
            logger.info(
                "CDC setup complete for table",
                table_name=table_name,
                triggers_created=[ct.value for ct in self.cdc_config.change_types]
            )
            
        except Exception as e:
            logger.error(f"Failed to setup CDC for table {table_name}", error=str(e))
            raise
    
    
    async def _create_sequence(self, cursor: dbapi.Cursor, table_name: str) -> None:
        """Create sequence for a table."""
        sequence_name = f"{table_name}_SEQ"
        sequence_schema = self.cdc_config.change_schema or self.sap_config.schema
        full_sequence_name = f"{sequence_schema}.{sequence_name}"
        
        try:
            # Check if sequence already exists
            cursor.execute("""
                SELECT COUNT(*) 
                FROM SEQUENCES 
                WHERE SCHEMA_NAME = ? AND SEQUENCE_NAME = ?
            """, (sequence_schema, sequence_name))
            
            result = cursor.fetchone()
            if result and result[0] > 0:
                logger.info(f"Sequence already exists: {full_sequence_name}")
                return
            
            # Create sequence
            sequence_sql = f"CREATE SEQUENCE {full_sequence_name} START WITH 1 INCREMENT BY 1"
            cursor.execute(sequence_sql)
            logger.info(f"Created sequence: {full_sequence_name}")
            
        except Exception as e:
            logger.warning(f"Could not create sequence {full_sequence_name}: {e}")
    
    async def _create_insert_trigger(self, cursor: dbapi.Cursor, table_name: str, change_table: str) -> None:
        """Create INSERT trigger for a table."""
        trigger_name = f"{table_name}_INSERT_TRIGGER"
        sequence_schema = self.cdc_config.change_schema or self.sap_config.schema
        full_sequence_name = f"{sequence_schema}.{table_name}_SEQ"
        
        # Check if trigger already exists
        if await self._check_trigger_exists(cursor, trigger_name):
            logger.info(f"INSERT trigger already exists: {trigger_name}")
            return
        
        # Get table columns to build proper JSON
        columns = await self._get_table_columns(table_name)
        if not columns:
            logger.warning(f"No columns found for table {table_name}, skipping trigger creation")
            return
        
        # Build JSON object with all columns using string concatenation
        json_parts = []
        for i, col in enumerate(columns):
            col_name = col["name"]
            json_parts.append(f"SELECT 1 as ord, '{col_name}' as col_name, :new_row.\"{col_name}\" as col_value, 'STR' as col_type FROM SYS.DUMMY")
        
        row_kv_select = " UNION ALL ".join(json_parts)

        json_sql = f"""
        WITH kv AS (
            SELECT STRING_AGG(
                '\"' || col_name || '\":' || 
                CASE 
                    WHEN col_value IS NULL THEN 'null'
                    WHEN col_type = 'NUM' THEN col_value
                    ELSE '\"' || REPLACE(REPLACE(col_value, '\\', '\\\\'), '\"', '\\\"') || '\"'
                END, 
                ',' 
                ORDER BY ord
            ) as json_content
            FROM ( {row_kv_select} )
        )
        SELECT '{' || json_content || '}' INTO json_data FROM kv;      
        """
        
        try:
            quoted_table_name = f'"{table_name}"'
            quoted_schema_name = f'"{self.sap_config.schema}"'
            trigger_sql = f"""
                CREATE TRIGGER {trigger_name}
                AFTER INSERT ON {quoted_schema_name}.{quoted_table_name}
                REFERENCING NEW ROW AS new_row
                FOR EACH ROW
                BEGIN
                    DECLARE json_data NCLOB;
                    {json_sql}
                    INSERT INTO {change_table} (
                        TABLE_SCHEMA, TABLE_NAME, CHANGE_TYPE, OLD_VALUES, NEW_VALUES, 
                        TRANSACTION_ID, SEQUENCE_NUMBER, PRIMARY_KEY_VALUES
                    ) VALUES (
                        '{self.sap_config.schema}',
                        '{table_name}',
                        'INSERT',
                        NULL,
                        TO_NCLOB(json_data),
                        CURRENT_UPDATE_TRANSACTION(),
                        {full_sequence_name}.NEXTVAL,
                        TO_NCLOB(json_data)
                    );
                END
            """
            cursor.execute(trigger_sql)
            logger.info(f"Successfully created INSERT trigger: {trigger_name}")
            
        except Exception as e:
            logger.error(f"Failed to create INSERT trigger {trigger_name}: {e}")
            await self._log_problematic_sql_parts_from_error(e, trigger_sql)
            raise
    
    async def _create_update_trigger(self, cursor: dbapi.Cursor, table_name: str, change_table: str) -> None:
        """Create UPDATE trigger for a table."""
        trigger_name = f"{table_name}_UPDATE_TRIGGER"
        sequence_schema = self.cdc_config.change_schema or self.sap_config.schema
        full_sequence_name = f"{sequence_schema}.{table_name}_SEQ"
        
        # Check if trigger already exists
        if await self._check_trigger_exists(cursor, trigger_name):
            logger.info(f"UPDATE trigger already exists: {trigger_name}")
            return
        
        # Get table columns to build proper JSON
        columns = await self._get_table_columns(table_name)
        if not columns:
            logger.warning(f"No columns found for table {table_name}, skipping trigger creation")
            return
        
        # Build JSON objects for old and new values using the new approach
        old_json_parts = []
        new_json_parts = []
        
        for i, col in enumerate(columns):
            col_name = col["name"]
            old_json_parts.append(f"SELECT {i+1} as ord, '{col_name}' as col_name, :old_row.\"{col_name}\" as col_value, 'STR' as col_type FROM SYS.DUMMY")
            new_json_parts.append(f"SELECT {i+1} as ord, '{col_name}' as col_name, :new_row.\"{col_name}\" as col_value, 'STR' as col_type FROM SYS.DUMMY")
        
        old_row_kv_select = " UNION ALL ".join(old_json_parts)
        new_row_kv_select = " UNION ALL ".join(new_json_parts)

        old_json_sql = f"""
        WITH kv AS (
            SELECT STRING_AGG(
                '\"' || col_name || '\":' || 
                CASE 
                    WHEN col_value IS NULL THEN 'null'
                    WHEN col_type = 'NUM' THEN col_value
                    ELSE '\"' || REPLACE(REPLACE(col_value, '\\', '\\\\'), '\"', '\\\"') || '\"'
                END, 
                ',' 
                ORDER BY ord
            ) as json_content
            FROM ( {old_row_kv_select} )
        )
        SELECT '{' || json_content || '}' INTO old_json_data FROM kv;      
        """

        new_json_sql = f"""
        WITH kv AS (
            SELECT STRING_AGG(
                '\"' || col_name || '\":' || 
                CASE 
                    WHEN col_value IS NULL THEN 'null'
                    WHEN col_type = 'NUM' THEN col_value
                    ELSE '\"' || REPLACE(REPLACE(col_value, '\\', '\\\\'), '\"', '\\\"') || '\"'
                END, 
                ',' 
                ORDER BY ord
            ) as json_content
            FROM ( {new_row_kv_select} )
        )
        SELECT '{' || json_content || '}' INTO new_json_data FROM kv;      
        """
        
        try:
            quoted_table_name = f'"{table_name}"'
            quoted_schema_name = f'"{self.sap_config.schema}"'
            trigger_sql = f"""
                CREATE TRIGGER {trigger_name}
                AFTER UPDATE ON {quoted_schema_name}.{quoted_table_name}
                REFERENCING OLD ROW AS old_row, NEW ROW AS new_row
                FOR EACH ROW
                BEGIN
                    DECLARE old_json_data NCLOB;
                    DECLARE new_json_data NCLOB;
                    {old_json_sql}
                    {new_json_sql}
                    INSERT INTO {change_table} (
                        TABLE_SCHEMA, TABLE_NAME, CHANGE_TYPE, OLD_VALUES, NEW_VALUES, 
                        TRANSACTION_ID, SEQUENCE_NUMBER, PRIMARY_KEY_VALUES
                    ) VALUES (
                        '{self.sap_config.schema}',
                        '{table_name}',
                        'UPDATE',
                        TO_NCLOB(old_json_data),
                        TO_NCLOB(new_json_data),
                        CURRENT_UPDATE_TRANSACTION(),
                        {full_sequence_name}.NEXTVAL,
                        TO_NCLOB(new_json_data)
                    );
                END
            """
            
            cursor.execute(trigger_sql)
            logger.info(f"Successfully created UPDATE trigger: {trigger_name}")
            
        except Exception as e:
            logger.error(f"Failed to create UPDATE trigger {trigger_name}: {e}")
            await self._log_problematic_sql_parts_from_error(e, trigger_sql)
            raise
    
    async def _create_delete_trigger(self, cursor: dbapi.Cursor, table_name: str, change_table: str) -> None:
        """Create DELETE trigger for a table."""
        trigger_name = f"{table_name}_DELETE_TRIGGER"
        sequence_schema = self.cdc_config.change_schema or self.sap_config.schema
        full_sequence_name = f"{sequence_schema}.{table_name}_SEQ"
        
        # Check if trigger already exists
        if await self._check_trigger_exists(cursor, trigger_name):
            logger.info(f"DELETE trigger already exists: {trigger_name}")
            return
        
        # Get table columns to build proper JSON
        columns = await self._get_table_columns(table_name)
        if not columns:
            logger.warning(f"No columns found for table {table_name}, skipping trigger creation")
            return
        
        # Build JSON object for old values using the new approach
        old_json_parts = []
        for i, col in enumerate(columns):
            col_name = col["name"]
            old_json_parts.append(f"SELECT {i+1} as ord, '{col_name}' as col_name, :old_row.\"{col_name}\" as col_value, 'STR' as col_type FROM SYS.DUMMY")
        
        old_row_kv_select = " UNION ALL ".join(old_json_parts)

        old_json_sql = f"""
        WITH kv AS (
            SELECT STRING_AGG(
                '\"' || col_name || '\":' || 
                CASE 
                    WHEN col_value IS NULL THEN 'null'
                    WHEN col_type = 'NUM' THEN col_value
                    ELSE '\"' || REPLACE(REPLACE(col_value, '\\', '\\\\'), '\"', '\\\"') || '\"'
                END, 
                ',' 
                ORDER BY ord
            ) as json_content
            FROM ( {old_row_kv_select} )
        )
        SELECT '{' || json_content || '}' INTO old_json_data FROM kv;      
        """
        
        try:
            quoted_table_name = f'"{table_name}"'
            quoted_schema_name = f'"{self.sap_config.schema}"'
            trigger_sql = f"""
                CREATE TRIGGER {trigger_name}
                AFTER DELETE ON {quoted_schema_name}.{quoted_table_name}
                REFERENCING OLD ROW AS old_row
                FOR EACH ROW
                BEGIN
                    DECLARE old_json_data NCLOB;
                    {old_json_sql}
                    INSERT INTO {change_table} (
                        TABLE_SCHEMA, TABLE_NAME, CHANGE_TYPE, OLD_VALUES, NEW_VALUES,
                        TRANSACTION_ID, SEQUENCE_NUMBER, PRIMARY_KEY_VALUES
                    ) VALUES (
                        '{self.sap_config.schema}',
                        '{table_name}',
                        'DELETE',
                        TO_NCLOB(old_json_data),
                        NULL,
                        CURRENT_UPDATE_TRANSACTION(),
                        {full_sequence_name}.NEXTVAL,
                        TO_NCLOB(old_json_data)
                    );
                END
            """
            
            cursor.execute(trigger_sql)
            logger.info(f"Successfully created DELETE trigger: {trigger_name}")
            
        except Exception as e:
            logger.error(f"Failed to create DELETE trigger {trigger_name}: {e}")
            await self._log_problematic_sql_parts_from_error(e, trigger_sql)
            raise
    
    async def _cleanup_table_cdc(self, cursor: dbapi.Cursor, table_name: str) -> None:
        """Clean up CDC infrastructure for a table (triggers, sequence)."""
        logger.info(f"Starting CDC cleanup for table: {table_name}")
        
        try:
            # Drop triggers
            triggers = [
                f"{table_name}_INSERT_TRIGGER",
                f"{table_name}_UPDATE_TRIGGER", 
                f"{table_name}_DELETE_TRIGGER"
            ]
            
            dropped_triggers = []
            for trigger_name in triggers:
                try:
                    cursor.execute(f"DROP TRIGGER {trigger_name}")
                    dropped_triggers.append(trigger_name)
                    logger.info(f"Dropped trigger: {trigger_name}")
                except Exception as e:
                    # Trigger might not exist, log but don't fail
                    logger.debug(f"Could not drop trigger {trigger_name}: {e}")
            
            # Drop sequence
            sequence_name = f"{table_name}_SEQ"
            sequence_schema = self.cdc_config.change_schema or self.sap_config.schema
            full_sequence_name = f"{sequence_schema}.{sequence_name}"
            try:
                cursor.execute(f"DROP SEQUENCE {full_sequence_name}")
                logger.info(f"Dropped sequence: {full_sequence_name}")
            except Exception as e:
                logger.debug(f"Could not drop sequence {full_sequence_name}: {e}")
            
            logger.info(
                "CDC cleanup completed for table",
                table_name=table_name,
                dropped_triggers=dropped_triggers,
                sequence_dropped=sequence_name
            )
                
        except Exception as e:
            logger.warning(f"Error during CDC cleanup for table {table_name}: {e}")
    
    async def _check_table_cdc_exists(self, cursor: dbapi.Cursor, table_name: str) -> bool:
        """Check if CDC infrastructure exists for a table."""
        try:
            # Check if at least one trigger exists for the table
            cursor.execute("""
                SELECT COUNT(*) 
                FROM TRIGGERS 
                WHERE SCHEMA_NAME = ? AND TRIGGER_NAME LIKE ?
            """, (self.sap_config.schema, f"{table_name}_%_TRIGGER"))
            
            result = cursor.fetchone()
            exists = result[0] > 0 if result else False
            
            logger.debug(
                "Checked CDC infrastructure existence",
                table_name=table_name,
                exists=exists,
                trigger_count=result[0] if result else 0
            )
            
            return exists
            
        except Exception as e:
            logger.debug(f"Error checking CDC existence for table {table_name}: {e}")
            return False
    
    async def get_changes(
        self, 
        since: Optional[datetime] = None, 
        limit: int = 1000
    ) -> List[ChangeEvent]:
        """Get changes from the database.
        
        Args:
            since: Get changes since this timestamp
            limit: Maximum number of changes to return
            
        Returns:
            List of change events
        """
        if not self.connection:
            raise RuntimeError("Not connected to database")
        
        cursor = self.connection.cursor()
        
        try:
            return await self._get_all_changes(cursor, since, limit)
            
        finally:
            cursor.close()
    
    async def _get_all_changes(
        self, 
        cursor: dbapi.Cursor, 
        since: Optional[datetime], 
        limit: int
    ) -> List[ChangeEvent]:
        """Get all changes from the single change table."""
        change_table = self._get_change_table_name()
        
        # Build query
        query = f"""
            SELECT 
                CHANGE_ID,
                TABLE_SCHEMA,
                TABLE_NAME,
                CHANGE_TYPE,
                CHANGE_TIMESTAMP,
                OLD_VALUES,
                NEW_VALUES,
                TRANSACTION_ID,
                SEQUENCE_NUMBER,
                PRIMARY_KEY_VALUES
            FROM {change_table}
        """
        
        params = []
        if since:
            query += " WHERE CHANGE_TIMESTAMP > ?"
            params.append(since)
        
        query += " ORDER BY CHANGE_TIMESTAMP ASC LIMIT ?"
        params.append(limit)
        
        cursor.execute(query, params)
        
        changes = []
        for row in cursor.fetchall():
            change = ChangeEvent(
                event_id=str(row[0]),
                event_timestamp=row[4],
                change_type=ChangeType(row[3]),
                schema_name=row[1],
                table_name=row[2],
                full_table_name=f"{row[1]}.{row[2]}",
                old_values=self._parse_json(row[5]) if row[5] else None,
                new_values=self._parse_json(row[6]) if row[6] else None,
                transaction_id=row[7],
                sequence_number=row[8],
                primary_key_values=self._parse_json(row[9]) if row[9] else None,
            )
            changes.append(change)
        
        return changes
    
    def _parse_json(self, json_str: str) -> Dict[str, Any]:
        """Parse JSON string to dictionary."""
        import json
        try:
            return json.loads(json_str) if json_str else {}
        except json.JSONDecodeError:
            logger.warning("Failed to parse JSON", json_str=json_str)
            return {}
    
    async def get_health_status(self) -> Dict[str, Any]:
        """Get health status of the extractor."""
        return {
            "is_connected": self.is_connected,
            "monitored_tables": list(self.monitored_tables),
            "connection_info": {
                "host": self.sap_config.host,
                "port": self.sap_config.port,
                "database": self.sap_config.database,
                "schema": self.sap_config.schema,
            },
        }

    async def _log_problematic_sql_parts_from_error(self, error: Exception, sql: str) -> None:
        """Log problematic SQL parts from an error."""
        r = r'at pos ([0-9]+)'
        import re
        match = re.search(r, str(error))
        if match:
            pos = int(match.group(1))
            logger.error("Failing sql part: " + sql[pos-100:pos+100])