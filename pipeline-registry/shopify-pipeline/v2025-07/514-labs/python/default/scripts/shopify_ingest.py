#!/usr/bin/env python3
import argparse
import json
import os
import sys
import time
from typing import Any, Dict, Iterable, List

from dotenv import load_dotenv
import requests
import structlog
from concurrent.futures import ThreadPoolExecutor, as_completed

# Import from local wheel (installed in venv)
try:
    from shopify_connector import ShopifyConnector
except Exception as e:
    print("ERROR: shopify_connector is not installed:")
    print("  Run the setup-shopify-connection.sh script")
    raise


log = structlog.get_logger("shopify_moose_demo")


def configure_logging() -> None:
    level = os.getenv("LOG_LEVEL", "INFO").upper()
    import logging

    logging.basicConfig(level=getattr(logging, level, logging.INFO))
    structlog.configure(
        wrapper_class=structlog.make_filtering_bound_logger(getattr(logging, level, logging.INFO)),
        processors=[
            structlog.processors.add_log_level,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.JSONRenderer(),
        ],
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
        "use_graphql": True,  # Try snake_case instead of camelCase
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
            
            # Extract available quantity from quantities array
            available_qty = None
            quantities = lvl_node.get("quantities", [])
            for qty in quantities:
                if isinstance(qty, dict) and qty.get("name") == "available":
                    available_qty = qty.get("quantity")
                    break
            
            # Use current timestamp for updated_at since it's not provided by GraphQL
            from datetime import datetime, timezone
            current_time = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
            
            yield {
                "sku": node.get("sku"),
                "tracked": node.get("tracked"),
                "available": float(available_qty) if available_qty is not None else None,
                "location_id": loc.get("id"),
                "location_name": loc.get("name"),
                "updated_at": current_time,  # Use current time as fallback
            }


def fetch_orders(connector: ShopifyConnector, limit: int) -> Iterable[Dict[str, Any]]:
    resp = connector.get("/orders", {"limit": limit, "status": "any"})
    data = resp.get("data") or {}
    orders = (data.get("orders") or {}).get("edges", [])
    for o_edge in orders:
        order = o_edge.get("node", {}) if isinstance(o_edge, dict) else {}
        
        # Extract financial information
        total_price_set = order.get("currentTotalPriceSet") or {}
        shop_money = total_price_set.get("shopMoney") or {}
        subtotal_price_set = order.get("subtotalPriceSet") or {}
        total_tax_set = order.get("totalTaxSet") or {}
        total_discounts_set = order.get("totalDiscountsSet") or {}
        
        # Extract customer information
        customer = order.get("customer") or {}
        
        # Extract billing address
        billing_address = order.get("billingAddress") or {}
        
        # Extract shipping address
        shipping_address = order.get("shippingAddress") or {}
        
        # Extract line items summary
        line_items = order.get("lineItems") or {}
        line_items_edges = line_items.get("edges") or []
        
        total_quantity = sum(
            (edge.get("node") or {}).get("quantity", 0) 
            for edge in line_items_edges 
            if isinstance(edge, dict)
        )
        
        yield {
            # Core order information
            "id": order.get("id"),
            "name": order.get("name"),
            "order_number": order.get("orderNumber"),
            "created_at": order.get("createdAt"),
            "updated_at": order.get("updatedAt"),
            "processed_at": order.get("processedAt"),
            "cancelled_at": order.get("cancelledAt"),
            "closed_at": order.get("closedAt"),
            
            # Financial information
            "total_price": float(shop_money.get("amount", 0)) if shop_money.get("amount") else None,
            "subtotal_price": float((subtotal_price_set.get("shopMoney") or {}).get("amount", 0)) if (subtotal_price_set.get("shopMoney") or {}).get("amount") else None,
            "total_tax": float((total_tax_set.get("shopMoney") or {}).get("amount", 0)) if (total_tax_set.get("shopMoney") or {}).get("amount") else None,
            "total_discounts": float((total_discounts_set.get("shopMoney") or {}).get("amount", 0)) if (total_discounts_set.get("shopMoney") or {}).get("amount") else None,
            "currency": shop_money.get("currencyCode"),
            "presentment_currency": order.get("presentmentCurrencyCode"),
            
            # Status information
            "financial_status": order.get("displayFinancialStatus"),
            "fulfillment_status": order.get("displayFulfillmentStatus"),
            "confirmation_number": order.get("confirmationNumber"),
            
            # Customer information
            "customer_id": customer.get("id"),
            "customer_email": customer.get("email"),
            "customer_phone": customer.get("phone"),
            
            # Billing address (flattened)
            "billing_address1": billing_address.get("address1"),
            "billing_address2": billing_address.get("address2"),
            "billing_city": billing_address.get("city"),
            "billing_province": billing_address.get("province"),
            "billing_country": billing_address.get("country"),
            "billing_zip": billing_address.get("zip"),
            
            # Shipping address (flattened)
            "shipping_address1": shipping_address.get("address1"),
            "shipping_address2": shipping_address.get("address2"),
            "shipping_city": shipping_address.get("city"),
            "shipping_province": shipping_address.get("province"),
            "shipping_country": shipping_address.get("country"),
            "shipping_zip": shipping_address.get("zip"),
            
            # Order metadata
            "test": order.get("test"),
            "tags": ", ".join(order.get("tags", [])) if order.get("tags") else None,
            "note": order.get("note"),
            "source_name": order.get("sourceName"),
            "referring_site": order.get("referringSite"),
            
            # Line items summary
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
            "updated_at": customer.get("updatedAt"),
            "verified_email": customer.get("verifiedEmail"),
            "state": customer.get("state"),
            # Flattened address fields
            "address1": address.get("address1"),
            "address2": address.get("address2"),
            "city": address.get("city"),
            "province": address.get("province"),
            "country": address.get("country"),
            "zip": address.get("zip"),
        }


def moose_ingest(model: str, rows: Iterable[Dict[str, Any]], concurrency: int) -> int:
    base_url = os.getenv("MOOSE_BASE_URL", "http://localhost:4000")
    url = f"{base_url}/ingest/{model}"
    timeout_seconds = int(os.getenv("MOOSE_INGEST_TIMEOUT", "10"))
    total_ingested = 0
    session = requests.Session()

    def send_row(row: Dict[str, Any]) -> int:
        r = session.post(url, json=row, timeout=timeout_seconds)
        r.raise_for_status()
        return 1

    rows_list = list(rows)
    if not rows_list:
        return 0

    with ThreadPoolExecutor(max_workers=max(1, concurrency)) as executor:
        futures = [executor.submit(send_row, row) for row in rows_list]
        for fut in as_completed(futures):
            try:
                total_ingested += fut.result()
            except Exception as e:
                log.warning("ingest_failed_row", error=str(e))

    return total_ingested


def main() -> int:
    parser = argparse.ArgumentParser(description="Shopify → Moose Python demo")
    parser.add_argument("--resource", choices=["inventory", "orders", "customers"], default="inventory")
    parser.add_argument("--limit", type=int, default=25)
    parser.add_argument("--model", default=None, help="Override the default model for the resource")
    parser.add_argument(
        "--concurrency",
        type=int,
        default=int(os.getenv("MOOSE_INGEST_CONCURRENCY", "4")),
        help="Number of concurrent HTTP posts to Moose ingest",
    )
    args = parser.parse_args()
    
    # Set default model based on resource if not explicitly provided
    if args.model is None:
        resource_model_map = {
            "inventory": "shopify_inventory_levels",
            "orders": "shopify_orders",
            "customers": "shopify_customers"
        }
        args.model = resource_model_map.get(args.resource, "shopify_inventory_levels")

    configure_logging()
    cfg = load_config()
    log.info("starting", resource=args.resource, limit=args.limit, model=args.model, api_version=cfg["apiVersion"])

    connector = ShopifyConnector(cfg)
    connector.connect()

    try:
        if args.resource == "inventory":
            rows = list(fetch_inventory(connector, args.limit))
        elif args.resource == "orders":
            rows = list(fetch_orders(connector, args.limit))
        elif args.resource == "customers":
            rows = list(fetch_customers(connector, args.limit))
        else:
            raise ValueError(f"Unknown resource: {args.resource}")
        log.info("fetched_rows", count=len(rows))

        ingested = moose_ingest(args.model, rows, args.concurrency)
        log.info("ingested_rows", count=ingested)
        return 0
    except Exception as e:
        log.exception("run_failed", error=str(e))
        return 1
    finally:
        try:
            connector.disconnect()
        except Exception:
            pass


if __name__ == "__main__":
    sys.exit(main())


