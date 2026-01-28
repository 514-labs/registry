# SAP HANA CDC Connector Tests

This directory contains the test suite for the SAP HANA CDC connector.

## Test Structure

```
tests/
├── __init__.py
├── conftest.py              # Pytest fixtures and configuration
├── test_config.py           # Tests for configuration module
├── test_models.py           # Tests for data models
├── test_infrastructure.py   # Tests for infrastructure management
├── test_reader.py           # Tests for data reader
└── test_connector.py        # Tests for high-level connector
```

## Running Tests

### Install Development Dependencies

First, install the package with development dependencies:

```bash
pip install -e ".[dev]"
```

Or using uv:

```bash
uv pip install -e ".[dev]"
```

### Run All Tests

```bash
pytest
```

### Run Specific Test Files

```bash
pytest tests/test_config.py
pytest tests/test_models.py
pytest tests/test_infrastructure.py
pytest tests/test_reader.py
pytest tests/test_connector.py
```

### Run Specific Test Classes or Methods

```bash
# Run a specific test class
pytest tests/test_config.py::TestSAPHanaCDCConfig

# Run a specific test method
pytest tests/test_config.py::TestSAPHanaCDCConfig::test_config_initialization
```

### Run Tests with Coverage

```bash
# Run with coverage report
pytest --cov=src/sap_hana_cdc --cov-report=term-missing

# Generate HTML coverage report
pytest --cov=src/sap_hana_cdc --cov-report=html
# Then open htmlcov/index.html in your browser
```

### Run Tests in Verbose Mode

```bash
pytest -v
```

### Run Tests with Output

```bash
pytest -s
```

## Test Coverage

The test suite covers:

- **Configuration Management** (`test_config.py`)
  - Config initialization with default and custom values
  - Environment variable parsing
  - Table name trimming and validation
  - Password masking in string representation

- **Data Models** (`test_models.py`)
  - ChangeEvent creation and manipulation
  - BatchChange operations
  - Trigger type and table status enums
  - Data serialization and diff generation

- **Infrastructure Management** (`test_infrastructure.py`)
  - CDC table creation
  - Trigger creation and management
  - Table and view detection
  - Status management
  - Infrastructure cleanup

- **Data Reader** (`test_reader.py`)
  - Change retrieval with pagination
  - Client status management
  - Table row reading
  - JSON parsing
  - Status and metrics retrieval
  - Data pruning

- **High-Level Connector** (`test_connector.py`)
  - Connector initialization
  - Factory methods (from_config, from_env)
  - CDC initialization and cleanup
  - Integration of infrastructure and reader components

## Writing New Tests

When adding new tests:

1. Use the fixtures defined in `conftest.py` for common test objects
2. Follow the existing naming conventions (`test_*`)
3. Use descriptive test names that explain what is being tested
4. Mock external dependencies (database connections, etc.)
5. Test both success and error cases

Example:

```python
def test_new_feature(
    mock_connection: Mock,
    sample_config: SAPHanaCDCConfig
) -> None:
    """Test description of what is being tested."""
    # Arrange
    # ... setup test data

    # Act
    # ... call the function being tested

    # Assert
    # ... verify the results
```

## Continuous Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: |
    pip install -e ".[dev]"
    pytest --cov=src/sap_hana_cdc --cov-report=xml
```
