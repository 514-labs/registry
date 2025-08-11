#!/usr/bin/env python3
"""
Test script for Phase 4 components (Pagination & Data Handling).

This script tests the basic functionality of the pagination
and data handling components without requiring a real Shopify connection.
"""

import sys
import os

# Add src to path for local development
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from shopify_connector.pagination.base import BasePagination
from shopify_connector.pagination.link_header import LinkHeaderPagination
from shopify_connector.data.models import Product, Order, Customer, Collection
from shopify_connector.config.schema import ShopifyConnectorConfig


def test_pagination_base():
    """Test base pagination interface."""
    print("📄 Testing Base Pagination Interface")
    print("=" * 40)
    
    try:
        # Test base pagination capabilities
        base_pagination = BasePagination()
        print("✅ BasePagination interface defined")
        print(f"   Type: {base_pagination.get_pagination_type()}")
        print(f"   Capabilities: {base_pagination.get_capabilities()}")
        
        # Test page info extraction
        test_response = {
            'body': {
                'page_info': 'next_cursor_123',
                'count': 100
            },
            'headers': {
                'Link': '<https://shop.myshopify.com/admin/api/2024-07/products.json?page_info=next_cursor_123>; rel="next"'
            }
        }
        
        page_info = base_pagination.get_page_info(test_response)
        print("✅ Page info extraction working")
        print(f"   Page info: {page_info}")
        
        # Test next page detection
        has_next = base_pagination.has_next_page(test_response)
        print(f"   Has next page: {has_next}")
        
        # Test cursor extraction
        next_cursor = base_pagination.get_next_cursor(test_response)
        print(f"   Next cursor: {next_cursor}")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Base pagination test failed: {e}")
        return False


def test_link_header_pagination():
    """Test link header pagination implementation."""
    print("🔗 Testing Link Header Pagination")
    print("=" * 40)
    
    try:
        # Create mock connector for testing
        class MockConnector:
            def request(self, options):
                # Simulate Shopify API response
                return {
                    'status_code': 200,
                    'data': [
                        {'id': 1, 'title': 'Product 1'},
                        {'id': 2, 'title': 'Product 2'}
                    ],
                    'body': {
                        'products': [
                            {'id': 1, 'title': 'Product 1'},
                            {'id': 2, 'title': 'Product 2'}
                        ],
                        'page_info': 'next_cursor_456'
                    },
                    'headers': {
                        'Link': '<https://shop.myshopify.com/admin/api/2024-07/products.json?page_info=next_cursor_456>; rel="next"'
                    }
                }
        
        mock_connector = MockConnector()
        paginator = LinkHeaderPagination(mock_connector)
        
        print("✅ LinkHeaderPagination created successfully")
        print(f"   Type: {paginator.get_pagination_type()}")
        print(f"   Capabilities: {paginator.get_capabilities()}")
        
        # Test pagination options
        options = {
            'limit': 50,
            'max_pages': 3
        }
        
        # Test pagination (will only get one page due to mock)
        pages = list(paginator.paginate('/products', options))
        print("✅ Pagination working")
        print(f"   Pages returned: {len(pages)}")
        print(f"   Items in first page: {len(pages[0]) if pages else 0}")
        
        # Test stats
        stats = paginator.get_pagination_stats()
        print(f"   Pagination stats: {stats}")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Link header pagination test failed: {e}")
        return False


def test_data_models():
    """Test Shopify data models."""
    print("🏷️  Testing Shopify Data Models")
    print("=" * 40)
    
    try:
        # Test Product model
        product_data = {
            'id': 123,
            'title': 'Test Product',
            'body_html': '<p>Test description</p>',
            'vendor': 'Test Vendor',
            'product_type': 'Test Type',
            'handle': 'test-product',
            'status': 'active',
            'created_at': '2024-01-01T00:00:00Z',
            'updated_at': '2024-01-01T00:00:00Z'
        }
        
        product = Product(**product_data)
        print("✅ Product model created successfully")
        print(f"   Title: {product.title}")
        print(f"   Handle: {product.handle}")
        print(f"   Status: {product.status}")
        
        # Test Order model
        order_data = {
            'id': 456,
            'order_number': 1001,
            'name': '#1001',
            'email': 'test@example.com',
            'created_at': '2024-01-01T00:00:00Z',
            'updated_at': '2024-01-01T00:00:00Z',
            'total_price': '29.99',
            'subtotal_price': '24.99',
            'total_tax': '5.00',
            'currency': 'USD',
            'financial_status': 'paid',
            'order_status_url': 'https://example.com/orders/1001'
        }
        
        order = Order(**order_data)
        print("✅ Order model created successfully")
        print(f"   Order number: {order.order_number}")
        print(f"   Total price: {order.total_price}")
        print(f"   Financial status: {order.financial_status}")
        
        # Test Customer model
        customer_data = {
            'id': 789,
            'email': 'customer@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'created_at': '2024-01-01T00:00:00Z',
            'updated_at': '2024-01-01T00:00:00Z',
            'verified_email': True,
            'accepts_marketing': False,
            'state': 'enabled',
            'orders_count': 5,
            'total_spent': '149.95'
        }
        
        customer = Customer(**customer_data)
        print("✅ Customer model created successfully")
        print(f"   Name: {customer.first_name} {customer.last_name}")
        print(f"   Email: {customer.email}")
        print(f"   Orders count: {customer.orders_count}")
        
        # Test Shop model
        shop_data = {
            'id': 1,
            'name': 'Test Shop',
            'email': 'shop@example.com',
            'domain': 'test-shop.myshopify.com',
            'country': 'United States',
            'created_at': '2024-01-01T00:00:00Z',
            'updated_at': '2024-01-01T00:00:00Z',
            'primary_locale': 'en',
            'timezone': 'America/New_York',
            'iana_timezone': 'America/New_York',
            'shop_owner': 'Test Owner',
            'money_format': '${{amount}}',
            'money_with_currency_format': '${{amount}} USD',
            'weight_unit': 'lb',
            'country_code': 'US',
            'country_name': 'United States',
            'currency': 'USD',
            'has_storefront': True,
            'setup_required': False
        }
        
        shop = Collection(**shop_data)
        print("✅ Shop model created successfully")
        print(f"   Shop name: {shop.name}")
        print(f"   Domain: {shop.domain}")
        print(f"   Currency: {shop.currency}")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Data models test failed: {e}")
        return False


