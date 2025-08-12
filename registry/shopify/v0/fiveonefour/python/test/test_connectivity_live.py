#!/usr/bin/env python3
"""
Live connectivity test for the Shopify GraphQL connector.

Requirements:
- Environment variables set with real values (do NOT commit secrets):
  - SHOPIFY_SHOP="<your-store>.myshopify.com"
  - SHOPIFY_API_VERSION="2025-07"  # optional, defaults to 2025-07
  - SHOPIFY_ACCESS_TOKEN="shpat_********"

This test establishes a connection, runs small queries for orders and inventory,
prints summary info, and disconnects.

It will skip automatically if env vars are missing.
"""

import os
import sys

# Ensure src is on path when running directly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from shopify_connector import ShopifyConnector, ShopifyConnectorConfig


def main() -> int:
    shop = os.environ.get("SHOPIFY_SHOP")
    api_version = os.environ.get("SHOPIFY_API_VERSION", "2025-07")
    token = os.environ.get("SHOPIFY_ACCESS_TOKEN")

    if not shop or not token:
        print("ERROR: Set SHOPIFY_SHOP and SHOPIFY_ACCESS_TOKEN to run live connectivity test.")
        return 1

    cfg = ShopifyConnectorConfig(
        shop=shop,
        apiVersion=api_version,
        accessToken=token,
    )

    conn = ShopifyConnector(cfg)
    try:
        print("Connecting to Shopify GraphQL...")
        conn.connect()
        print("Connected:", conn.isConnected())

        # Small Orders query
        print("\nQuerying Orders (limit=5)...")
        resp = conn.get("/orders", {"query": {"limit": 5}})
        data = resp.get("data")
        if not isinstance(data, dict):
            print("GraphQL error (orders):", resp.get("body") or resp)
            return 1
        orders = data.get("orders", {})
        order_edges = orders.get("edges", [])
        print("Orders returned:", len(order_edges))
        if order_edges:
            first = order_edges[0]["node"]
            print("First order:", {k: first.get(k) for k in ("id", "name", "createdAt")})

        # Small Inventory query
        print("\nQuerying Inventory (limit=5)...")
        try:
            resp_inv = conn.get("/inventory", {"query": {"limit": 5}})
            data_inv = resp_inv.get("data")
            if not isinstance(data_inv, dict):
                print("GraphQL error (inventory):", resp_inv.get("body") or resp_inv)
                return 1
            products = (data_inv.get("products") or {}).get("edges", [])
            print("Inventory items returned:", len(products))
            if products:
                first_product = products[0].get("node", {}) if isinstance(products[0], dict) else {}
                first_variant_edge = ((first_product.get("variants") or {}).get("edges") or [None])[0]
                first_variant = (first_variant_edge or {}).get("node", {}) if isinstance(first_variant_edge, dict) else {}
                print("First variant:", {k: first_variant.get(k) for k in ("id", "sku", "inventoryQuantity")})
        except Exception as e:
            details = getattr(e, 'details', None)
            if details:
                print("GraphQL exception details (inventory):", details)
            else:
                print("GraphQL exception (inventory):", type(e).__name__, str(e))
            return 1

        print("\nStatus:")
        print(conn.get_status())
        return 0

    except Exception as e:
        print("❌ Live connectivity test failed:", type(e).__name__, str(e))
        return 1
    finally:
        try:
            conn.disconnect()
        except Exception:
            pass


if __name__ == "__main__":
    sys.exit(main())
