#!/usr/bin/env python3
"""
Read a small subset of Orders (limit=10) using the Shopify Python Connector.

This script demonstrates how to connect and retrieve orders with richer fields.
Requires environment variables:

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

        print("\nQuerying Orders (limit=10)...")
        resp = conn.get("/orders", {"query": {"limit": 10}})
        data = resp.get("data")
        if not isinstance(data, dict):
            print("GraphQL error (orders):", resp.get("body") or resp)
            return 1

        orders = (data.get("orders") or {}).get("edges", [])
        print("Orders returned:", len(orders))
        for i, edge in enumerate(orders, 1):
            node = edge.get("node", {}) if isinstance(edge, dict) else {}
            customer = node.get("customer") or {}
            print(
                f"  {i}. {node.get('name', 'N/A')} — total={((node.get('totalPriceSet') or {}).get('shopMoney') or {}).get('amount', 'N/A')} "
                f"{((node.get('totalPriceSet') or {}).get('shopMoney') or {}).get('currencyCode', '')} "
                f"customer={customer.get('email', 'N/A')}"
            )

        print("\nStatus:")
        print(conn.get_status())
        return 0

    except Exception as e:
        print("❌ Orders subset test failed:", type(e).__name__, str(e))
        return 1
    finally:
        try:
            conn.disconnect()
        except Exception:
            pass


if __name__ == "__main__":
    sys.exit(main())


