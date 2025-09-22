"""SAP HANA database extractor for CDC."""

import asyncio
from enum import StrEnum, auto
import logging
from datetime import datetime
from typing import List, Optional, Dict, Any, Set
from tenacity import retry, stop_after_attempt, wait_exponential

import structlog
from hdbcli import dbapi

from .config import CDCConfig, ChangeType, SAPHanaConfig
from .models import ChangeEvent


logger = structlog.get_logger(__name__)

class TriggerType(StrEnum):
    INSERT = auto()
    UPDATE = auto()
    DELETE = auto()

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
    async def init_cdc(self, force_recreate: bool = False) -> None:
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
                await self._create_change_table(cursor, force_recreate)
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
                await self._add_table_cdc(tables_to_add, force_recreate)
                logger.info("Added CDC infrastructure", tables=list(tables_to_add))
            
            # Update monitored tables set
            self.monitored_tables = current_tables_set
            
            # If no changes, just ensure all tables have proper CDC setup
            if not tables_to_add and not tables_to_remove:
                await self._ensure_cdc_infrastructure(current_tables, force_recreate)
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
        
    async def _add_table_cdc(self, tables: Set[str], force_recreate: bool = False) -> None:
        """Add CDC infrastructure for new tables."""

        cursor = self.connection.cursor()
        
        try:
            for table in tables:
                await self._setup_table_cdc(cursor, table, force_recreate)
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
    
    async def _ensure_cdc_infrastructure(self, tables: List[str], force_recreate: bool = False) -> None:
        """Ensure CDC infrastructure exists for all tables."""
        cursor = self.connection.cursor()
        
        try:
            for table in tables:
                # Check if CDC infrastructure exists
                if await self._check_table_cdc_exists(cursor, table):
                    logger.debug(f"CDC infrastructure already exists for table: {table}")
                else:
                    await self._setup_table_cdc(cursor, table, force_recreate)
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
    
    async def _check_trigger_exists(self, cursor: dbapi.Cursor, table_name: str, trigger_type: TriggerType) -> bool:
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
            
            logger.debug(
                "Checked trigger existence",
                trigger_name=trigger_name,
                exists=exists
            )
            
            return exists
            
        except Exception as e:
            logger.debug(f"Error checking trigger existence {trigger_name}: {e}")
            return False
    
    async def _create_change_table(self, cursor: dbapi.Cursor, force_recreate: bool = False) -> None:
        """Create the single change table for all CDC changes."""
        change_table = self._get_change_table_name()
        
        # Check if table already exists
        if await self._check_change_table_exists(cursor):
            if force_recreate:
                cursor.execute(f"DROP TABLE {change_table}")
                logger.info(f"Dropped existing change table: {change_table}")
            else:
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
                NEW_VALUES NCLOB
            )
        """
        
        try:
            cursor.execute(create_change_table_sql)
            logger.info(
                "Successfully created change table",
                change_table=change_table,
                columns=[
                    "CHANGE_ID", "TABLE_SCHEMA", "TABLE_NAME", "CHANGE_TYPE",
                    "CHANGE_TIMESTAMP", "OLD_VALUES", "NEW_VALUES"
                ]
            )
        except Exception as e:
            logger.error(f"Failed to create change table {change_table}: {e}")
            raise
    
    async def _get_monitored_tables(self) -> List[str]:
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
        
        tables = [row[0] for row in await self._fetch_all(query, params)]
        
        # Filter out excluded tables
        tables = [t for t in tables if t not in self.cdc_config.exclude_tables]
        
        return tables
            
    
    async def _fetch_all(self, query: str, params: tuple) -> Any:
        cursor = self.connection.cursor()
        try:
            cursor.execute(query, params)
            return cursor.fetchall()
        finally:
            cursor.close()


    async def _get_table_columns(self, table_name: str) -> List[Dict[str, str]]:
        """Get column information for a table."""
        query = """
            SELECT COLUMN_NAME, DATA_TYPE_NAME, IS_NULLABLE
            FROM TABLE_COLUMNS 
            WHERE SCHEMA_NAME = ? AND TABLE_NAME = ?
            ORDER BY POSITION
        """
        
        columns = []
        for row in await self._fetch_all(query, (self.sap_config.schema, table_name)):
            columns.append({
                'name': row[0],
                'type': row[1],
                'nullable': row[2] == 'TRUE'
            })
        
        return columns
            
    
    async def _setup_table_cdc(self, cursor: dbapi.Cursor, table_name: str, force_recreate: bool = False) -> None:
        """Setup CDC for a specific table."""
        try:
            change_table = self._get_change_table_name()
            
            logger.info(
                "Setting up CDC infrastructure for table",
                table_name=table_name,
                change_table=change_table,
                change_types=[ct.value for ct in self.cdc_config.change_types]
            )
            
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
                await self._create_trigger(cursor, table_name, change_table, trigger_type, force_recreate)
        
            logger.info(
                "CDC setup complete for table",
                table_name=table_name,
                triggers_created=[ct.value for ct in self.cdc_config.change_types]
            )
            
        except Exception as e:
            logger.error(f"Failed to setup CDC for table {table_name}", error=str(e))
            raise
    
    async def _create_select_stmt(self, table_name: str, source_var: str, dest_var: str) -> str:
        """Create a SELECT statement for a table."""
        columns = await self._get_table_columns(table_name)
        if not columns:
            logger.warning(f"No columns found for table {table_name}, skipping trigger creation")
            return

        select_columns = ", ".join([f":{source_var}.\"{col['name']}\"" for col in columns])
        # SELECT new_row.* doesn't work
        query = f"""
                SELECT {select_columns} INTO {dest_var} FROM DUMMY FOR JSON;
        """

        return query
    

    async def _create_trigger(self, cursor: dbapi.Cursor, table_name: str, change_table: str, trigger_type: TriggerType, force_recreate: bool = False) -> None:
        """Create trigger for a table."""
        trigger_name = self._get_trigger_name(table_name, trigger_type)
        
        # Check if trigger already exists
        if await self._check_trigger_exists(cursor, table_name, trigger_type):
            if not force_recreate:
                logger.info(f"{trigger_type.value} trigger already exists: {trigger_name}")
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
                    {await self._create_select_stmt(table_name, "old_row", "old_json") if trigger_type != TriggerType.INSERT else ""}
                    {await self._create_select_stmt(table_name, "new_row", "new_json") if trigger_type != TriggerType.DELETE else ""}

                    INSERT INTO {change_table} (
                        TABLE_SCHEMA, TABLE_NAME, CHANGE_TYPE, OLD_VALUES, NEW_VALUES
                    ) VALUES (
                        '{self.sap_config.schema}',
                        '{table_name}',
                        '{trigger_type.value}',
                        :old_json,
                        :new_json
                    );
                END
            """
            cursor.execute(trigger_sql)
            logger.info(f"Successfully created {trigger_type.value} trigger: {trigger_name}")
            
        except Exception as e:
            logger.error(f"Failed to create {trigger_type.value} trigger {trigger_name}: {e}")
            raise

    def _get_trigger_name(self, table_name: str, trigger_type: TriggerType) -> str:
        """Get the name of a trigger for a table."""
        return f"{table_name}_{trigger_type.value.upper()}_TRIGGER"
    
    def _drop_trigger(self, cursor: dbapi.Cursor, table_name: str, trigger_type: TriggerType) -> None:
        """Drop a trigger."""
        trigger_name = self._get_trigger_name(table_name, trigger_type)
        logger.debug(f"Dropping {trigger_type.value} trigger for table: {table_name}: {trigger_name}")
        cursor.execute(f"DROP TRIGGER {trigger_name}")
        logger.info(f"Dropped trigger: {trigger_name}")

    async def _cleanup_table_cdc(self, cursor: dbapi.Cursor, table_name: str) -> None:
        """Clean up CDC infrastructure for a table (triggers)."""
        logger.info(f"Starting CDC cleanup for table: {table_name}")
        
        try:
            for trigger_type in TriggerType:
                self._drop_trigger(cursor, table_name, trigger_type)
                        
            logger.info(
                "CDC cleanup completed for table",
                table_name=table_name,
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
                NEW_VALUES
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
        for row in await self._fetch_all(query, params):
            change = ChangeEvent(
                event_id=str(row[0]),
                event_timestamp=row[4],
                change_type=ChangeType(row[3].upper()),
                schema_name=row[1],
                table_name=row[2],
                full_table_name=f"{row[1]}.{row[2]}",
                old_values=self._parse_json(row[5]) if row[5] else None,
                new_values=self._parse_json(row[6]) if row[6] else None,
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