# Configuration

## Environment variables
Add to `.env` (and export into your shell when running scripts):

```bash
SHOPIFY_SHOP=your-store.myshopify.com
SHOPIFY_API_VERSION=2025-07
SHOPIFY_ACCESS_TOKEN=shpat_xxx

# Moose
MOOSE_BASE_URL=http://localhost:4000
MOOSE_INGEST_MODEL=shopify_inventory_levels
LOG_LEVEL=INFO
```

Notes:
- `SHOPIFY_SHOP`: Shopify shop domain.
- `SHOPIFY_API_VERSION`: API version aligned with the connector (e.g., `2025-07`).
- `SHOPIFY_ACCESS_TOKEN`: Admin API access token for your dev app.
- `MOOSE_BASE_URL`: Moose dev server URL.
- `MOOSE_INGEST_MODEL`: Default ingestion model; can be overridden via `--model`.
- `LOG_LEVEL`: Controls script logging verbosity.

Export workflow:
```bash
set -a && source .env && set +a
```

## Required Shopify scopes
Grant at least read-only scopes to the Admin API app:
- `read_products`
- `read_inventory`
- `read_orders`
- `read_customers`

## Moose configuration
Ensure the Moose dev server is running locally and listening on `MOOSE_BASE_URL`.
You can tweak server configuration in your local Moose setup if needed.
