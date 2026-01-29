# Pipeline Implementation Guide

This guide provides comprehensive instructions for adding new pipelines to the 514 Labs Pipeline Registry.

## Table of Contents

1. [Directory Structure](#directory-structure)
2. [Required Metadata Files](#required-metadata-files)
3. [Implementation Checklist](#implementation-checklist)
4. [File Templates](#file-templates)
5. [Naming Conventions](#naming-conventions)
6. [Common Patterns](#common-patterns)

---

## Directory Structure

Every pipeline follows this standardized structure:

```
pipeline-registry/
└── {pipeline_name}/                    # Snake_case for Python, kebab-case otherwise
    ├── _meta/
    │   ├── README.md                   # Brief overview and asset description
    │   ├── pipeline.json               # Root pipeline metadata
    │   └── assets/
    │       ├── from/
    │       │   ├── logo.png           # Source system logo
    │       │   └── README.md
    │       └── to/
    │           ├── logo.png           # Destination system logo
    │           └── README.md
    └── v1/                             # Version directory (v1, v2, etc.)
        ├── _meta/
        │   ├── README.md              # Full user documentation
        │   └── version.json           # Version metadata
        └── {author}/                   # Author/organization name
            ├── _meta/
            │   ├── README.md          # Author-specific overview
            │   ├── pipeline.json      # Detailed pipeline metadata
            │   ├── CHANGELOG.md       # Version history
            │   ├── LICENSE            # License file (usually MIT)
            │   └── assets/
            │       └── README.md
            └── {language}/             # python, typescript, etc.
                └── {implementation}/   # default, advanced, etc.
                    ├── README.md
                    ├── .gitignore
                    ├── .python-version      # For Python: "3.12"
                    ├── requirements.txt     # For Python
                    ├── setup.py            # For Python
                    ├── moose.config.toml   # Moose configuration
                    ├── template.config.toml # Template for new projects
                    ├── app/                # Main application code
                    ├── tests/              # Test files
                    ├── docs/
                    │   └── getting-started.md
                    ├── schemas/
                    │   └── index.json
                    └── lineage/
                        └── schemas/
                            ├── index.json
                            └── relational/
                                └── tables.json
```

---

## Required Metadata Files

### 1. Root `_meta/pipeline.json`

Location: `{pipeline_name}/_meta/pipeline.json`

```json
{
  "$schema": "https://schemas.connector-factory.dev/pipeline-root.schema.json",
  "name": "Human Readable Pipeline Name",
  "tags": ["source-system", "destination-system", "feature", "category"],
  "description": "Brief description of what this pipeline does.",
  "homepage": "",
  "registryUrl": "https://github.com/514-labs/registry/tree/main/pipeline-registry/{pipeline_name}"
}
```

**Required fields:**
- `name`: Human-readable name (Title Case)
- `tags`: Array of relevant tags (lowercase, kebab-case)
- `description`: One sentence description
- `registryUrl`: GitHub link to this pipeline

### 2. Version `v{N}/_meta/version.json`

Location: `{pipeline_name}/v1/_meta/version.json`

```json
{
  "name": "{pipeline_name}",
  "version": "v1",
  "status": "beta",
  "releasedAt": "YYYY-MM-DD",
  "notes": "Brief release notes highlighting key features"
}
```

**Status values:** `alpha`, `beta`, `stable`, `deprecated`

### 3. Author `v{N}/{author}/_meta/pipeline.json`

Location: `{pipeline_name}/v1/{author}/_meta/pipeline.json`

```json
{
  "$schema": "https://schemas.connector-factory.dev/pipeline.schema.json",
  "identifier": "{pipeline_name}",
  "name": "Human Readable Pipeline Name",
  "author": "{author}",
  "authorType": "organization",
  "version": "v1",
  "description": "Detailed description of pipeline features and capabilities",
  "tags": ["tag1", "tag2", "tag3"],
  "schedule": { "cron": "0 0 * * *", "timezone": "UTC" },
  "source": {
    "type": "database|files|api|stream",
    "format": "format-name",
    "location": "configurable|cloud|local"
  },
  "systems": [],
  "transformations": [],
  "destination": {
    "system": "destination-system",
    "database": "database-name",
    "table": "table_pattern"
  },
  "lineage": {
    "nodes": [
      { "id": "source", "kind": "source", "label": "Source System" },
      { "id": "transform", "kind": "transform", "label": "Transformation" },
      { "id": "dest", "kind": "destination", "label": "Destination" }
    ],
    "edges": [
      { "from": "source", "to": "transform", "label": "read" },
      { "from": "transform", "to": "dest", "label": "write" }
    ]
  },
  "maintainers": []
}
```

**authorType values:** `organization`, `individual`, `community`

### 4. Moose Configuration

Location: `{language}/{implementation}/moose.config.toml`

```toml
language = "Python"

[redpanda_config]
broker = "localhost:19092"
message_timeout_ms = 1000
retention_ms = 30000
replication_factor = 1

[clickhouse_config]
db_name = "local"
user = "panda"
password = "pandapass"
use_ssl = false
host = "localhost"
host_port = 18123
native_port = 9000

[http_server_config]
host = "localhost"
port = 4000
management_port = 5001

[redis_config]
url = "redis://127.0.0.1:6379"
key_prefix = "MS"

[git_config]
main_branch_name = "main"

[temporal_config]
db_user = "temporal"
db_password = "temporal"
db_port = 5432
temporal_host = "localhost"
temporal_port = 7233
temporal_version = "1.22.3"
admin_tools_version = "1.22.3"
ui_version = "2.21.3"
ui_port = 8081
ui_cors_origins = "http://localhost:3000"
config_path = "config/dynamicconfig/development-sql.yaml"
postgresql_version = "13"
client_cert = ""
client_key = ""
ca_cert = ""
api_key = ""

[supported_old_versions]

[authentication]

[features]
streaming_engine = true
workflows = true
data_model_v2 = true
```

**Important:** Use default ports (4000 for HTTP, 5001 for management).

### 5. Template Configuration

Location: `{language}/{implementation}/template.config.toml`

```toml
language = "python"
description = "Brief description of this pipeline"
post_install_print = """
Pipeline Name
---------------------------------------------------------

📂 Go to your project directory:
    $ cd {project_dir}

🥄 Create a virtual environment (optional, recommended):
    $ python3 -m venv .venv
    $ source .venv/bin/activate

📦 Install Dependencies:
    $ pip install -r ./requirements.txt

⚙️  Configure:
    Edit moose.config.toml or .env with your settings

🛠️  Start Moose Server:
    $ moose dev

📖 View Documentation:
    $ cat docs/getting-started.md

For more information, visit:
https://github.com/514-labs/registry/tree/main/pipeline-registry/{pipeline_name}
"""
default_sloan_telemetry="standard"
```

---

## Implementation Checklist

Use this checklist when implementing a new pipeline:

### Phase 1: Directory Setup
- [ ] Create root directory: `pipeline-registry/{pipeline_name}/`
- [ ] Create `_meta/` directories at all levels
- [ ] Create `_meta/assets/from/` and `_meta/assets/to/`
- [ ] Create version directory: `v1/`
- [ ] Create author directory: `v1/{author}/`
- [ ] Create implementation directory: `v1/{author}/{language}/{implementation}/`

### Phase 2: Metadata Files
- [ ] Create root `_meta/pipeline.json`
- [ ] Create root `_meta/README.md`
- [ ] Create version `_meta/version.json`
- [ ] Create version `_meta/README.md` (full documentation)
- [ ] Create author `_meta/pipeline.json`
- [ ] Create author `_meta/README.md` (quick start)
- [ ] Create author `_meta/CHANGELOG.md`
- [ ] Create author `_meta/LICENSE` (MIT)
- [ ] Create implementation `README.md`

### Phase 3: Assets
- [ ] Add source system logo to `_meta/assets/from/logo.png`
- [ ] Add destination system logo to `_meta/assets/to/logo.png`
- [ ] Create `_meta/assets/from/README.md`
- [ ] Create `_meta/assets/to/README.md`
- [ ] Create `_meta/assets/README.md` (author level)

### Phase 4: Implementation Code
- [ ] Copy or create pipeline code in `app/`
- [ ] Create tests in `tests/`
- [ ] Create `.gitignore`
- [ ] Create `requirements.txt` (Python) or `package.json` (TypeScript)
- [ ] Create `setup.py` (Python) or equivalent
- [ ] Create `.python-version` with "3.12" (Python only)
- [ ] Create/adjust `moose.config.toml` (use ports 4000/5001)
- [ ] Create `template.config.toml`

### Phase 5: Documentation
- [ ] Create `docs/getting-started.md`
- [ ] Create `schemas/index.json`
- [ ] Create `lineage/schemas/index.json`
- [ ] Create `lineage/schemas/relational/tables.json`
- [ ] Ensure all README files follow consistent format

### Phase 6: Verification
- [ ] Validate all JSON files are well-formed
- [ ] Ensure all `__init__.py` files are present (Python)
- [ ] Test that `moose dev` can start
- [ ] Verify imports work
- [ ] Check directory structure matches pattern
- [ ] Verify ports are set to defaults (4000/5001)

---

## File Templates

### Root README Template

```markdown
# {Pipeline Name}

This directory contains shared assets for the {Pipeline Name}.

## Assets

- `from/` - Source system assets ({Source System})
- `to/` - Destination system assets ({Destination System})

## Versions

- [v1](../v1/_meta/README.md) - {Brief description of v1}
```

### Version README Template

Use the comprehensive format from existing pipelines (see `sap_hana_cdc_to_clickhouse` or `qvd_to_clickhouse`).

Key sections:
- Features (bullet list)
- Prerequisites
- Installation (numbered steps)
- Usage (with code examples)
- Configuration (environment variables table)
- Troubleshooting (common issues)
- Support & Resources
- Deployment (mention Boreal)
- License

### Author README Template

```markdown
# {Pipeline Name}

> Maintained by {author}

{One sentence description}

## Overview

This Moose-based pipeline provides:
- **Feature 1** - description
- **Feature 2** - description
- **Feature 3** - description

## Quick Start

\`\`\`bash
# Install dependencies
pip install moose-cli
pip install -r requirements.txt

# Configure environment
export ENV_VAR_1=value1
export ENV_VAR_2=value2

# Initialize (if needed)
python init_script.py --setup

# Start pipeline
moose dev
\`\`\`

## Documentation

See the [full documentation](../../_meta/README.md) for detailed installation, configuration, and usage instructions.

## Available Implementations

- **{Language}** (default) - {Description}

## Support

- [Moose Documentation](https://docs.fiveonefour.com/moose)
- [Community Slack](https://join.slack.com/t/moose-community/shared_invite/zt-2fjh5n3wz-cnOmM9Xe9DYAgQrNu8xKxg)
- [Report Issues](https://github.com/514-labs/registry/issues)
```

### CHANGELOG Template

```markdown
# Changelog

All notable changes to the {Pipeline Name} will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1] - YYYY-MM-DD

### Added
- Initial release
- Feature 1
- Feature 2
- Feature 3

### Features
- Detailed feature descriptions

### Configuration
- Environment variable-based configuration
- Support for .env files
- Configurable parameters

### Documentation
- Comprehensive README with installation guide
- Quick start guide
- CLI tool documentation
- Troubleshooting section
```

### LICENSE Template (MIT)

```
MIT License

Copyright (c) {YEAR} {AUTHOR}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Naming Conventions

### Directory Names

| Type | Convention | Example |
|------|-----------|---------|
| Pipeline root | `snake_case` | `qvd_to_clickhouse` |
| Version | `v{number}` | `v1`, `v2` |
| Author | `kebab-case` or `name` | `514-labs`, `johndoe` |
| Language | `lowercase` | `python`, `typescript` |
| Implementation | `lowercase` | `default`, `advanced` |

### File Names

| Type | Convention | Example |
|------|-----------|---------|
| Metadata | `lowercase.json` | `pipeline.json`, `version.json` |
| Documentation | `UPPERCASE.md` or `lowercase.md` | `README.md`, `CHANGELOG.md`, `getting-started.md` |
| Python files | `snake_case.py` | `init_qvd.py`, `qvd_reader.py` |
| Config files | `lowercase.toml` or `.file` | `moose.config.toml`, `.gitignore` |

### Code Identifiers

- **Pipeline identifier**: Use `snake_case` matching directory name
- **Class names**: `PascalCase`
- **Function names**: `snake_case`
- **Environment variables**: `UPPER_SNAKE_CASE`
- **Tags**: `lowercase` or `kebab-case`

---

## Common Patterns

### Environment Variable Pattern

```python
# app/config/{pipeline}_config.py
import os
from dataclasses import dataclass

@dataclass
class PipelineConfig:
    source: str
    batch_size: int = 10000
    schedule: str = "@daily"

    @classmethod
    def from_env(cls):
        return cls(
            source=os.getenv("SOURCE_URL", ""),
            batch_size=int(os.getenv("BATCH_SIZE", "10000")),
            schedule=os.getenv("SCHEDULE", "@daily"),
        )
```

### Model Generation Pattern

```python
# app/utils/model_generator.py
from typing import List, Dict, Any
from pathlib import Path

class ModelGenerator:
    def __init__(self, output_path: str):
        self.output_path = Path(output_path)

    def generate_models(self, schemas: List[Dict[str, Any]]):
        """Generate Pydantic models from schemas"""
        models = []
        for schema in schemas:
            model = self._generate_model(schema)
            models.append(model)

        self._write_models(models)

    def _generate_model(self, schema: Dict[str, Any]) -> str:
        # Implementation here
        pass

    def _write_models(self, models: List[str]):
        with open(self.output_path, 'w') as f:
            f.write("# Auto-generated models\n\n")
            for model in models:
                f.write(model + "\n\n")
```

### File Tracking Pattern

```python
# app/utils/file_tracker.py
import json
from typing import Dict, Any
from pathlib import Path

class FileTracker:
    def __init__(self, state_file: str = ".pipeline_state.json"):
        self.state_file = Path(state_file)
        self.state = self._load_state()

    def _load_state(self) -> Dict[str, Any]:
        if self.state_file.exists():
            with open(self.state_file) as f:
                return json.load(f)
        return {"files": {}, "last_run": None}

    def _save_state(self):
        with open(self.state_file, 'w') as f:
            json.dump(self.state, f, indent=2)

    def should_process(self, file_path: str, metadata: Dict[str, Any]) -> bool:
        """Check if file should be processed based on metadata"""
        file_state = self.state["files"].get(file_path)
        if not file_state:
            return True

        # Compare metadata (mtime, size, etag, etc.)
        return metadata != file_state.get("metadata")

    def mark_processed(self, file_path: str, metadata: Dict[str, Any]):
        """Mark file as processed"""
        self.state["files"][file_path] = {
            "metadata": metadata,
            "processed_at": datetime.now().isoformat()
        }
        self._save_state()
```

### Workflow Pattern

```python
# app/workflows/pipeline_workflow.py
from moose_lib import workflow, task, TaskContext
from app.config.pipeline_config import PipelineConfig

@workflow(
    schedule=PipelineConfig.from_env().schedule,
    name="pipeline_sync"
)
def pipeline_workflow(ctx: TaskContext):
    """Main pipeline workflow"""
    sync_task(ctx)

@task
def sync_task(ctx: TaskContext):
    """Sync task implementation"""
    config = PipelineConfig.from_env()

    # Implementation here
    print(f"Starting sync from {config.source}")
```

### CLI Tool Pattern

```python
# init_pipeline.py
import argparse
from app.utils.model_generator import ModelGenerator

def main():
    parser = argparse.ArgumentParser(description="Pipeline management tool")
    parser.add_argument("--list-files", action="store_true")
    parser.add_argument("--generate-models", action="store_true")
    parser.add_argument("--source", required=True)
    parser.add_argument("--files", help="Comma-separated list")
    parser.add_argument("--exclude", help="Comma-separated list")
    parser.add_argument("--overwrite", action="store_true")

    args = parser.parse_args()

    if args.list_files:
        list_files(args.source)
    elif args.generate_models:
        generate_models(args.source, args.files, args.exclude, args.overwrite)

if __name__ == "__main__":
    main()
```

---

## Best Practices

### Documentation
- Keep README files concise but comprehensive
- Use code examples liberally
- Include troubleshooting sections
- Provide environment variable tables
- Link to external resources (Moose docs, Slack, etc.)

### Configuration
- Use environment variables for all configuration
- Provide sensible defaults
- Support `.env` files
- Document all configuration options

### Error Handling
- Provide clear error messages
- Log important events
- Handle edge cases gracefully
- Include retry logic for transient failures

### Testing
- Include unit tests for core functionality
- Provide integration test examples
- Document how to run tests

### Performance
- Use batch processing where appropriate
- Implement incremental updates
- Add configurable batch sizes
- Include performance tuning guidance

---

## Example: Adding a New Pipeline

Here's a complete example of adding a hypothetical "PostgreSQL to Snowflake" pipeline:

```bash
# 1. Create directory structure
mkdir -p pipeline-registry/postgresql_to_snowflake/{_meta/assets/{from,to},v1/{_meta,514-labs/{_meta/assets,python/default}}}

# 2. Create metadata files
# - pipeline-registry/postgresql_to_snowflake/_meta/pipeline.json
# - pipeline-registry/postgresql_to_snowflake/_meta/README.md
# - pipeline-registry/postgresql_to_snowflake/v1/_meta/version.json
# - pipeline-registry/postgresql_to_snowflake/v1/_meta/README.md
# - pipeline-registry/postgresql_to_snowflake/v1/514-labs/_meta/pipeline.json
# - pipeline-registry/postgresql_to_snowflake/v1/514-labs/_meta/README.md
# - pipeline-registry/postgresql_to_snowflake/v1/514-labs/_meta/CHANGELOG.md
# - pipeline-registry/postgresql_to_snowflake/v1/514-labs/_meta/LICENSE

# 3. Add logos
cp postgres_logo.png pipeline-registry/postgresql_to_snowflake/_meta/assets/from/logo.png
cp snowflake_logo.png pipeline-registry/postgresql_to_snowflake/_meta/assets/to/logo.png

# 4. Create implementation
cd pipeline-registry/postgresql_to_snowflake/v1/514-labs/python/default
# - Copy/create app/, tests/, docs/
# - Create requirements.txt, setup.py, .python-version
# - Create moose.config.toml, template.config.toml
# - Create README.md, .gitignore

# 5. Verify
moose dev
python -c "from app.main import *"
```

---

## Support

For questions or issues with pipeline implementation:

- [Moose Documentation](https://docs.fiveonefour.com/moose)
- [Community Slack](https://join.slack.com/t/moose-community/shared_invite/zt-2fjh5n3wz-cnOmM9Xe9DYAgQrNu8xKxg)
- [GitHub Issues](https://github.com/514-labs/registry/issues)
