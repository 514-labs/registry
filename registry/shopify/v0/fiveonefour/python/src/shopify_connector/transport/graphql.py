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

        # Inventory (locations and levels depend on scope; start with inventory via products)
        if method == "GET" and (path.startswith("/inventory") or path.startswith("inventory")):
            after = query_params.get("cursor")
            query = (
                "query inventoryViaProducts($first: Int!, $after: String) {\n"
                "  products(first: $first, after: $after) {\n"
                "    edges {\n"
                "      cursor\n"
                "      node { id title\n"
                "        variants(first: 10) {\n"
                "          edges {\n"
                "            node { id sku\n"
                "              inventoryItem { id sku\n"
                "                inventoryLevels(first: 10) {\n"
                "                  edges { node { available location { id name } } }\n"
                "                }\n"
                "              }\n"
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

        # Orders
        if method == "GET" and (path.startswith("/orders") or path.startswith("orders")):
            after = query_params.get("cursor")
            query = (
                "query orders($first: Int!, $after: String) {\n"
                "  orders(first: $first, after: $after, reverse: false) {\n"
                "    edges {\n"
                "      cursor\n"
                "      node { id name createdAt totalPriceSet { shopMoney { amount currencyCode } } customer { id email } }\n"
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
                # Detect throttling if present in extensions
                for err in errors:
                    code = (err.get("extensions") or {}).get("code")
                    if code in {"THROTTLED", "THROTTLED_DUE_TO_COST_LIMIT"}:
                        raise RateLimitError("GraphQL throttled", details={"errors": errors})
                # Otherwise, surface as server error for now
                raise ServerError("GraphQL error", details={"errors": errors})

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
