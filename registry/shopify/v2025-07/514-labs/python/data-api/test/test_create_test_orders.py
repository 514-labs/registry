#!/usr/bin/env python3
"""
Create test customers and orders via Shopify Admin GraphQL, then mark orders as test via REST transactions (Bogus gateway).

Requirements:
- Environment variables: SHOPIFY_SHOP, SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_VERSION
- Token with full scopes (customers, products, draft orders, orders)

Behavior:
- Creates N test customers (default: 1000) with tag 'automation-test'
- Creates N draft orders (one per customer), completes them (paymentPending)
- Creates REST transactions with test=true and gateway='bogus' to set order.test == true
- Tags orders with 'automation-test'
- Does not delete or cancel orders
"""

import os
import sys
import time
import random
import argparse
import json
import logging
from typing import Any, Dict, List, Tuple

# Add src to path for local development
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from shopify_connector.transport.http_client import HTTPClient
from shopify_connector.auth.bearer import BearerAuth
from shopify_connector.config.schema import ShopifyConnectorConfig


def get_env_config() -> ShopifyConnectorConfig:
	shop = os.environ.get("SHOPIFY_SHOP")
	token = os.environ.get("SHOPIFY_ACCESS_TOKEN")
	api_version = os.environ.get("SHOPIFY_API_VERSION", "2025-07")
	if not shop or not token:
		print("ERROR: Set SHOPIFY_SHOP and SHOPIFY_ACCESS_TOKEN to run this script.")
		sys.exit(1)
	return ShopifyConnectorConfig(shop=shop, accessToken=token, apiVersion=api_version)


def graphql(client: HTTPClient, url: str, auth: BearerAuth, query: str, variables: Dict[str, Any]) -> Dict[str, Any]:
	headers = {}
	req = {"headers": headers}
	auth.authenticate(req)
	resp = client.request("POST", url, headers=req["headers"], json={"query": query, "variables": variables})
	body = resp.get("body", {})
	if not isinstance(body, dict):
		raise RuntimeError(f"GraphQL returned non-JSON body: {str(body)[:200]}")
	return body


def rest_request(client: HTTPClient, url: str, auth: BearerAuth, method: str, path: str, params: Dict[str, Any] | None = None, json_body: Dict[str, Any] | None = None) -> Dict[str, Any]:
	full = f"{url}{path}"
	headers = {"Accept": "application/json"}
	req = {"headers": headers}
	auth.authenticate(req)
	resp = client.request(method, full, headers=req["headers"], params=params, json=json_body)
	body = resp.get("body", {})
	if isinstance(body, (dict, list)):
		return body
	if isinstance(body, str):
		try:
			return json.loads(body)
		except Exception:
			return {"_raw": body}
	return {"_raw": str(body)}


def rest_post(client: HTTPClient, url: str, auth: BearerAuth, path: str, json_body: Dict[str, Any]) -> Dict[str, Any]:
	return rest_request(client, url, auth, "POST", path, None, json_body)


def rest_complete_draft_order(client: HTTPClient, rest_api_base: str, auth: BearerAuth, draft_legacy_id: str, max_retries: int = 5, sleep_seconds: int = 65) -> Tuple[str, str]:
	path = f"/draft_orders/{draft_legacy_id}/complete.json"
	# Shopify expects payment_pending as a query parameter on REST complete
	for attempt in range(1, max_retries + 1):
		body = rest_request(client, rest_api_base, auth, "PUT", path, params={"payment_pending": "true"}, json_body=None)
		legacy_id = None
		order = (body or {}).get("order") if isinstance(body, dict) else None
		if isinstance(order, dict):
			legacy_id = order.get("id")
		if not legacy_id and isinstance(body, dict):
			draft_order = body.get("draft_order") or {}
			legacy_id = draft_order.get("order_id")
		# Handle rate limit message bodies gracefully with backoff
		if not legacy_id and isinstance(body, dict):
			err_text = str(body.get("errors", ""))
			if "rate limit" in err_text.lower():
				print(f"⏳ Draft order REST complete rate-limited (attempt {attempt}/{max_retries}). Sleeping {sleep_seconds}s...")
				time.sleep(sleep_seconds)
				continue
		if not legacy_id:
			raise RuntimeError(f"REST draft order complete returned no order: {str(body)[:200]}")
		order_gid = f"gid://shopify/Order/{legacy_id}"
		return order_gid, str(legacy_id)
	# If loop exits without return
	raise RuntimeError("REST draft order complete exceeded retry attempts due to rate limiting")


