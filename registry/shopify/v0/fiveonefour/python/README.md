# Python Shopify Connector

A production-ready Python connector for Shopify's GraphQL Admin API, built according to the [API Connector Specification](../../../../../../apps/components-docs/content/docs/specifications/api-connector.mdx).

> Note: This release uses GraphQL as the only transport (no REST fallback). REST may be reintroduced later if needed.

## 🚀 Quick Start

### Prerequisites
- Python 3.12+ 
- pip (latest version)

### Environment variables (placeholders)

Set these before using the connector:

```bash
export SHOPIFY_SHOP="<your-store>.myshopify.com"       # REQUIRED
export SHOPIFY_API_VERSION="2025-07"                    # REQUIRED (pinned)
export SHOPIFY_ACCESS_TOKEN="<your-admin-api-access-token>"  # REQUIRED
```

### Development Environment Setup

1. **Clone and navigate to the project:**
   ```bash
   cd registry/shopify/v0/fiveonefour/python
   ```

2. **Create and activate virtual environment:**
   ```bash
   # Create virtual environment
   python3 -m venv venv
   
   # Activate on macOS/Linux
   source venv/bin/activate
   
   # Activate on Windows
   .\venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   # Install all dependencies (including dev tools)
   pip install -r requirements.txt
   ```

4. **Verify installation:**
   ```bash
   # Check Python version
   python --version  # Should show Python 3.12.x
   
   # Verify key packages
   python -c "import pydantic, requests, httpx, structlog; print('✅ All packages installed')"
   ```

### Development Workflow

```bash
# Always activate virtual environment before development
source venv/bin/activate

# Run all phase tests
python run_tests.py

# Run specific phase tests
python test/test_phase1.py  # Foundation & Core Interface
python test/test_phase2.py  # Authentication & Transport
python test/test_phase3.py  # Resilience & Rate Limiting
python test/test_phase4.py  # Pagination & Data Handling
python test/test_phase5.py  # Hooks & Observability
python test/test_phase6.py  # Main Connector Implementation

# Format code
black src/
isort src/

# Type checking
mypy src/

# Deactivate when done
deactivate
```

### Virtual Environment Management

- **Location**: `./venv/` (project-local, not committed to git)
- **Python Version**: 3.12.7
- **Activation**: Always activate before development work
- **Dependencies**: All managed through `requirements.txt`

**Note**: The virtual environment is not committed to version control. Each developer should create their own local environment.

## 📚 Documentation

- **[Documentation Index](docs/docs.md)** - Navigate to the information you need
- **[Getting Started](docs/getting-started.md)** - Setup your Shopify store and configure the connector
- **[Architecture](docs/architecture.md)** - Technical implementation details and API mapping
- **[Configuration](docs/configuration.md)** - Configuration options and examples
- **[Testing](docs/testing.md)** - Testing strategy and examples
- **[Why GraphQL?](docs/why-graphql.md)** - Our implementation approach and rationale

## 🧪 Testing

The connector implementation is organized into 6 phases, each with dedicated test files:

- **Phase 1**: Foundation & Core Interface (`test/test_phase1.py`)
- **Phase 2**: Authentication & Transport (`test/test_phase2.py`)
- **Phase 3**: Resilience & Rate Limiting (`test/test_phase3.py`)
- **Phase 4**: Pagination & Data Handling (`test/test_phase4.py`)
- **Phase 5**: Hooks & Observability (`test/test_phase5.py`)
- **Phase 6**: Main Connector Implementation (`test/test_phase6.py`)

**Run all tests:**
```bash
python run_tests.py
```

**Run specific phase:**
```bash
python test/test_phase6.py  # Test the complete connector
```

## ✨ Features

- **Read-only data extraction** for Products, Orders, Customers, Inventory, and more
- **Automatic pagination** via Shopify's Link headers
- **Built-in resilience** with retries, rate limiting, and circuit breaking
- **Standardized interface** compliant with our API connector specification
- **GraphQL under the hood** for better performance and future-proofing
- **Incremental extraction** support with bookmark management

## 🔧 Requirements

- Python 3.8+
- Shopify store with Admin API access
- Custom app with appropriate read scopes

## 📦 Installation

```bash
pip install shopify-connector
```