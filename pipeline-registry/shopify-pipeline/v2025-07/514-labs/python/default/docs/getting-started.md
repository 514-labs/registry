# Getting started

## Prerequisites
- Python 3.12+
- Moose CLI installed: https://docs.fiveonefour.com/moose
- Shopify development store and Admin API access token with read scopes (`read_products`, `read_inventory`, `read_orders`, `read_customers`)

## Shopify setup (one-time)
1) In your Shopify admin: Settings → Apps and sales channels → Develop apps → Create app
2) Grant Admin API access scopes (read-only minimum): `read_products`, `read_inventory`, `read_orders`, `read_customers`
3) Install the app and copy the Admin API access token (`shpat_...`)

## Quickstart
```bash
# 1) Create venv and install deps
cd pipeline-registry/shopify-pipeline/v2025-07/514-labs/python/default
python3 -m venv .venv
source .venv/bin/activate
pip install -U pip wheel
pip install -r requirements.txt

# 2) Build & install the Shopify connector wheel locally
./scripts/setup-shopify-connector.sh

# 3) Configure environment (either edit .env or export directly)
cp .env.example .env
# Required keys
echo 'SHOPIFY_SHOP=my-store.myshopify.com' >> .env
echo 'SHOPIFY_API_VERSION=2025-07'        >> .env
echo 'SHOPIFY_ACCESS_TOKEN=shpat_xxx'     >> .env
```

### Environment variables must be in both places
- Keep Shopify credentials in `.env` so Python code can load them via `dotenv`.
- Also export the same variables into your shell for example scripts and manual calls that read from the environment.

```bash
# Export directly (works for current shell session)
export SHOPIFY_SHOP=my-store.myshopify.com
export SHOPIFY_API_VERSION=2025-07
export SHOPIFY_ACCESS_TOKEN=shpat_xxx

# Or export from .env in any terminal before running examples
set -a && source .env && set +a
```

## Credential smoke test (optional)
```bash
# Requires SHOPIFY_SHOP, SHOPIFY_API_VERSION, SHOPIFY_ACCESS_TOKEN in env/.env
source .venv/bin/activate && set -a && source .env && set +a
curl -s "https://${SHOPIFY_SHOP}/admin/api/${SHOPIFY_API_VERSION}/shop.json" \
  -H "X-Shopify-Access-Token: ${SHOPIFY_ACCESS_TOKEN}" | jq '.shop.name'
# A valid shop name (HTTP 200) confirms domain/version/token are correct
```

## Run
```bash
# Start Moose dev server (in one terminal)
source .venv/bin/activate
moose dev

# One-shot ingest inventory data (in another terminal)
source .venv/bin/activate
python scripts/shopify_ingest.py --resource inventory --limit 50

# Optional: other resources
python scripts/shopify_ingest.py --resource customers --limit 50
python scripts/shopify_ingest.py --resource orders --limit 25

# Verify the typed Consumption APIs (optional)
curl 'http://localhost:4000/consumption/getShopifyInventoryLevels?limit=5' | jq

# Other available APIs:
curl 'http://localhost:4000/consumption/getShopifyCustomerLookup?email=test@example.com&limit=10' | jq
curl 'http://localhost:4000/consumption/getShopifyCustomerSegmentation?city=New York&limit=10' | jq
curl 'http://localhost:4000/consumption/getShopifyCustomerActivity?days_back=30&limit=10' | jq
curl 'http://localhost:4000/consumption/getCustomersByEmail?email=test@example.com&limit=10' | jq

# Orders APIs:
curl 'http://localhost:4000/consumption/getShopifyOrderLookup?order_id=gid://shopify/Order/123456789&limit=10' | jq
curl 'http://localhost:4000/consumption/getShopifyOrdersByDate?days_back=7&limit=10' | jq
curl 'http://localhost:4000/consumption/getShopifyOrdersByCustomer?customer_email=test@example.com&limit=10' | jq
curl 'http://localhost:4000/consumption/getShopifyOrdersByStatus?financial_status=paid&limit=10' | jq
curl 'http://localhost:4000/consumption/getShopifyOrderAnalytics?days_back=30&group_by=day' | jq
```

## Staged pipeline (preferred for clarity)
```bash
# 1) Extract + Transform → Stage (JSONL)
python scripts/etl_to_stage.py --resource inventory --limit 50
ls python/default/data/stage/

# 2) Load from Stage → Moose
python scripts/load_from_stage.py --resource inventory
```