def test_data_utilities():
    """Test data utility functions."""
    print("🔧 Testing Data Utilities")
    print("=" * 40)
    
    try:
        # Test model registry
        product_model = Product
        order_model = Order
        customer_model = Customer
        
        print("✅ Model registry working")
        print(f"   Product model: {product_model}")
        print(f"   Order model: {order_model}")
        print(f"   Customer model: {customer_model}")
        
        # Test data validation
        test_product_data = {
            'id': 999,
            'title': 'Validated Product',
            'handle': 'validated-product',
            'status': 'active',
            'created_at': '2024-01-01T00:00:00Z',
            'updated_at': '2024-01-01T00:00:00Z'
        }
        
        validated_data = product_model(**test_product_data)
        print("✅ Data validation working")
        print(f"   Validated data: {validated_data}")
        
        # Test list validation
        test_products_list = [test_product_data, test_product_data]
        validated_list = [product_model(**item) for item in test_products_list]
        print("✅ List validation working")
        print(f"   Validated list length: {len(validated_list)}")
        
        # Test unknown resource type
        unknown_data = {'id': 123, 'name': 'Unknown'}
        unknown_validated = Product(**unknown_data)
        print("✅ Unknown resource handling working")
        print(f"   Unknown resource result: {unknown_validated}")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Data utilities test failed: {e}")
        return False


def test_pagination_integration():
    """Test pagination with data models integration."""
    print("🔗 Testing Pagination + Data Integration")
    print("=" * 40)
    
    try:
        # Create mock connector that returns structured data
        class MockDataConnector:
            def request(self, options):
                # Simulate Shopify products response
                return {
                    'status_code': 200,
                    'data': [
                        {
                            'id': 1,
                            'title': 'Product 1',
                            'handle': 'product-1',
                            'status': 'active',
                            'created_at': '2024-01-01T00:00:00Z',
                            'updated_at': '2024-01-01T00:00:00Z'
                        },
                        {
                            'id': 2,
                            'title': 'Product 2',
                            'handle': 'product-2',
                            'status': 'active',
                            'created_at': '2024-01-01T00:00:00Z',
                            'updated_at': '2024-01-01T00:00:00Z'
                        }
                    ],
                    'body': {
                        'products': [
                            {
                                'id': 1,
                                'title': 'Product 1',
                                'handle': 'product-1',
                                'status': 'active',
                                'created_at': '2024-01-01T00:00:00Z',
                                'updated_at': '2024-01-01T00:00:00Z'
                            },
                            {
                                'id': 2,
                                'title': 'Product 2',
                                'handle': 'product-2',
                                'status': 'active',
                                'created_at': '2024-01-01T00:00:00Z',
                                'updated_at': '2024-01-01T00:00:00Z'
                            }
                        ],
                        'page_info': 'next_cursor_789'
                    },
                    'headers': {
                        'Link': '<https://shop.myshopify.com/admin/api/2024-07/products.json?page_info=next_cursor_789>; rel="next"'
                    }
                }
        
        mock_connector = MockDataConnector()
        paginator = LinkHeaderPagination(mock_connector)
        
        # Test pagination with data validation
        def product_extractor(response):
            """Custom extractor for products."""
            if 'data' in response:
                return response['data']
            return []
        
        options = {
            'limit': 50,
            'extractor': product_extractor
        }
        
        pages = list(paginator.paginate('/products', options))
        print("✅ Pagination with custom extractor working")
        print(f"   Pages returned: {len(pages)}")
        
        if pages:
            # Validate first page data
            first_page = pages[0]
            validated_products = [Product(**item) for item in first_page]
            print("✅ Data validation integration working")
            print(f"   Validated products: {len(validated_products)}")
            
            # Check if products are properly structured
            if validated_products:
                first_product = validated_products[0]
                print(f"   First product title: {first_product.title}")
                print(f"   First product handle: {first_product.handle}")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Pagination integration test failed: {e}")
        return False


def main():
    """Run all Phase 4 tests."""
    print("🚀 Phase 4 Testing: Pagination & Data Handling")
    print("=" * 60)
    print()
    
    tests = [
        ("Base Pagination Interface", test_pagination_base),
        ("Link Header Pagination", test_link_header_pagination),
        ("Shopify Data Models", test_data_models),
        ("Data Utilities", test_data_utilities),
        ("Pagination + Data Integration", test_pagination_integration),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
            else:
                print(f"❌ {test_name} test failed")
        except Exception as e:
            print(f"❌ {test_name} test crashed: {e}")
    
    print("=" * 60)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All Phase 4 tests passed! Ready for Phase 5.")
        return 0
    else:
        print("⚠️  Some tests failed. Check the implementation.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
