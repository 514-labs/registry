"""Integration tests for SAP HANA connection.

These tests are SKIPPED by default unless:
1. ENABLE_INTEGRATION_TESTS=true
2. SAP HANA is available at localhost:39015 (or SAP_HANA_HOST/PORT)

To run these tests:
    cd tests/fixtures
    docker-compose up -d
    cd ../..
    ENABLE_INTEGRATION_TESTS=true pytest tests/integration/test_sap_hana_connection.py -v
"""
import pytest
from hdbcli import dbapi

from sap_hana_cdc import SAPHanaCDCConfig
from tests.conftest import skip_integration_not_enabled, skip_sap_hana_unavailable


@pytest.mark.integration
@pytest.mark.requires_sap_hana
@skip_integration_not_enabled
@skip_sap_hana_unavailable
class TestSAPHanaConnection:
    """Test actual SAP HANA database connections.

    NOTE: These tests are SKIPPED by default.
    """

    def test_connect_to_sap_hana(self):
        """Test basic connection to SAP HANA."""
        config = SAPHanaCDCConfig(
            host="localhost",
            port=39015,
            user="SYSTEM",
            password="HXEHana1",
        )

        connection = dbapi.connect(
            address=config.host,
            port=config.port,
            user=config.user,
            password=config.password,
        )

        assert connection is not None
        connection.close()

    def test_execute_simple_query(self):
        """Test executing a simple query."""
        config = SAPHanaCDCConfig(
            host="localhost",
            port=39015,
            user="SYSTEM",
            password="HXEHana1",
        )

        connection = dbapi.connect(
            address=config.host,
            port=config.port,
            user=config.user,
            password=config.password,
        )

        cursor = connection.cursor()
        cursor.execute("SELECT 1 FROM DUMMY")
        result = cursor.fetchone()

        assert result is not None
        assert result[0] == 1

        cursor.close()
        connection.close()

    def test_create_and_drop_table(self):
        """Test creating and dropping a test table."""
        config = SAPHanaCDCConfig(
            host="localhost",
            port=39015,
            user="SYSTEM",
            password="HXEHana1",
        )

        connection = dbapi.connect(
            address=config.host,
            port=config.port,
            user=config.user,
            password=config.password,
        )

        cursor = connection.cursor()

        # Create test table
        cursor.execute("""
            CREATE TABLE SAPHANADB.TEST_INTEGRATION_TABLE (
                ID INTEGER PRIMARY KEY,
                NAME NVARCHAR(100)
            )
        """)

        # Verify table exists
        cursor.execute("""
            SELECT COUNT(*)
            FROM SYS.TABLES
            WHERE SCHEMA_NAME = 'SAPHANADB'
            AND TABLE_NAME = 'TEST_INTEGRATION_TABLE'
        """)
        assert cursor.fetchone()[0] == 1

        # Drop test table
        cursor.execute("DROP TABLE SAPHANADB.TEST_INTEGRATION_TABLE")

        cursor.close()
        connection.close()

    def test_connection_validation(self):
        """Test connection validation query."""
        config = SAPHanaCDCConfig(
            host="localhost",
            port=39015,
            user="SYSTEM",
            password="HXEHana1",
        )

        connection = dbapi.connect(
            address=config.host,
            port=config.port,
            user=config.user,
            password=config.password,
        )

        # This is the same query used by ConnectionPool for validation
        cursor = connection.cursor()
        cursor.execute("SELECT 1 FROM DUMMY")
        result = cursor.fetchone()
        assert result[0] == 1

        cursor.close()
        connection.close()
