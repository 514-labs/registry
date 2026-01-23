# SAP HANA CDC to ClickHouse Pipeline

This is a Python-based Moose pipeline that provides real-time Change Data Capture (CDC) from SAP HANA to ClickHouse.

## Workflows

### CDC Workflow (`cdc`)
- **Purpose**: Continuously syncs changes from SAP HANA to ClickHouse
- **Schedule**: Continuous (runs indefinitely)
- **Features**: 
  - Syncs new tables automatically
  - Processes CDC changes in real-time
  - Updates client status for tracking
  - Handles model generation for new tables

### Pruning Workflow (`prune_database`)
- **Purpose**: Maintains database performance by removing old CDC entries
- **Schedule**: Daily at midnight (`@daily`)
- **Features**:
  - Configurable retention period via `SAP_HANA_CDC_RETENTION_DAYS` (default: 7 days)
  - Comprehensive logging
  - Error handling with retries
  - Automatic cleanup of old change records

[![PyPI Version](https://img.shields.io/pypi/v/moose-cli?logo=python)](https://pypi.org/project/moose-cli/)
[![Moose Community](https://img.shields.io/badge/slack-moose_community-purple.svg?logo=slack)](https://join.slack.com/t/moose-community/shared_invite/zt-2fjh5n3wz-cnOmM9Xe9DYAgQrNu8xKxg)
[![Docs](https://img.shields.io/badge/quick_start-docs-blue.svg)](https://docs.fiveonefour.com/moose/getting-started/quickstart)
[![MIT license](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)

## Getting Started

### Prerequisites

* [Python](https://www.python.org/downloads/) (version 3.8+)
* SAP HANA database access
* ClickHouse database access
* [Moose CLI](https://docs.fiveonefour.com/moose/getting-started/quickstart)

### Installation

You can install this pipeline using either a **package-based** approach (simpler, recommended for production) or a **bundled** approach (better for development and customization).

#### Option A: Package-Based Installation (Recommended)

1. Install Moose CLI:
   ```bash
   pip install moose-cli
   ```

2. Install the SAP HANA CDC connector:
   ```bash
   # From PyPI (when published)
   pip install connectorsap-hana-cdc

   # OR from the 514 registry:
   bash -i <(curl https://registry.514.ai/install.sh) sap-hana-cdc v1 514-labs python default
   cd sap-hana-cdc && pip install -e .
   ```

3. Install pipeline dependencies:
   ```bash
   pip install -r requirements.txt
   ```

**Pros:** Simple, clean separation of concerns, easy updates
**Cons:** Requires publishing connector or manual installation

#### Option B: Bundled Installation (Development & Customization)

This approach bundles the connector code directly in your pipeline, allowing for easier customization and development.

**Quick Setup (Automated):**
```bash
./setup_bundled.sh
```

The script will automatically:
- Install the connector into `app/sap-hana-cdc`
- Create/update `pyproject.toml`
- Update `app/workflows/cdc.py` with path setup
- Install all dependencies

**Manual Setup:**

1. Install Moose CLI:
   ```bash
   pip install moose-cli
   ```

2. Bundle the connector into your pipeline:
   ```bash
   # Install the connector directly into the app directory
   bash -i <(curl https://registry.514.ai/install.sh) --dest app/sap-hana-cdc sap-hana-cdc v1 514-labs python default
   ```

3. Update your project to use the bundled connector:

   Create or update `pyproject.toml`:
   ```toml
   [project]
   name = "sap-hana-cdc-pipeline"
   version = "0.1.0"
   requires-python = ">=3.13"
   dependencies = [
       "clickhouse-connect==0.7.16",
       "moose-cli>=0.6.230",
       "moose-lib>=0.6.230",
       "connectorsap-hana-cdc @ file:///path/to/your/pipeline/app/sap-hana-cdc",
       # ... other dependencies from requirements.txt
   ]

   [build-system]
   requires = ["setuptools>=68", "wheel"]
   build-backend = "setuptools.build_meta"

   [tool.setuptools.packages.find]
   where = ["."]
   include = ["app*"]
   ```

4. Update `app/workflows/cdc.py` to add path setup (at the top of the file):
   ```python
   import sys
   from pathlib import Path

   # Add sap-hana-cdc module to Python path
   sap_hana_cdc_path = Path(__file__).parent.parent / "sap-hana-cdc" / "src"
   if str(sap_hana_cdc_path) not in sys.path:
       sys.path.insert(0, str(sap_hana_cdc_path))
   ```

5. Install dependencies:
   ```bash
   # Using uv (recommended)
   uv sync

   # OR using pip
   pip install -e .
   ```

**Pros:** Easy to customize connector, all code in one place, no external dependencies
**Cons:** More complex setup, must manually sync updates

### Configuration

1. Set up environment variables:
   ```bash
   # SAP HANA Configuration
   export SAP_HANA_HOST=your-hana-host
   export SAP_HANA_PORT=30015
   export SAP_HANA_USERNAME=your-username
   export SAP_HANA_PASSWORD=your-password
   export SAP_HANA_SOURCE_SCHEMA=your-schema
   export SAP_HANA_CDC_SCHEMA=your-schema
   export SAP_HANA_TABLES=TABLE1,TABLE2,TABLE3
   export SAP_HANA_CLIENT_ID=my_client
   
   # Optional: CDC Retention (default: 7 days)
   export SAP_HANA_CDC_RETENTION_DAYS=7
   ```

2. Initialize CDC infrastructure:
   ```bash
   python init_cdc.py --init-cdc --tables TABLE1,TABLE2,TABLE3
   ```

### Running the Pipeline

1. Start the CDC workflow: `moose dev`
2. The pipeline will automatically:
   - Sync new tables to ClickHouse
   - Process CDC changes in real-time
   - Clean up old entries daily

### Manual Operations

- **Generate Moose models**: `python init_cdc.py --recreate-moose-models --tables TABLE1,TABLE2`
- **Recreate CDC tables**: `python init_cdc.py --recreate-cdc-tables --tables TABLE1,TABLE2`
- **Initialize CDC**: `python init_cdc.py --init-cdc --tables TABLE1,TABLE2`

## Troubleshooting

### ImportError: cannot import name 'ChangeEvent' from 'sap_hana_cdc'

This means the connector isn't installed or not in your Python path.

**Solution for Package-Based Installation:**
```bash
pip install connectorsap-hana-cdc
# Or reinstall from registry
```

**Solution for Bundled Installation:**
1. Verify the connector is in `app/sap-hana-cdc/`
2. Ensure you've added the path setup in `app/workflows/cdc.py` (see Option B above)
3. Run `uv sync` or `pip install -e .` to install with the bundled connector

### ModuleNotFoundError: No module named 'hdbcli'

The SAP HANA client library isn't installed.

**Solution:**
```bash
pip install hdbcli>=2.20.0
```

### TypeError: ReplacingMergeTreeEngine.__init__() got an unexpected keyword argument 'version_column'

You're using an older version of the model syntax.

**Solution:**
Update your model definitions to use `ver` instead of `version_column`:
```python
# OLD (incorrect)
engine=ReplacingMergeTreeEngine(version_column="updated_at")

# NEW (correct)
engine=ReplacingMergeTreeEngine(ver="updated_at")
```

### Connection refused when running workflows

The SAP HANA database isn't accessible.

**Solution:**
1. Verify your SAP HANA environment variables are correct
2. Check network connectivity: `telnet $SAP_HANA_HOST $SAP_HANA_PORT`
3. Verify the database is running
4. Check firewall rules

### Running workflows directly with uv

If you want to run the CDC workflow directly:
```bash
# Package-based installation
uv run python app/workflows/cdc.py

# Bundled installation (requires proper pyproject.toml)
uv run app/workflows/cdc.py
```

## Learn More

To learn more about Moose, take a look at the following resources:

- [Moose Documentation](https://docs.fiveonefour.com/moose) - learn about Moose.
- [Sloan Documentation](https://docs.fiveonefour.com/sloan) - learn about Sloan, the MCP interface for data engineering.

## Community

You can join the Moose community [on Slack](https://join.slack.com/t/moose-community/shared_invite/zt-2fjh5n3wz-cnOmM9Xe9DYAgQrNu8xKxg). Check out the [MooseStack repo on GitHub](https://github.com/514-labs/moosestack).

## Deploy on Boreal

The easiest way to deploy your MooseStack Applications is to use [Boreal](https://www.fiveonefour.com/boreal) from 514 Labs, the creators of Moose.

[Sign up](https://www.boreal.cloud/sign-up).

## License

This template is MIT licensed.

