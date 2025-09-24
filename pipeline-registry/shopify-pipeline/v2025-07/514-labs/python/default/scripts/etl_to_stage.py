#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
from typing import Any, Dict, Iterable, List

from dotenv import load_dotenv

try:
    from shopify_connector import ShopifyConnector
except Exception as e:
    raise SystemExit(
        "shopify_connector is not installed. Run scripts/setup-shopify-connector.sh first."
    )


def load_config() -> Dict[str, Any]:
    load_dotenv()
    shop = os.environ.get("SHOPIFY_SHOP")
    token = os.environ.get("SHOPIFY_ACCESS_TOKEN")
    api_version = os.environ.get("SHOPIFY_API_VERSION", "2025-07")
    if not shop or not token:
        raise RuntimeError("Missing SHOPIFY_SHOP or SHOPIFY_ACCESS_TOKEN in environment/.env")
    return {
        "shop": shop,
        "accessToken": token,
        "apiVersion": api_version,
        "timeout": 30000,
        "use_graphql": True,
    }


def fetch_inventory(connector: ShopifyConnector, limit: int) -> Iterable[Dict[str, Any]]:
    resp = connector.get("/inventory", {"query": {"limit": limit, "mode": "levels"}})
    data = resp.get("data") or {}
    inv_edges = (data.get("inventoryItems") or {}).get("edges", [])
    for edge in inv_edges:
        node = edge.get("node", {}) if isinstance(edge, dict) else {}
        levels_edges = ((node.get("inventoryLevels") or {}).get("edges") or [])
        for lvl in levels_edges:
            lvl_node = lvl.get("node", {}) if isinstance(lvl, dict) else {}
            loc = lvl_node.get("location") or {}

            available_qty = None
            quantities = lvl_node.get("quantities", [])
            for qty in quantities:
                if isinstance(qty, dict) and qty.get("name") == "available":
                    available_qty = qty.get("quantity")
                    break

            from datetime import datetime, timezone

            current_time = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

            yield {
                "sku": node.get("sku"),
                "tracked": node.get("tracked"),
                "available": float(available_qty) if available_qty is not None else None,
                "location_id": loc.get("id"),
                "location_name": loc.get("name"),
                "updated_at": current_time,
            }


def fetch_orders(connector: ShopifyConnector, limit: int) -> Iterable[Dict[str, Any]]:
    resp = connector.get("/orders", {"limit": limit, "status": "any"})
    data = resp.get("data") or {}
    orders = (data.get("orders") or {}).get("edges", [])
    for o_edge in orders:
        order = o_edge.get("node", {}) if isinstance(o_edge, dict) else {}

        total_price_set = order.get("currentTotalPriceSet") or {}
        shop_money = total_price_set.get("shopMoney") or {}
        subtotal_price_set = order.get("subtotalPriceSet") or {}
        total_tax_set = order.get("totalTaxSet") or {}
        total_discounts_set = order.get("totalDiscountsSet") or {}

        customer = order.get("customer") or {}
        billing_address = order.get("billingAddress") or {}
        shipping_address = order.get("shippingAddress") or {}

        line_items = order.get("lineItems") or {}
        line_items_edges = line_items.get("edges") or []
        total_quantity = sum(
            (edge.get("node") or {}).get("quantity", 0)
            for edge in line_items_edges
            if isinstance(edge, dict)
        )

        yield {
            "id": order.get("id"),
            "name": order.get("name"),
            "order_number": order.get("orderNumber"),
            "created_at": order.get("createdAt"),
            "updated_at": order.get("updatedAt"),
            "processed_at": order.get("processedAt"),
            "cancelled_at": order.get("cancelledAt"),
            "closed_at": order.get("closedAt"),
            "total_price": float(shop_money.get("amount", 0)) if shop_money.get("amount") else None,
            "subtotal_price": float((subtotal_price_set.get("shopMoney") or {}).get("amount", 0))
            if (subtotal_price_set.get("shopMoney") or {}).get("amount")
            else None,
            "total_tax": float((total_tax_set.get("shopMoney") or {}).get("amount", 0))
            if (total_tax_set.get("shopMoney") or {}).get("amount")
            else None,
            "total_discounts": float((total_discounts_set.get("shopMoney") or {}).get("amount", 0))
            if (total_discounts_set.get("shopMoney") or {}).get("amount")
            else None,
            "currency": shop_money.get("currencyCode"),
            "presentment_currency": order.get("presentmentCurrencyCode"),
            "financial_status": order.get("displayFinancialStatus"),
            "fulfillment_status": order.get("displayFulfillmentStatus"),
            "confirmation_number": order.get("confirmationNumber"),
            "customer_id": customer.get("id"),
            "customer_email": customer.get("email"),
            "customer_phone": customer.get("phone"),
            "billing_address1": billing_address.get("address1"),
            "billing_address2": billing_address.get("address2"),
            "billing_city": billing_address.get("city"),
            "billing_province": billing_address.get("province"),
            "billing_country": billing_address.get("country"),
            "billing_zip": billing_address.get("zip"),
            "shipping_address1": shipping_address.get("address1"),
            "shipping_address2": shipping_address.get("address2"),
            "shipping_city": shipping_address.get("city"),
            "shipping_province": shipping_address.get("province"),
            "shipping_country": shipping_address.get("country"),
            "shipping_zip": shipping_address.get("zip"),
            "test": order.get("test"),
            "tags": ", ".join(order.get("tags", [])) if order.get("tags") else None,
            "note": order.get("note"),
            "source_name": order.get("sourceName"),
            "referring_site": order.get("referringSite"),
            "total_line_items_quantity": total_quantity if total_quantity > 0 else None,
            "line_items_count": len(line_items_edges),
        }


