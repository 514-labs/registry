"""
GraphQL transport implementation for the Shopify connector.

Uses Shopify's GraphQL Admin API while adhering to the API Connector Specification.
(No REST fallback in this release.)
"""

from __future__ import annotations

import logging
from typing import Any, Dict, Optional, Tuple

from .base import BaseTransport
from .http_client import HTTPClient
from ..auth.base import BaseAuth
from ..config.schema import ShopifyConnectorConfig
from ..errors.base import (
    InvalidRequestError,
    RateLimitError,
    ServerError,
    UnsupportedError,
)


logger = logging.getLogger(__name__)


class GraphQLTransport(BaseTransport):
    """
    GraphQL transport for Shopify Admin API.

    - Translates standard request options to GraphQL queries where possible
    - Executes POST requests to the GraphQL endpoint
    - Maps GraphQL errors and cost headers
    """

    def __init__(self, config: ShopifyConnectorConfig):
        self.config = config
        self.http_client = HTTPClient(config)
        self.auth: Optional[BaseAuth] = None

        logger.debug("GraphQL transport initialized", extra={
            "shop": config.shop,
            "api_version": config.apiVersion,
        })

    def set_auth(self, auth: BaseAuth) -> None:
        self.auth = auth
        logger.debug("Authentication set for GraphQL transport", extra={
            "auth_type": auth.get_auth_type(),
        })

    def execute(self, options: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a Shopify Admin GraphQL API request.

        Expected options (from API spec style):
        - method: HTTP verb (ignored; GraphQL uses POST)
        - path: REST-like path (translated where supported), e.g., '/shop'
        - headers/query/data/json/timeout as needed
        """
        if not isinstance(options, dict):
            raise InvalidRequestError("Options must be a dictionary")

        # Translate options into (query, variables) if supported
        translation = self._translate_to_graphql(options)
        if translation is None:
            raise UnsupportedError(
                f"GraphQL translation not available for path: {options.get('path')}"
            )

        query, variables = translation

        # Build GraphQL endpoint URL
        url = self.config.get_graphql_url()

        # Prepare headers
        headers = dict(options.get("headers", {}))
        headers.setdefault("Content-Type", "application/json")
        # Apply authentication header if available
        if self.auth:
            # Ensure request dict contains headers for auth to modify
            req_for_auth = {"headers": headers}
            self.auth.authenticate(req_for_auth)
            headers = req_for_auth["headers"]

        # Perform request
        payload = {"query": query, "variables": variables or {}}
        timeout = options.get("timeout")

        response = self.http_client.request(
            method="POST",
            url=url,
            headers=headers,
            json=payload,
            timeout=timeout,
        )

        # Process GraphQL-specific response
        processed = self._process_graphql_response(response)
        logger.debug("GraphQL request completed", extra={
            "path": options.get("path"),
            "status_code": processed.get("status_code"),
            "duration_ms": processed.get("duration", 0),
        })
        return processed

    def _translate_to_graphql(self, options: Dict[str, Any]) -> Optional[Tuple[str, Dict[str, Any]]]:
        """
        Translate REST-like request options to GraphQL query/variables.
        Returns (query, variables) or None if unsupported.
        """
        path = options.get("path") or ""
        method = (options.get("method") or "GET").upper()
        query_params = options.get("query") or {}
        page_size = int(query_params.get("limit", 100))
        page_size = min(max(page_size, 1), 250)

        # /shop smoke test
        if method == "GET" and (path == "/shop" or path == "shop"):
            query = (
                "query getShop {\n"
                "  shop {\n"
                "    id\n"
                "    name\n"
                "    myshopifyDomain\n"
                "    email\n"
                "    plan { displayName }\n"
                "  }\n"
                "}\n"
            )
            return query, {}

        # Customers
        if method == "GET" and (path.startswith("/customers") or path.startswith("customers")):
            after = query_params.get("cursor")
            query = (
                "query customers($first: Int!, $after: String) {\n"
                "  customers(first: $first, after: $after) {\n"
                "    edges {\n"
                "      cursor\n"
                "      node {\n"
                "        id\n"
                "        email\n"
                "        firstName\n"
                "        lastName\n"
                "        phone\n"
                "        createdAt\n"
                "        updatedAt\n"
                "        verifiedEmail\n"
                "        state\n"
                "        defaultAddress {\n"
                "          address1\n"
                "          address2\n"
                "          city\n"
                "          province\n"
                "          country\n"
                "          zip\n"
                "        }\n"
                "      }\n"
                "    }\n"
                "    pageInfo { hasNextPage endCursor }\n"
                "  }\n"
                "}\n"
            )
            variables = {"first": page_size}
            if after:
                variables["after"] = after
            return query, variables

        # Inventory: per-location levels (default) or variant-level fallback via query.mode
        if method == "GET" and (path.startswith("/inventory") or path.startswith("inventory")):
            after = query_params.get("cursor")
            mode = (query_params.get("mode") or "levels").lower()
            if mode == "variants":
                # Fallback: inventory via product variants (no per-location detail)
                query = (
                    "query inventoryViaProducts($first: Int!, $after: String) {\n"
                    "  products(first: $first, after: $after) {\n"
                    "    edges {\n"
                    "      cursor\n"
                    "      node { id title\n"
                    "        variants(first: 50) {\n"
                    "          edges {\n"
                    "            node { id sku inventoryQuantity }\n"
                    "          }\n"
                    "        }\n"
                    "      }\n"
                    "    }\n"
                    "    pageInfo { hasNextPage endCursor }\n"
                    "  }\n"
                    "}\n"
                )
            else:
                # Default: inventory items with per-location inventory levels
                # Parameterize quantity names to avoid inline enum formatting issues
                query = (
                    "query inventoryItems($first: Int!, $after: String, $names: [String!]!) {\n"
                    "  inventoryItems(first: $first, after: $after) {\n"
                    "    edges {\n"
                    "      cursor\n"
                    "      node {\n"
                    "        id\n"
                    "        sku\n"
                    "        tracked\n"
                    "        inventoryLevels(first: 50) {\n"
                    "          edges {\n"
                    "            node {\n"
                    "              quantities(names: $names) { name quantity }\n"
                    "              location { id name }\n"
                    "            }\n"
                    "          }\n"
                    "          pageInfo { hasNextPage endCursor }\n"
                    "        }\n"
                    "      }\n"
                    "    }\n"
                    "    pageInfo { hasNextPage endCursor }\n"
                    "  }\n"
                    "}\n"
                )
            variables = {"first": page_size}
            if after:
                variables["after"] = after
            # Allow caller to specify quantity names via query.names; default "available"
            # Accept single string, comma-separated string, or list[str]
            names = query_params.get("names")
            if not names:
                names_list = ["available"]
            elif isinstance(names, str):
                raw_list = [n for n in (names.split(",") if "," in names else [names])]
                names_list = [n.strip() for n in raw_list if n.strip()]
            elif isinstance(names, list):
                names_list = [str(n).strip() for n in names if str(n).strip()]
            else:
                names_list = ["available"]

            # Normalize and validate against known valid quantity names per Shopify Admin API (2025-07)
            valid_names = {
                "available",
                "committed",
                "damaged",
                "incoming",
                "on_hand",
                "quality_control",
                "reserved",
                "safety_stock",
            }

            normalized: list[str] = []
            for name in names_list:
                candidate = name.lower().replace("-", "_").replace(" ", "_")
                # Common aliases
                if candidate == "onhand":
                    candidate = "on_hand"
                if candidate == "qualitycontrol":
                    candidate = "quality_control"
                if candidate == "safetystock":
                    candidate = "safety_stock"
                normalized.append(candidate)

            # Filter to only valid names; default to ["available"] if none valid
            filtered = [n for n in normalized if n in valid_names]
            if not filtered:
                filtered = ["available"]
            variables["names"] = filtered
            return query, variables

        # Orders with richer fields
        if method == "GET" and (path.startswith("/orders") or path.startswith("orders")):
            after = query_params.get("cursor")
            query = (
                "query orders($first: Int!, $after: String) {\n"
                "  orders(first: $first, after: $after, reverse: false) {\n"
                "    edges {\n"
                "      cursor\n"
                "      node {\n"
                "        id\n"
                "        name\n"
                "        createdAt\n"
                "        updatedAt\n"
                "        test\n"
                "        displayFinancialStatus\n"
                "        displayFulfillmentStatus\n"
                "        totalPriceSet { shopMoney { amount currencyCode } }\n"
                "        subtotalPriceSet { shopMoney { amount currencyCode } }\n"
                "        totalTaxSet { shopMoney { amount currencyCode } }\n"
                "        currencyCode\n"
                "        customer { id email firstName lastName }\n"
                "        shippingAddress { city province country zip }\n"
                "        billingAddress { city province country zip }\n"
                "        lineItems(first: 50) {\n"
                "          edges {\n"
                "            node {\n"
                "              name\n"
                "              quantity\n"
                "              discountedTotalSet { shopMoney { amount currencyCode } }\n"
                "              variant { id sku }\n"
                "            }\n"
                "          }\n"
                "        }\n"
                "      }\n"
                "    }\n"
                "    pageInfo { hasNextPage endCursor }\n"
                "  }\n"
                "}\n"
            )
            variables = {"first": page_size}
            if after:
                variables["after"] = after
            return query, variables

        return None

    def _process_graphql_response(self, response: Dict[str, Any]) -> Dict[str, Any]:
        """
        Normalize GraphQL response into standard connector response shape.
        """
        status = response.get("status_code", 200)
        body = response.get("body")
        headers = response.get("headers", {})

        # If non-JSON or HTTP error, surface as InvalidRequestError
        if status >= 400 and not isinstance(body, dict):
            raise InvalidRequestError(
                f"GraphQL HTTP error: {status}",
                status_code=status,
                details={"body": str(body)[:200]}
            )

        # Shopify GraphQL returns 200 even for logical errors; inspect 'errors'
        if isinstance(body, dict):
            errors = body.get("errors")
            if errors:
                # Extract primary error context
                first_err = errors[0] if isinstance(errors, list) and errors else {}
                message = first_err.get("message") or "GraphQL error"
                ext = (first_err.get("extensions") or {})
                code = ext.get("code")

                # Detect throttling if present in extensions
                if code in {"THROTTLED", "THROTTLED_DUE_TO_COST_LIMIT"}:
                    raise RateLimitError("GraphQL throttled", details={"errors": errors})

                # Classify common non-retryable validation/user-input errors
                validation_codes = {
                    "GRAPHQL_VALIDATION_FAILED",
                    "GRAPHQL_PARSE_FAILED",
                    "BAD_USER_INPUT",
                    "VARIABLE_VALUE_INVALID",
                    "FIELD_NOT_FOUND",
                }
                if code in validation_codes:
                    raise InvalidRequestError(
                        f"GraphQL invalid request: {message}",
                        details={"errors": errors}
                    )

                # Authentication/authorization
                if code in {"UNAUTHENTICATED", "FORBIDDEN"}:
                    from ..errors.base import AuthFailedError
                    raise AuthFailedError(
                        f"GraphQL auth error: {message}",
                        details={"errors": errors}
                    )

                # Default: server error (retryable by policy)
                raise ServerError(f"GraphQL error: {message}", details={"errors": errors})

            processed = {
                "status_code": status,
                "headers": headers,
                "body": body,
                "data": body.get("data"),
            }

            extensions = body.get("extensions") or {}
            cost = extensions.get("cost")
            if cost:
                throttle = cost.get("throttleStatus") or {}
                headers = dict(headers)
                # Map to rateLimit in meta via headers the connector already extracts
                headers["X-GraphQL-Requested-Query-Cost"] = str(cost.get("requestedQueryCost"))
                headers["X-GraphQL-Actual-Query-Cost"] = str(cost.get("actualQueryCost"))
                headers["X-GraphQL-Throttle-Current-Cost"] = str(throttle.get("currentCost"))
                headers["X-GraphQL-Throttle-Maximum"] = str(throttle.get("maximumAvailable"))
                headers["X-GraphQL-Throttle-RestoreRate"] = str(throttle.get("restoreRate"))
                processed["headers"] = headers

            return processed

        # Unexpected shape
        raise InvalidRequestError(
            "Unexpected GraphQL response", details={"status": status, "body": str(body)[:200]}
        )

    def close(self) -> None:
        if self.http_client:
            self.http_client.close()
        logger.debug("GraphQL transport closed")

    def is_healthy(self) -> bool:
        return bool(self.http_client and self.http_client.is_healthy())

    def get_capabilities(self) -> Dict[str, Any]:
        base = super().get_capabilities()
        base.update({
            "methods": ["POST"],
            "features": {
                "batch_requests": False,
                "graph_cost_awareness": True,
            },
        })
        return base
