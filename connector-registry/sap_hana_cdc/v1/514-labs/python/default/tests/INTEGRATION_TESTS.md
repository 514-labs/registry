# Integration Tests - Gating and Configuration

## Why Are Integration Tests Gated?

Integration tests for SAP HANA CDC require actual SAP HANA database connections, which present several challenges:

### The Problem
1. **SAP HANA Express Docker is resource-intensive**
   - Requires 8GB+ RAM
   - Takes 5+ minutes to start
   - Requires special licensing agreement

2. **Not available in most CI/CD environments**
   - GitHub Actions free tier has memory limits
   - Many CI systems can't run SAP HANA
   - Would slow down all PR checks

3. **Most development work doesn't need it**
   - Unit tests validate 90% of functionality
   - Integration tests needed only for database-specific features
   - Connection logic tested with mocks in unit tests

### The Solution
**Integration tests are SKIPPED by default** and require explicit opt-in:
- Environment variable: `ENABLE_INTEGRATION_TESTS=true`
- Service availability check (automatic)
- Clear skip messages explaining why

## How Gating Works

### Three Levels of Protection

#### Level 1: Environment Variable Gate
```python
ENABLE_INTEGRATION_TESTS = os.getenv("ENABLE_INTEGRATION_TESTS", "false").lower() in (
    "true", "1", "yes"
)
```
Default is `false` - integration tests won't run unless explicitly enabled.

#### Level 2: Service Availability Check
```python
def _is_service_available(host: str, port: int) -> bool:
    """Check if a service is available at host:port."""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(2)
        result = sock.connect_ex((host, port))
        return result == 0
    except Exception:
        return False
```
Even if enabled, tests skip if SAP HANA isn't actually reachable.

#### Level 3: Pytest Skip Markers
```python
@pytest.mark.integration
@pytest.mark.requires_sap_hana
@skip_integration_not_enabled
@skip_sap_hana_unavailable
def test_something():
    ...
```
Tests are decorated with multiple skip conditions.

## Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ENABLE_INTEGRATION_TESTS` | `false` | Master switch for integration tests |
| `SAP_HANA_HOST` | `localhost` | SAP HANA hostname |
| `SAP_HANA_PORT` | `39015` | SAP HANA SQL/MDX port |
| `CLICKHOUSE_HOST` | `localhost` | ClickHouse hostname |
| `CLICKHOUSE_HTTP_PORT` | `8123` | ClickHouse HTTP port |

### Usage Examples

#### Default Behavior (Integration Tests Skipped)
```bash
# Just run tests
pytest

# Output shows:
# - Unit tests: PASSED
# - Integration tests: SKIPPED (Integration tests disabled...)
```

#### Enable with Local Docker
```bash
# Start containers
cd tests/fixtures
docker-compose up -d

# Enable and run
cd ../..
ENABLE_INTEGRATION_TESTS=true pytest -m integration -v
```

#### Enable with Remote SAP HANA
```bash
export ENABLE_INTEGRATION_TESTS=true
export SAP_HANA_HOST=sap-dev.example.com
export SAP_HANA_PORT=30015

pytest -m integration -v
```

#### Check Configuration
```bash
# See what would run (verbose mode shows config)
pytest -v --collect-only

# Output:
# ============================================================
# SAP HANA CDC Test Configuration
# ============================================================
# Integration tests enabled: False
# SAP HANA available: False (localhost:39015)
# ClickHouse available: False (localhost:8123)
# ============================================================
```

## Skip Messages

When integration tests are skipped, you'll see clear messages explaining why:

### Integration Tests Disabled
```
SKIPPED [1] tests/integration/test_sap_hana_connection.py:20:
Integration tests disabled. Set ENABLE_INTEGRATION_TESTS=true to enable.
```

### SAP HANA Not Available
```
SKIPPED [1] tests/integration/test_sap_hana_connection.py:20:
SAP HANA not available at localhost:39015. Start Docker containers or set SAP_HANA_HOST/PORT.
```

### ClickHouse Not Available
```
SKIPPED [1] tests/integration/test_clickhouse.py:15:
ClickHouse not available at localhost:8123. Start Docker containers.
```

## Writing Integration Tests

