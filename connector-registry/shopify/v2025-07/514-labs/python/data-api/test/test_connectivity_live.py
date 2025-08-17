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

        # Small Customers query
        print("\nQuerying Customers (limit=5)...")
        try:
            resp_cust = conn.get("/customers", {"query": {"limit": 5}})
            data_cust = resp_cust.get("data")
            if not isinstance(data_cust, dict):
                print("GraphQL error (customers):", resp_cust.get("body") or resp_cust)
            else:
                customers = (data_cust.get("customers") or {}).get("edges", [])
                print("Customers returned:", len(customers))
                if customers:
                    first_cust = customers[0].get("node", {}) if isinstance(customers[0], dict) else {}
                    print("First customer:", {k: first_cust.get(k) for k in ("id", "email", "firstName", "lastName")})
        except Exception as e:
            details = getattr(e, 'details', None)
            if details:
                print("GraphQL exception details (customers):", details)
            else:
                print("GraphQL exception (customers):", type(e).__name__, str(e))

        # Small Inventory query
        print("\nQuerying Inventory (limit=5)...")
        try:
            resp_inv = conn.get("/inventory", {"query": {"limit": 5}})
            data_inv = resp_inv.get("data")
            if not isinstance(data_inv, dict):
                print("GraphQL error (inventory):", resp_inv.get("body") or resp_inv)
                return 1
            inv_edges = (data_inv.get("inventoryItems") or {}).get("edges", [])
            print("Inventory items returned:", len(inv_edges))
            if inv_edges:
                first_item = inv_edges[0].get("node", {}) if isinstance(inv_edges[0], dict) else {}
                levels_edges = ((first_item.get("inventoryLevels") or {}).get("edges") or [])
                first_level = levels_edges[0].get("node", {}) if (levels_edges and isinstance(levels_edges[0], dict)) else {}
                print("First inventory item:", {k: first_item.get(k) for k in ("id", "sku", "tracked")})
                if first_level:
                    location = first_level.get("location") or {}
                    print("First level:", {"available": first_level.get("available"), "location": location.get("name")})
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
