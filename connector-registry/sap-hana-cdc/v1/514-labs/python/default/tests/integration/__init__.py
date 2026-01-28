"""Integration tests for SAP HANA CDC connector.

These tests require actual database connections and are SKIPPED by default.

To enable:
    export ENABLE_INTEGRATION_TESTS=true
    docker-compose -f tests/fixtures/docker-compose.yml up -d
    pytest -m integration
"""
