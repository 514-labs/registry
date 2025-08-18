# Outputs

This pipeline can ingest multiple Shopify resources into Moose via HTTP ingest.

## Default models
- `shopify_inventory_levels` (default for `--resource inventory`)
- `shopify_orders` (default for `--resource orders`)
- `shopify_customers` (default for `--resource customers`)

You can override the target model at runtime with `--model`.

## Inventory shape (example)
Fields emitted by `--resource inventory` (flattened):
- `sku`: string
- `tracked`: boolean
- `available`: number (available quantity)
- `location_id`: string
- `location_name`: string
- `updated_at`: ISO timestamp

## Orders shape (example)
Selected fields emitted by `--resource orders`:
- Core: `id`, `name`, `order_number`, `created_at`, `updated_at`, `processed_at`, `cancelled_at`, `closed_at`
- Financial: `total_price`, `subtotal_price`, `total_tax`, `total_discounts`, `currency`, `presentment_currency`
- Status: `financial_status`, `fulfillment_status`, `confirmation_number`
- Customer: `customer_id`, `customer_email`, `customer_phone`
- Billing address: `billing_address1`, `billing_address2`, `billing_city`, `billing_province`, `billing_country`, `billing_zip`
- Shipping address: `shipping_address1`, `shipping_address2`, `shipping_city`, `shipping_province`, `shipping_country`, `shipping_zip`
- Line items summary: `total_line_items_quantity`, `line_items_count`
- Misc: `test`, `tags`, `note`, `source_name`, `referring_site`

## Customers shape (example)
Selected fields emitted by `--resource customers`:
- `id`, `email`, `first_name`, `last_name`, `phone`, `created_at`, `updated_at`, `verified_email`, `state`
- Default address: `address1`, `address2`, `city`, `province`, `country`, `zip`

## Schemas
If you want machine-readable guarantees, add JSON schema files per dataset under `schemas/` and register them in `schemas/index.json`.
