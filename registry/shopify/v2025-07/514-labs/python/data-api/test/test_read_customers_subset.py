#!/usr/bin/env python3
"""
Read a small subset of Customers (limit=10) using the Shopify Python Connector.

This script demonstrates how to connect and retrieve customers with the
GraphQL Admin API under the hood. Requires environment variables:

- SHOPIFY_SHOP
- SHOPIFY_ACCESS_TOKEN
- SHOPIFY_API_VERSION (optional; defaults to 2025-07)
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
        print("ERROR: Set SHOPIFY_SHOP and SHOPIFY_ACCESS_TOKEN to run this test.")
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

        print("\nQuerying Customers (limit=10)...")
        resp = conn.get("/customers", {"query": {"limit": 10}})
        data = resp.get("data")
        if not isinstance(data, dict):
            print("GraphQL error (customers):", resp.get("body") or resp)
            return 1

        customers = (data.get("customers") or {}).get("edges", [])
        print("Customers returned:", len(customers))
        for i, edge in enumerate(customers, 1):
            node = edge.get("node", {}) if isinstance(edge, dict) else {}
            print(f"  {i}. {node.get('email', 'unknown')} — {node.get('firstName', '')} {node.get('lastName', '')}")

        print("\nStatus:")
        print(conn.get_status())
        return 0

    except Exception as e:
        print("❌ Customers subset test failed:", type(e).__name__, str(e))
        return 1
    finally:
        try:
            conn.disconnect()
        except Exception:
            pass


if __name__ == "__main__":
    sys.exit(main())


