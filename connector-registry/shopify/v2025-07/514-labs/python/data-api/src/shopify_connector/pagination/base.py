"""
Base pagination interface for the Shopify connector.

This module defines the abstract base class that all pagination
methods must implement to work with the connector.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, Iterator, List, Optional


class BasePagination(ABC):
    """
    Abstract base class for pagination methods.
    
    All pagination implementations must inherit from this class
    and implement the required methods for handling Shopify's
    various pagination mechanisms.
    """
    
    @abstractmethod
    def paginate(self, path: str, options: Optional[Dict[str, Any]] = None) -> Iterator[List[Any]]:
        """
        Paginate through a Shopify API endpoint.
        
        This method should return an iterator that yields batches
        of items from the paginated endpoint.
        
        Args:
            path: API endpoint path to paginate
            options: Pagination options including limit, cursor, etc.
        
        Returns:
            Iterator yielding lists of items from each page
        
        Raises:
            PaginationError: If pagination fails
            NetworkError: For network connectivity issues
        """
        pass
    
    def get_page_info(self, response: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extract pagination information from a response.
        
        Args:
            response: API response containing pagination metadata
        
        Returns:
            Dictionary containing pagination information
        """
        # Default implementation - extract common pagination fields
        page_info = {}
        
        # Check for Shopify-specific pagination fields
        if 'page_info' in response:
            page_info['page_info'] = response['page_info']
        
        # Check for Link headers in response headers
        headers = response.get('headers', {})
        if 'Link' in headers:
            page_info['link_header'] = headers['Link']
        
        # Check for cursor-based pagination
        if 'data' in response and isinstance(response['data'], dict):
            data = response['data']
            if 'pageInfo' in data:
                page_info['pageInfo'] = data['pageInfo']
            if 'edges' in data:
                page_info['has_edges'] = True
                page_info['edge_count'] = len(data['edges'])
        
        return page_info
    
    def has_next_page(self, response: Dict[str, Any]) -> bool:
        """
        Check if there are more pages available.
        
        Args:
            response: API response to check
        
        Returns:
            True if more pages are available, False otherwise
        """
        page_info = self.get_page_info(response)
        
        # Check Shopify REST pagination
        if 'page_info' in page_info:
            return True  # If page_info exists, assume there might be more
        
        # Check GraphQL pagination
        if 'pageInfo' in page_info:
            page_info_data = page_info['pageInfo']
            return page_info_data.get('hasNextPage', False)
        
        # Check Link header
        if 'link_header' in page_info:
            link_header = page_info['link_header']
            return 'rel="next"' in link_header
        
        # Default: no more pages
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
        
        # Check Shopify REST pagination
        if 'page_info' in page_info:
            return page_info['page_info']
        
        # Check GraphQL pagination
        if 'pageInfo' in page_info:
            page_info_data = page_info['pageInfo']
            return page_info_data.get('endCursor')
        
        # Check Link header for next URL
        if 'link_header' in page_info:
            link_header = page_info['link_header']
            # Parse Link header to extract next cursor
            # This is a simplified implementation
            if 'rel="next"' in link_header:
                # Extract cursor from next URL
                return self._extract_cursor_from_link(link_header)
        
        return None
    
    def _extract_cursor_from_link(self, link_header: str) -> Optional[str]:
        """
        Extract cursor from Link header.
        
        Args:
            link_header: Link header string
        
        Returns:
            Cursor string or None if not found
        """
        # Simple cursor extraction from Link header
        # This is a basic implementation - can be enhanced
        if 'page_info=' in link_header:
            start = link_header.find('page_info=') + 10
            end = link_header.find('&', start)
            if end == -1:
                end = link_header.find('"', start)
            if end == -1:
                end = len(link_header)
            return link_header[start:end]
        
        return None
    
    def get_pagination_stats(self) -> Dict[str, Any]:
        """
        Get pagination statistics and metrics.
        
        Returns:
            Dictionary containing pagination statistics
        """
        return {
            'type': self.get_pagination_type(),
            'pages_processed': 0,
            'total_items': 0,
            'current_page': 0
        }
    
    def get_pagination_type(self) -> str:
        """
        Get the type of pagination method.
        
        Returns:
            String identifier for the pagination type
        """
        return self.__class__.__name__.lower().replace('pagination', '')
    
    def supports_endpoint(self, endpoint: str) -> bool:
        """
        Check if the pagination method supports a specific endpoint.
        
        Args:
            endpoint: API endpoint path to check
        
        Returns:
            True if endpoint is supported, False otherwise
        """
        # Default implementation - assume all endpoints are supported
        return True
    
    def get_capabilities(self) -> Dict[str, Any]:
        """
        Get pagination capabilities and features.
        
        Returns:
            Dictionary containing pagination capabilities
        """
        return {
            'type': self.get_pagination_type(),
            'supports_cursor': True,
            'supports_offset': False,
            'supports_page_numbers': False,
            'max_page_size': None,
            'default_page_size': None
        }
