#!/usr/bin/env python3
"""
Read a small subset of Inventory (inventory items with per-location levels, limit=10)
using the Shopify Python Connector.

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

        print("\nQuerying Inventory Items (limit=10, per-location levels)...")
        try:
            resp = conn.get("/inventory", {"query": {"limit": 10, "mode": "levels"}})
            data = resp.get("data")
            if not isinstance(data, dict):
                print("GraphQL error (inventory):", resp.get("body") or resp)
                raise RuntimeError("levels query did not return dict data")

            inv_edges = (data.get("inventoryItems") or {}).get("edges", [])
            if inv_edges:
                print("Inventory items returned:", len(inv_edges))
                for i, edge in enumerate(inv_edges, 1):
                    node = edge.get("node", {}) if isinstance(edge, dict) else {}
                    levels_edges = ((node.get("inventoryLevels") or {}).get("edges") or [])
                    first_level = levels_edges[0].get("node", {}) if (levels_edges and isinstance(levels_edges[0], dict)) else {}
                    loc = first_level.get("location") or {}
                    print(
                        f"  {i}. sku={node.get('sku', 'N/A')} tracked={node.get('tracked', False)} "
                        f"firstLevelAvailable={first_level.get('available', 'N/A')}@{loc.get('name', 'N/A')}"
                    )
            else:
                print("No inventoryItems returned from levels query.")
                raise RuntimeError("levels returned no edges")
        except Exception as _:
            # Fallback: query variants-only mode if levels not accessible/allowed
            print("Falling back to variant-level quantities (mode=variants)...")
            resp_fallback = conn.get("/inventory", {"query": {"limit": 10, "mode": "variants"}})
            data_fallback = resp_fallback.get("data")
            if not isinstance(data_fallback, dict):
                print("GraphQL error (inventory variants):", resp_fallback.get("body") or resp_fallback)
                return 1
            products = (data_fallback.get("products") or {}).get("edges", [])
            print("Products returned (for variants):", len(products))
            shown = 0
            for p_edge in products:
                product = p_edge.get("node", {}) if isinstance(p_edge, dict) else {}
                variant_edges = ((product.get("variants") or {}).get("edges") or [])
                for v_edge in variant_edges:
                    node = v_edge.get("node", {}) if isinstance(v_edge, dict) else {}
                    shown += 1
                    print(f"  {shown}. sku={node.get('sku', 'N/A')} inventoryQuantity={node.get('inventoryQuantity', 'N/A')}")
                    if shown >= 10:
                        break
                if shown >= 10:
                    break

        print("\nStatus:")
        print(conn.get_status())
        return 0

    except Exception as e:
        print("❌ Inventory subset test failed:", type(e).__name__, str(e))
        return 1
    finally:
        try:
            conn.disconnect()
        except Exception:
            pass


if __name__ == "__main__":
    sys.exit(main())