### Template
```python
import pytest
from tests.conftest import skip_integration_not_enabled, skip_sap_hana_unavailable

@pytest.mark.integration
@pytest.mark.requires_sap_hana
@skip_integration_not_enabled
@skip_sap_hana_unavailable
class TestMyIntegration:
    """Integration tests for my feature.

    NOTE: These tests are SKIPPED by default.
    To run: ENABLE_INTEGRATION_TESTS=true pytest
    """

    def test_something_with_real_database(self):
        """Test with actual SAP HANA connection."""
        # This only runs when:
        # 1. ENABLE_INTEGRATION_TESTS=true
        # 2. SAP HANA is available
        pass
```

### Available Skip Markers

Use these in your tests:

```python
from tests.conftest import (
    skip_integration_not_enabled,  # Skip if ENABLE_INTEGRATION_TESTS != true
    skip_sap_hana_unavailable,     # Skip if SAP HANA not reachable
    skip_clickhouse_unavailable,   # Skip if ClickHouse not reachable
)
```

### Pytest Markers

Apply these to your test classes/functions:

```python
@pytest.mark.integration         # Mark as integration test
@pytest.mark.requires_sap_hana   # Requires SAP HANA connection
@pytest.mark.requires_clickhouse # Requires ClickHouse connection
@pytest.mark.slow                # Long-running test
```

## CI/CD Integration

### GitHub Actions Example

#### Unit Tests Only (Fast, Always Run)
```yaml
name: Unit Tests
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.13'
      - run: pip install -e .[dev]
      - run: pytest -m unit -v
        # Integration tests automatically skipped
```

#### With Integration Tests (Nightly)
```yaml
name: Full Test Suite
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM daily
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
      - run: docker-compose -f tests/fixtures/docker-compose.yml up -d
      - run: sleep 300  # Wait for SAP HANA startup
      - run: pip install -e .[dev]
      - run: pytest -v
        env:
          ENABLE_INTEGRATION_TESTS: true
```

## Troubleshooting

### "Integration tests are disabled"
**Cause:** `ENABLE_INTEGRATION_TESTS` is not set to `true`

**Solution:**
```bash
export ENABLE_INTEGRATION_TESTS=true
pytest
```

### "SAP HANA not available at localhost:39015"
**Cause:** SAP HANA is not running or not accessible

**Solutions:**
1. Start Docker containers:
   ```bash
   cd tests/fixtures
   docker-compose up -d
   docker-compose ps  # Wait for "healthy" status
   ```

2. Point to existing SAP HANA:
   ```bash
   export SAP_HANA_HOST=your-server.com
   export SAP_HANA_PORT=30015
   ```

3. Check connectivity:
   ```bash
   nc -zv localhost 39015
   # or
   telnet localhost 39015
   ```

### "Tests pass but nothing actually tested"
**Cause:** All integration tests were skipped, only unit tests ran

**Solution:** This is expected! Check test output:
```
60 passed, 20 skipped in 10.5s
```
- 60 unit tests passed ✅
- 20 integration tests skipped (expected when disabled)

To run integration tests:
```bash
ENABLE_INTEGRATION_TESTS=true pytest -v
```

## Philosophy

### Why This Design?

1. **Developer Friendly**
   - New contributors can run tests immediately
   - No infrastructure setup required for most work
   - Fast feedback loop (unit tests in seconds)

2. **CI/CD Friendly**
   - Works in any CI environment
   - No expensive infrastructure for PR checks
   - Optional integration in nightly/scheduled runs

3. **Production Ready**
   - Integration tests available when needed
   - Real database validation for critical changes
   - Flexible deployment options

4. **Clear Communication**
   - Skip messages explain exactly what's needed
   - Configuration printed at test start
   - No mysterious failures

### Best Practices

- **Run unit tests frequently** (every commit)
- **Run integration tests occasionally** (before releases, major changes)
- **Don't require integration tests in CI** (keep PR checks fast)
- **Use integration tests for final validation** (before deploying)

## Summary

| Test Type | Default Behavior | When to Enable |
|-----------|-----------------|----------------|
| Unit | ✅ Always run | Always |
| Integration | ⏭️ Skipped | Before releases, debugging DB issues |
| Resilience | ⏭️ Skipped | Testing failure scenarios |

**The test suite is designed to be useful WITHOUT SAP HANA Docker, while still supporting full integration testing when needed.**
