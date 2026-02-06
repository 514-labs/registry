"""Data extraction logic for Wonderware Historian."""
import logging
from typing import List, Dict

from sqlalchemy import text, bindparam
from sqlalchemy.engine import Engine

logger = logging.getLogger(__name__)


class WonderwareReader:
    """Reader for querying Wonderware SQL Server historian."""

    def __init__(self, engine: Engine):
        """
        Initialize Wonderware reader.

        Args:
            engine: SQLAlchemy engine instance
        """
        self.engine = engine

    def discover_tags(self) -> List[str]:
        """
        Discover all active tags from Wonderware TagRef table.

        Returns:
            List of tag names (excludes System tags starting with 'Sys')

        Raises:
            Exception: If query fails
        """
        with self.engine.connect() as connection:
            query = text(
                'SELECT "TagName" FROM "TagRef" '
                'WHERE "TagType" = 1 AND "TagName" NOT LIKE \'Sys%\''
            )
            result = connection.execute(query)
            tags = [row[0] for row in result]

        logger.info(f"Discovered {len(tags)} tags from TagRef table")
        return tags

    def fetch_history_data(
        self,
        tag_names: List[str],
        date_from: str,
        date_to: str,
        inclusive_start: bool = True
    ) -> List[Dict]:
        """
        Fetch historical data from Wonderware History view.

        Args:
            tag_names: List of tag names to query
            date_from: Start datetime (ISO format)
            date_to: End datetime (ISO format)
            inclusive_start: If True, use BETWEEN (>=). If False, use > (exclusive start)

        Returns:
            List of row dictionaries with all history fields

        Raises:
            Exception: If query fails
        """
        if not tag_names:
            logger.warning("No tag names provided for history fetch")
            return []

        # Choose operator based on inclusive_start
        operator = "BETWEEN :min AND :max" if inclusive_start else "> :min AND <= :max"

        query = text(f'''
            SELECT
                DateTime, TagName, Value, VValue, Quality, QualityDetail, OpcQuality,
                wwTagKey, wwRowCount, wwResolution, wwEdgeDetection, wwRetrievalMode,
                wwTimeDeadband, wwValueDeadband, wwTimeZone, wwVersion, wwCycleCount,
                wwTimeStampRule, wwInterpolationType, wwQualityRule, wwStateCalc,
                StateTime, PercentGood, wwParameters, StartDateTime, SourceTag,
                SourceServer, wwFilter, wwValueSelector, wwMaxStates, wwOption,
                wwExpression, wwUnit
            FROM "History"
            WHERE
                "History"."TagName" IN :tagnames AND
                "History"."DateTime" {operator} AND
                "History"."Value" IS NOT NULL AND
                "History"."wwRetrievalMode" = 'Delta'
            ORDER BY "History"."DateTime" ASC
        ''').bindparams(
            bindparam("tagnames", tag_names, expanding=True),
            bindparam("min", date_from),
            bindparam("max", date_to)
        )

        with self.engine.connect() as connection:
            result = connection.execute(query)
            rows = [dict(row._mapping) for row in result]

        logger.debug(f"Fetched {len(rows)} rows for {len(tag_names)} tags from {date_from} to {date_to}")
        return rows

    def get_tag_count(self) -> int:
        """
        Get count of active tags.

        Returns:
            Number of active tags (excluding System tags)

        Raises:
            Exception: If query fails
        """
        with self.engine.connect() as connection:
            query = text(
                'SELECT COUNT(*) FROM "TagRef" '
                'WHERE "TagType" = 1 AND "TagName" NOT LIKE \'Sys%\''
            )
            result = connection.execute(query)
            count = result.scalar()

        logger.debug(f"Tag count: {count}")
        return count

    def test_connection(self) -> bool:
        """
        Test if connection to Wonderware is working.

        Returns:
            True if connection is valid, False otherwise
        """
        try:
            with self.engine.connect() as connection:
                connection.execute(text("SELECT 1"))
            logger.info("Connection test successful")
            return True
        except Exception as e:
            logger.error(f"Connection test failed: {e}")
            return False
