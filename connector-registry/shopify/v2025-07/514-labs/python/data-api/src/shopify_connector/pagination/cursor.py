from __future__ import annotations

from typing import Any, Dict, Iterator, List, Optional

from .base import BasePagination


class CursorPagination(BasePagination):
    """
    Cursor-based pagination for Shopify GraphQL Admin API.

    This implementation expects GraphQL responses with a top-level container
    that has `edges` and `pageInfo { hasNextPage, endCursor }`.
    It discovers the container dynamically (e.g., `orders`, `inventoryItems`).
    """

    def __init__(self, connector: 'ShopifyConnector'):
        self.connector = connector
        self.default_page_size = 100

    def paginate(self, path: str, options: Optional[Dict[str, Any]] = None) -> Iterator[List[Any]]:
        opts = options.copy() if options else {}
        query = opts.setdefault('query', {})
        # Default page size (bounded by transport translation to <=250)
        query.setdefault('limit', self.default_page_size)
        cursor: Optional[str] = query.get('cursor')

        while True:
            # Build request options
            req = {
                'method': 'GET',
                'path': path,
                'query': {**query},
            }
            if cursor:
                req['query']['cursor'] = cursor

            # Execute request
            response = self.connector.request(req)
            data = response.get('data') or {}

            # Extract container with edges/pageInfo
            container = self._find_edges_container(data)
            if not container:
                # Yield empty batch and stop if nothing to page
                yield []
                return

            edges = container.get('edges') or []
            items = [edge.get('node') for edge in edges if isinstance(edge, dict)]
            yield items

            page_info = container.get('pageInfo') or {}
            has_next = bool(page_info.get('hasNextPage'))
            cursor = page_info.get('endCursor') if has_next else None
            if not has_next:
                break

    def _find_edges_container(self, data: Any) -> Optional[Dict[str, Any]]:
        """Finds the first dict value under `data` that has `edges` and `pageInfo`."""
        if isinstance(data, dict):
            for value in data.values():
                if isinstance(value, dict) and 'edges' in value and 'pageInfo' in value:
                    return value
        return None
