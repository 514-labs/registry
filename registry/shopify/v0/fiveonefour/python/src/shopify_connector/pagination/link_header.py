"""
Link header pagination for Shopify's REST API.

This module implements pagination using Shopify's Link header
pagination mechanism, which provides next/previous page URLs.
"""

import logging
from typing import Any, Dict, Iterator, List, Optional

from .base import BasePagination
from ..errors.base import PaginationError, NetworkError


logger = logging.getLogger(__name__)


class LinkHeaderPagination(BasePagination):
    """
    Link header pagination implementation for Shopify REST API.
    
    This paginator handles Shopify's Link header pagination:
    - Link: <https://shop.myshopify.com/admin/api/2024-07/products.json?page_info=...>; rel="next"
    - Automatic cursor extraction and management
    - Support for custom page sizes and limits
    """
    
    def __init__(self, connector: 'ShopifyConnector'):
        """
        Initialize link header pagination.
        
        Args:
            connector: Shopify connector instance for making requests
        """
        self.connector = connector
        self.pages_processed = 0
        self.total_items = 0
        self.current_page = 0
        
        logger.debug("Link header pagination initialized")
    
    def paginate(self, path: str, options: Optional[Dict[str, Any]] = None) -> Iterator[List[Any]]:
        """
        Paginate through a Shopify API endpoint using Link headers.
        
        Args:
            path: API endpoint path to paginate
            options: Pagination options including limit, cursor, etc.
        
        Returns:
            Iterator yielding lists of items from each page
        
        Raises:
            PaginationError: If pagination fails
            NetworkError: For network connectivity issues
        """
        options = options or {}
        
        # Extract pagination options
        limit = options.get('limit', 250)  # Shopify's default
        cursor = options.get('cursor')
        max_pages = options.get('max_pages')
        
        # Build initial request options
        request_options = {
            'method': 'GET',
            'path': path,
            'query': {
                'limit': limit
            }
        }
        
        # Add cursor if provided
        if cursor:
            request_options['query']['page_info'] = cursor
        
        # Add any other query parameters
        if 'query' in options:
            request_options['query'].update(options['query'])
        
        logger.debug("Starting pagination", extra={
            'path': path,
            'limit': limit,
            'cursor': cursor,
            'max_pages': max_pages
        })
        
        page_count = 0
        has_next_page = True
        
        while has_next_page:
            # Check max pages limit
            if max_pages and page_count >= max_pages:
                logger.debug("Max pages limit reached", extra={
                    'page_count': page_count,
                    'max_pages': max_pages
                })
                break
            
            try:
                # Make request
                response = self.connector.request(request_options)
                page_count += 1
                self.current_page = page_count
                
                # Extract items from response
                items = self._extract_items(response, options)
                if items:
                    self.total_items += len(items)
                    yield items
                else:
                    logger.debug("No items in response", extra={
                        'page': page_count,
                        'path': path
                    })
                    break
                
                # Check for next page
                has_next_page = self.has_next_page(response)
                if has_next_page:
                    next_cursor = self.get_next_cursor(response)
                    if next_cursor:
                        # Update request options for next page
                        request_options['query']['page_info'] = next_cursor
                        logger.debug("Next page cursor", extra={
                            'page': page_count,
                            'next_cursor': next_cursor
                        })
                    else:
                        logger.warning("Has next page but no cursor found", extra={
                            'page': page_count,
                            'response': response
                        })
                        break
                else:
                    logger.debug("No more pages available", extra={
                        'page': page_count,
                        'total_items': self.total_items
                    })
                
                self.pages_processed = page_count
                
            except Exception as e:
                logger.error("Pagination failed", extra={
                    'page': page_count,
                    'path': path,
                    'error': str(e)
                })
                raise PaginationError(f"Failed to paginate page {page_count}: {e}")
        
        logger.info("Pagination completed", extra={
            'path': path,
            'pages_processed': self.pages_processed,
            'total_items': self.total_items
        })
    
    def _extract_items(self, response: Dict[str, Any], options: Optional[Dict[str, Any]]) -> List[Any]:
        """
        Extract items from the response based on options.
        
        Args:
            response: API response
            options: Pagination options including extractor function
        
        Returns:
            List of items from the response
        """
        # Check if custom extractor is provided
        extractor = options.get('extractor')
        if extractor and callable(extractor):
            try:
                return extractor(response)
            except Exception as e:
                logger.warning("Custom extractor failed", extra={
                    'error': str(e),
                    'response': response
                })
        
        # Default extraction logic
        if 'data' in response:
            data = response['data']
            if isinstance(data, list):
                return data
            elif isinstance(data, dict):
                # Shopify typically returns data in resource-named keys
                for key, value in data.items():
                    if isinstance(value, list) and not key.startswith('_'):
                        return value
        
        # Fallback to body if data not found
        if 'body' in response:
            body = response['body']
            if isinstance(body, dict):
                for key, value in body.items():
                    if isinstance(value, list) and not key.startswith('_'):
                        return value
        
        return []
    
    def get_page_info(self, response: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extract pagination information from Shopify REST response.
        
        Args:
            response: API response containing pagination metadata
        
        Returns:
            Dictionary containing pagination information
        """
        page_info = super().get_page_info(response)
        
        # Extract Shopify-specific pagination info
        if 'body' in response and isinstance(response['body'], dict):
            body = response['body']
            
            # Check for page_info in response body
            if 'page_info' in body:
                page_info['page_info'] = body['page_info']
            
            # Check for count information
            if 'count' in body:
                page_info['count'] = body['count']
        
        # Parse Link header for next/previous URLs
        headers = response.get('headers', {})
        if 'Link' in headers:
            link_header = headers['Link']
            page_info['link_header'] = link_header
            
            # Parse Link header for navigation
            links = self._parse_link_header(link_header)
            page_info['links'] = links
            
            # Check for next page
            if 'next' in links:
                page_info['has_next'] = True
                page_info['next_url'] = links['next']
            else:
                page_info['has_next'] = False
        
        return page_info
    
    def _parse_link_header(self, link_header: str) -> Dict[str, str]:
        """
        Parse Link header into navigable links.
        
        Args:
            link_header: Link header string
        
        Returns:
            Dictionary mapping rel to URLs
        """
        links = {}
        
        # Split by comma and parse each link
        for link in link_header.split(','):
            link = link.strip()
            
            # Extract URL and rel
            if '<' in link and '>' in link:
                url_start = link.find('<') + 1
                url_end = link.find('>')
                url = link[url_start:url_end]
                
                # Extract rel
                if 'rel=' in link:
                    rel_start = link.find('rel="') + 5
                    rel_end = link.find('"', rel_start)
                    if rel_end != -1:
                        rel = link[rel_start:rel_end]
                        links[rel] = url
        
        return links
    
    def has_next_page(self, response: Dict[str, Any]) -> bool:
        """
        Check if there are more pages available.
        
        Args:
            response: API response to check
        
        Returns:
            True if more pages are available, False otherwise
        """
        page_info = self.get_page_info(response)
        
        # Check Link header for next page
        if 'links' in page_info and 'next' in page_info['links']:
            return True
        
        # Check for page_info in response (indicates more data)
        if 'page_info' in page_info:
            return True
        
        # Check explicit has_next flag
        if 'has_next' in page_info:
            return page_info['has_next']
        
        return False
    
    def get_next_cursor(self, response: Dict[str, Any]) -> Optional[str]:
        """
        Get the cursor for the next page.
        
        Args:
            response: API response containing cursor information
        
        Returns:
            Cursor string for next page, or None if no more pages
        """
        page_info = self.get_page_info(response)
        
        # Check for page_info in response body
        if 'page_info' in page_info:
            return page_info['page_info']
        
        # Extract from next URL in Link header
        if 'next_url' in page_info:
            next_url = page_info['next_url']
            return self._extract_cursor_from_url(next_url)
        
        return None
    
    def _extract_cursor_from_url(self, url: str) -> Optional[str]:
        """
        Extract cursor from URL.
        
        Args:
            url: URL containing cursor parameter
        
        Returns:
            Cursor string or None if not found
        """
        if 'page_info=' in url:
            start = url.find('page_info=') + 10
            end = url.find('&', start)
            if end == -1:
                end = len(url)
            return url[start:end]
        
        return None
    
    def get_pagination_stats(self) -> Dict[str, Any]:
        """
        Get pagination statistics and metrics.
        
        Returns:
            Dictionary containing pagination statistics
        """
        return {
            'type': self.get_pagination_type(),
            'pages_processed': self.pages_processed,
            'total_items': self.total_items,
            'current_page': self.current_page,
            'average_items_per_page': (
                self.total_items / self.pages_processed 
                if self.pages_processed > 0 else 0
            )
        }
    
    def get_capabilities(self) -> Dict[str, Any]:
        """
        Get pagination capabilities and features.
        
        Returns:
            Dictionary containing pagination capabilities
        """
        base_capabilities = super().get_capabilities()
        base_capabilities.update({
            'supports_cursor': True,
            'supports_offset': False,
            'supports_page_numbers': False,
            'max_page_size': 250,  # Shopify's maximum
            'default_page_size': 250,
            'supports_link_headers': True,
            'supports_custom_extractors': True
        })
        return base_capabilities
    
    def __repr__(self) -> str:
        """String representation of the paginator."""
        return (f"LinkHeaderPagination(pages={self.pages_processed}, "
                f"items={self.total_items}, current={self.current_page})")