def fetch_customers(connector: ShopifyConnector, limit: int) -> Iterable[Dict[str, Any]]:
    resp = connector.get("/customers", {"query": {"limit": limit}})
    data = resp.get("data") or {}
    customers = (data.get("customers") or {}).get("edges", [])
    for c_edge in customers:
        customer = c_edge.get("node", {}) if isinstance(c_edge, dict) else {}
        address = customer.get("defaultAddress") or {}
        yield {
            "id": customer.get("id"),
            "email": customer.get("email"),
            "first_name": customer.get("firstName"),
            "last_name": customer.get("lastName"),
            "phone": customer.get("phone"),
            "created_at": customer.get("createdAt"),
            "updated_at": customer.get("UpdatedAt") if customer.get("UpdatedAt") else customer.get("updatedAt"),
            "verified_email": customer.get("verifiedEmail"),
            "state": customer.get("state"),
            "address1": address.get("address1"),
            "address2": address.get("address2"),
            "city": address.get("city"),
            "province": address.get("province"),
            "country": address.get("country"),
            "zip": address.get("zip"),
        }


def write_jsonl(rows: Iterable[Dict[str, Any]], path: Path) -> int:
    path.parent.mkdir(parents=True, exist_ok=True)
    count = 0
    with path.open("w", encoding="utf-8") as f:
        for row in rows:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")
            count += 1
    return count


def main() -> int:
    parser = argparse.ArgumentParser(description="Extract+Transform Shopify to stage (JSONL)")
    parser.add_argument("--resource", choices=["inventory", "orders", "customers"], default="inventory")
    parser.add_argument("--limit", type=int, default=25)
    parser.add_argument("--out", default=None, help="Output JSONL path; defaults to data/stage/{resource}.jsonl")
    args = parser.parse_args()

    cfg = load_config()
    connector = ShopifyConnector(cfg)
    connector.connect()

    try:
        if args.resource == "inventory":
            rows = list(fetch_inventory(connector, args.limit))
        elif args.resource == "orders":
            rows = list(fetch_orders(connector, args.limit))
        else:
            rows = list(fetch_customers(connector, args.limit))

        base_dir = Path(__file__).resolve().parent
        default_out = base_dir.parent / "data" / "stage" / f"{args.resource}.jsonl"
        out_path = Path(args.out) if args.out else default_out
        written = write_jsonl(rows, out_path)
        print(f"Wrote {written} rows to {out_path}")
        return 0
    finally:
        try:
            connector.disconnect()
        except Exception:
            pass


if __name__ == "__main__":
    raise SystemExit(main())