def fetch_variants(client: HTTPClient, gql_url: str, auth: BearerAuth, minimum: int = 50) -> List[Tuple[str, str]]:
	query = (
		"query variants($first:Int!){\n"
		"  products(first:$first){\n"
		"    edges{ node{ id title variants(first:5){ edges{ node{ id price } } } } }\n"
		"  }\n"
		"}\n"
	)
	body = graphql(client, gql_url, auth, query, {"first": minimum})
	variants: List[Tuple[str, str]] = []
	for pedge in (body.get("data", {}).get("products", {}).get("edges", []) or []):
		node = pedge.get("node", {})
		for vedge in (node.get("variants", {}).get("edges", []) or []):
			vnode = vedge.get("node", {})
			vid = vnode.get("id")
			price = vnode.get("price", "1.00")
			if vid:
				variants.append((vid, str(price)))
	return variants


def fetch_customers_by_tag(client: HTTPClient, gql_url: str, auth: BearerAuth, tag: str, limit: int) -> List[str]:
	query = (
		"query($first:Int!,$after:String,$query:String){\n"
		"  customers(first:$first, after:$after, query:$query){\n"
		"    edges{ cursor node{ id email tags } }\n"
		"    pageInfo{ hasNextPage endCursor }\n"
		"  }\n"
		"}\n"
	)
	qstr = f"tag:'{tag}'"
	ids: List[str] = []
	after = None
	while len(ids) < limit:
		variables = {"first": min(100, limit - len(ids)), "after": after, "query": qstr}
		body = graphql(client, gql_url, auth, query, variables)
		conn = body.get("data", {}).get("customers", {})
		for edge in conn.get("edges", []) or []:
			node = edge.get("node") or {}
			cid = node.get("id")
			if cid:
				ids.append(cid)
		page_info = conn.get("pageInfo") or {}
		if not page_info.get("hasNextPage"):
			break
		after = page_info.get("endCursor")
	return ids


