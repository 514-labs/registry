#!/usr/bin/env python3
"""
Check test configuration and service availability.

Usage:
    python tests/check_test_config.py
"""
import os
import socket
import sys


def check_service(name: str, host: str, port: int) -> bool:
    """Check if a service is available."""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(2)
        result = sock.connect_ex((host, port))
        sock.close()
        if result == 0:
            print(f"✅ {name:20} AVAILABLE at {host}:{port}")
            return True
        else:
            print(f"❌ {name:20} NOT AVAILABLE at {host}:{port}")
            return False
    except Exception as e:
        print(f"❌ {name:20} ERROR: {e}")
        return False


def main():
    print("=" * 70)
    print("SAP HANA CDC Test Configuration Check")
    print("=" * 70)
    print()

    # Check environment variables
    print("Environment Variables:")
    print("-" * 70)
    integration_enabled = os.getenv("ENABLE_INTEGRATION_TESTS", "false").lower() in (
        "true",
        "1",
        "yes",
    )
    print(f"ENABLE_INTEGRATION_TESTS: {integration_enabled}")
    print(
        f"SAP_HANA_HOST:           {os.getenv('SAP_HANA_HOST', 'localhost')} (default: localhost)"
    )
    print(
        f"SAP_HANA_PORT:           {os.getenv('SAP_HANA_PORT', '39015')} (default: 39015)"
    )
    print(
        f"CLICKHOUSE_HOST:         {os.getenv('CLICKHOUSE_HOST', 'localhost')} (default: localhost)"
    )
    print(
        f"CLICKHOUSE_HTTP_PORT:    {os.getenv('CLICKHOUSE_HTTP_PORT', '8123')} (default: 8123)"
    )
    print()

    # Check service availability
    print("Service Availability:")
    print("-" * 70)
    sap_hana_host = os.getenv("SAP_HANA_HOST", "localhost")
    sap_hana_port = int(os.getenv("SAP_HANA_PORT", "39015"))
    clickhouse_host = os.getenv("CLICKHOUSE_HOST", "localhost")
    clickhouse_port = int(os.getenv("CLICKHOUSE_HTTP_PORT", "8123"))

    sap_hana_available = check_service("SAP HANA", sap_hana_host, sap_hana_port)
    clickhouse_available = check_service(
        "ClickHouse", clickhouse_host, clickhouse_port
    )
    print()

    # Test execution summary
    print("Test Execution Summary:")
    print("-" * 70)
    print(f"✅ Unit tests:          WILL RUN (always enabled)")

    if integration_enabled:
        if sap_hana_available:
            print(f"✅ Integration tests:   WILL RUN (enabled and services available)")
        else:
            print(
                f"⏭️  Integration tests:   WILL SKIP (enabled but services unavailable)"
            )
    else:
        print(f"⏭️  Integration tests:   WILL SKIP (disabled)")

    print()

    # Recommendations
    print("Recommendations:")
    print("-" * 70)
    if not integration_enabled:
        print("• To enable integration tests:")
        print("  export ENABLE_INTEGRATION_TESTS=true")
        print()

    if integration_enabled and not sap_hana_available:
        print("• To start SAP HANA Docker container:")
        print("  cd tests/fixtures")
        print("  docker-compose up -d")
        print("  docker-compose ps  # Wait for 'healthy' status (~5 minutes)")
        print()

    if not integration_enabled and not sap_hana_available:
        print("• You can run tests now with just unit tests (recommended):")
        print("  pytest")
        print()
        print("• Or start Docker and enable integration tests:")
        print("  cd tests/fixtures && docker-compose up -d")
        print("  cd ../.. && ENABLE_INTEGRATION_TESTS=true pytest")
        print()

    # Exit code
    print("=" * 70)
    if not integration_enabled:
        print("Status: Ready for unit tests ✅")
        print("(Integration tests will be skipped - this is expected)")
        return 0
    elif integration_enabled and sap_hana_available:
        print("Status: Ready for full test suite ✅")
        return 0
    else:
        print("Status: Ready for unit tests ✅")
        print("(Integration tests enabled but services unavailable)")
        return 0


if __name__ == "__main__":
    sys.exit(main())