def random_us_address(seed: int) -> Dict[str, Any]:
	random.seed(seed)
	first_names = ["Alex", "Sam", "Jordan", "Taylor", "Casey", "Riley", "Drew", "Morgan"]
	last_names = ["Smith", "Johnson", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor"]
	cities = ["Austin", "Seattle", "Denver", "Portland", "Phoenix", "Chicago", "Boston", "Nashville"]
	streets = ["Main St", "Oak Ave", "Pine Rd", "Maple Dr", "Cedar Ln", "Elm St", "Birch Blvd", "Spruce Ct"]
	states = ["TX", "WA", "CO", "OR", "AZ", "IL", "MA", "TN"]
	fn = random.choice(first_names)
	ln = random.choice(last_names)
	addr = {
		"firstName": fn,
		"lastName": ln,
		"address1": f"{random.randint(100, 9999)} {random.choice(streets)}",
		"city": random.choice(cities),
		"province": random.choice(states),
		"country": "United States",
		"zip": f"{random.randint(10000, 99999)}",
		"phone": f"+1{random.randint(2000000000, 9999999999)}",
	}
	return addr


def create_customer(client: HTTPClient, gql_url: str, auth: BearerAuth, idx: int, tag: str) -> str:
	email = f"automation-test+{idx}@example.com"
	addr = random_us_address(idx)
	mutation = (
		"mutation customerCreate($input: CustomerInput!){\n"
		"  customerCreate(input:$input){\n"
		"    customer{ id email tags }\n"
		"    userErrors{ field message }\n"
		"  }\n"
		"}\n"
	)
	variables = {
		"input": {
			"email": email,
			"firstName": addr["firstName"],
			"lastName": addr["lastName"],
			"addresses": [addr],
			"tags": [tag],
		}
	}
	body = graphql(client, gql_url, auth, mutation, variables)
	errs = (body.get("data", {}).get("customerCreate", {}).get("userErrors") or [])
	if errs:
		raise RuntimeError(f"customerCreate errors: {errs}")
	cust = body.get("data", {}).get("customerCreate", {}).get("customer") or {}
	cid = cust.get("id")
	if not cid:
		raise RuntimeError("customerCreate returned no customer id")
	return cid


def create_and_complete_order(client: HTTPClient, gql_url: str, auth: BearerAuth, customer_id: str, variant_id: str, quantity: int, shipping_addr: Dict[str, Any], rest_api_base: str, rest_retries: int, rest_sleep: int) -> Tuple[str, str]:
	create_mut = (
		"mutation draftOrderCreate($input: DraftOrderInput!){\n"
		"  draftOrderCreate(input:$input){ draftOrder{ id } userErrors{ field message } }\n"
		"}\n"
	)
	input_obj = {
		"customerId": customer_id,
		"lineItems": [{"variantId": variant_id, "quantity": quantity}],
		"shippingAddress": shipping_addr,
		"billingAddress": shipping_addr,
		"tags": ["automation-test"],
	}
	body = graphql(client, gql_url, auth, create_mut, {"input": input_obj})
	errs = (body.get("data", {}).get("draftOrderCreate", {}).get("userErrors") or [])
	if errs:
		raise RuntimeError(f"draftOrderCreate errors: {errs}")
	draft = body.get("data", {}).get("draftOrderCreate", {}).get("draftOrder") or {}
	draft_id = draft.get("id")
	if not draft_id:
		raise RuntimeError("draftOrderCreate returned no draft id")

	complete_mut = (
		"mutation draftOrderComplete($id:ID!){\n"
		"  draftOrderComplete(id:$id, paymentPending:true){\n"
		"    order{ id legacyResourceId test }\n"
		"    draftOrder{ id name }\n"
		"    userErrors{ field message }\n"
		"  }\n"
		"}\n"
	)
	body2 = graphql(client, gql_url, auth, complete_mut, {"id": draft_id})
	errs2 = (body2.get("data", {}).get("draftOrderComplete", {}).get("userErrors") or [])
	if errs2:
		raise RuntimeError(f"draftOrderComplete errors: {errs2}")
	complete = body2.get("data", {}).get("draftOrderComplete", {}) or {}
	order = complete.get("order") or {}
	order_gid = order.get("id")
	order_legacy_id = order.get("legacyResourceId")
	# Fallback: derive legacy ID (numeric) from GID if not returned
	if order_gid and not order_legacy_id and isinstance(order_gid, str):
		try:
			order_legacy_id = order_gid.split("/")[-1]
		except Exception:
			order_legacy_id = None
	if not order_gid or not order_legacy_id:
		# Try REST fallback complete using draft legacy id
		try:
			draft_legacy_id = draft_id.split("/")[-1]
			order_gid, order_legacy_id = rest_complete_draft_order(client, rest_api_base=rest_api_base, auth=auth, draft_legacy_id=draft_legacy_id, max_retries=rest_retries, sleep_seconds=rest_sleep)
		except Exception as rest_e:
			raise RuntimeError(f"draftOrderComplete returned no order ids, REST fallback failed: {rest_e}")
	return str(order_gid), str(order_legacy_id)


def create_test_transaction(client: HTTPClient, rest_api_base: str, auth: BearerAuth, order_legacy_id: str, amount: str, currency: str = "USD") -> Dict[str, Any]:
	path = f"/orders/{order_legacy_id}/transactions.json"
	payload = {
		"transaction": {
			"kind": "sale",
			"status": "success",
			"gateway": "bogus",
			"amount": amount,
			"currency": currency,
			"test": True
		}
	}
	return rest_post(client, rest_api_base, auth, path, payload)


def verify_order_test_flag(client: HTTPClient, gql_url: str, auth: BearerAuth, order_gid: str) -> bool:
	q = (
		"query ($id:ID!){ node(id:$id){ ... on Order { id test name } } }\n"
	)
	body = graphql(client, gql_url, auth, q, {"id": order_gid})
	node = body.get("data", {}).get("node") or {}
	return bool(node.get("test", False))


def main() -> int:
	print("🚀 Create Test Customers and Orders (GraphQL + REST Bogus)")
	print("=" * 60)
	print()

	config = get_env_config()
	client = HTTPClient(config)
	auth = BearerAuth(config.accessToken)
	gql_url = config.get_graphql_url()
	rest_base = config.get_api_url()

	# CLI args (env defaults preserved)
	parser = argparse.ArgumentParser(description="Create test customers and orders using GraphQL + REST (Bogus gateway)")
	parser.add_argument("--count", type=int, default=int(os.environ.get("ORDERS_COUNT", "1000")), help="Number of customers/orders to process")
	parser.add_argument("--skip-customers", action="store_true", default=os.environ.get("SKIP_CUSTOMERS", "false").lower() in ("1", "true", "yes"), help="Reuse existing customers by tag instead of creating new ones")
	parser.add_argument("--customer-tag", type=str, default=os.environ.get("CUSTOMER_TAG", "automation-test"), help="Tag to select (and tag) customers")
	parser.add_argument("--customer-offset", type=int, default=int(os.environ.get("CUSTOMER_OFFSET", "0")), help="Numeric offset for generated customer emails to avoid duplicates")
	parser.add_argument("--verbose", action="store_true", help="Enable verbose logging (HTTP warnings, responses)")
	parser.add_argument("--rest-retries", type=int, default=int(os.environ.get("REST_RETRIES", "5")), help="Max retries for REST draft order completion on rate limit")
	parser.add_argument("--rest-sleep", type=int, default=int(os.environ.get("REST_SLEEP_SECONDS", "65")), help="Seconds to sleep between REST retries when rate-limited")
	args = parser.parse_args()

	count = args.count
	skip_customers = args.skip_customers
	customer_tag = args.customer_tag
	customer_offset = args.customer_offset
	rest_retries = args.rest_retries
	rest_sleep = args.rest_sleep

	# Logging control: suppress HTTP client parse warnings unless verbose
	if not args.verbose:
		logging.getLogger("shopify_connector.transport.http_client").setLevel(logging.ERROR)
	per_variant_qty = 1

	print(f"Shop: {config.shop}")
	print(f"API Version: {config.apiVersion}")
	print(f"Planned customers/orders: {count}")
	print()

	# Fetch variants to rotate through
	variants = fetch_variants(client, gql_url, auth, minimum=100)
	if not variants:
		print("❌ No variants found. Create products/variants first.")
		return 1
	print(f"Found {len(variants)} variants to use for orders")

	created_customers: List[str] = []
	created_orders: List[str] = []

	if skip_customers:
		# Reuse existing customers by tag
		created_customers = fetch_customers_by_tag(client, gql_url, auth, customer_tag, count)
		if len(created_customers) < count:
			print(f"⚠️  Only found {len(created_customers)}/{count} existing customers with tag '{customer_tag}'. Proceeding with available.")
		else:
			print(f"✅ Using {len(created_customers)} existing customers tagged '{customer_tag}'")
	else:
		# Create customers (support offset to avoid duplicates)
		for i in range(count):
			try:
				cid = create_customer(client, gql_url, auth, customer_offset + i + 1, customer_tag)
				created_customers.append(cid)
				if (i + 1) % 50 == 0:
					print(f"✅ Created customers: {i + 1}/{count}")
				# Gentle pacing
				time.sleep(0.15)
			except Exception as e:
				print(f"❌ Customer {customer_offset + i + 1} failed: {e}")
				return 1
		print(f"✅ Created {len(created_customers)} customers")

	# Create and complete orders, then attach test transactions
	for i, cid in enumerate(created_customers, start=1):
		variant_id, variant_price = variants[(i - 1) % len(variants)]
		addr = random_us_address(i)
		try:
			order_gid, legacy_id = create_and_complete_order(
				client, gql_url, auth, cid, variant_id, per_variant_qty, addr, rest_api_base=rest_base, rest_retries=rest_retries, rest_sleep=rest_sleep
			)
			# Pacing before REST call
			time.sleep(0.2)
			# Some shops may require integer cents or strings; pass as string
			amount_str = str(variant_price)
			tx_body = create_test_transaction(client, rest_base, auth, legacy_id, amount=amount_str)
			# Verify test flag
			is_test = verify_order_test_flag(client, gql_url, auth, order_gid)
			created_orders.append(order_gid)
			if (i) % 10 == 0:
				# Print minimal info; include tx id if present
				tx_id = None
				if isinstance(tx_body, dict):
					tx = tx_body.get("transaction") if "transaction" in tx_body else tx_body
					if isinstance(tx, dict):
						tx_id = tx.get("id") or tx.get("gateway")
				print(f"✅ Orders processed: {i}/{count} (test={is_test}, tx={tx_id})")
			# Gentle pacing to manage rate limits overall
			time.sleep(0.25)
		except Exception as e:
			print(f"❌ Order for customer #{i} failed: {e}")
			# continue with next to process as many as possible
			continue

	print()
	print(f"🎉 Completed: customers={len(created_customers)} orders={len(created_orders)}")
	return 0


if __name__ == "__main__":
	sys.exit(main())


