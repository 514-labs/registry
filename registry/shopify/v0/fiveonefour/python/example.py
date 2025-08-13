#!/usr/bin/env python3
"""
Example usage of the Shopify Python Connector.

This script demonstrates the basic usage patterns for the connector,
including initialization, connection, data extraction, and pagination.
"""

import os
import sys
from typing import Dict, Any

# Add src to path for local development
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from shopify_connector import ShopifyConnector, ShopifyConnectorConfig


def main():
    """Main example function."""
    
    # Configuration - you can set these via environment variables
    # export SHOPIFY_SHOP="your-store.myshopify.com"
    # export SHOPIFY_ACCESS_TOKEN="shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    
    config = {
        "shop": os.getenv("SHOPIFY_SHOP", "your-store.myshopify.com"),
        "accessToken": os.getenv("SHOPIFY_ACCESS_TOKEN", "your-access-token"),
        "apiVersion": "2025-07",
        "timeout": 30000,
        "useGraphQL": True,
        "fallbackToREST": True,
    }
    
    print("🚀 Shopify Connector Example")
    print("=" * 50)
    
    try:
        # Initialize connector
        print("1. Initializing connector...")
        connector = ShopifyConnector(config)
        print(f"   ✅ Connector initialized for shop: {config['shop']}")
        
        # Connect to Shopify
        print("\n2. Connecting to Shopify...")
        connector.connect()
        print("   ✅ Successfully connected!")
        
        # Check connection status
        status = connector.get_status()
        print(f"   📊 Connection status: {status['connected']}")
        print(f"   🏪 Shop: {status['shop']}")
        print(f"   🔌 API Version: {status['api_version']}")
        
        # Get shop information
        print("\n3. Fetching shop information...")
        shop_response = connector.get('/shop')
        print(f"   ✅ Shop data retrieved (Status: {shop_response['status']})")
        
        if 'data' in shop_response and 'shop' in shop_response['data']:
            shop_data = shop_response['data']['shop']
            print(f"   🏪 Shop Name: {shop_data.get('name', 'N/A')}")
            print(f"   🌐 Domain: {shop_data.get('domain', 'N/A')}")
            print(f"   📧 Email: {shop_data.get('email', 'N/A')}")
        
        # Get products with pagination
        print("\n4. Fetching products with pagination...")
        products_iterator = connector.paginate('/products', {'limit': 5})
        
        total_products = 0
        for page_num, products in enumerate(products_iterator, 1):
            print(f"   📄 Page {page_num}: {len(products)} products")
            total_products += len(products)
            
            # Show first few products
            for i, product in enumerate(products[:3]):
                print(f"      {i+1}. {product.get('title', 'No title')} (ID: {product.get('id', 'N/A')})")
            
            if page_num >= 3:  # Limit to 3 pages for demo
                print("      ... (truncated for demo)")
                break
        
        print(f"   ✅ Retrieved {total_products} products total")
        
        # Get orders (if you have the scope)
        print("\n5. Fetching recent orders...")
        try:
            orders_response = connector.get('/orders', {
                'limit': 3,
                'status': 'any'
            })
            print(f"   ✅ Orders data retrieved (Status: {orders_response['status']})")
            
            if 'data' in orders_response and 'orders' in orders_response['data']:
                orders = orders_response['data']['orders']
                print(f"   📦 Retrieved {len(orders)} orders")
                
                for i, order in enumerate(orders[:2], 1):
                    print(f"      {i}. Order #{order.get('order_number', 'N/A')} - {order.get('financial_status', 'N/A')}")
            else:
                print("   ⚠️  No orders data in response")
                
        except Exception as e:
            print(f"   ⚠️  Could not fetch orders: {e}")
            print("      (This might be due to missing 'read_orders' scope)")
        
        # Show response metadata
        print("\n6. Response metadata example:")
        if 'meta' in shop_response:
            meta = shop_response['meta']
            print(f"   🕒 Timestamp: {meta.get('timestamp', 'N/A')}")
            print(f"   ⏱️  Duration: {meta.get('duration', 'N/A')}ms")
            print(f"   🔄 Retry Count: {meta.get('retryCount', 'N/A')}")
            print(f"   🆔 Request ID: {meta.get('requestId', 'N/A')}")
            
            if 'rateLimit' in meta:
                rate_limit = meta['rateLimit']
                print(f"   📊 Rate Limit: {rate_limit.get('used', 'N/A')}/{rate_limit.get('limit', 'N/A')}")
        
        # Disconnect
        print("\n7. Disconnecting...")
        connector.disconnect()
        print("   ✅ Successfully disconnected")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nTroubleshooting tips:")
        print("1. Check your SHOPIFY_SHOP and SHOPIFY_ACCESS_TOKEN environment variables")
        print("2. Verify your access token has the required scopes")
        print("3. Ensure your shop domain is correct")
        print("4. Check the getting-started.md guide for setup instructions")
        return 1
    
    print("\n🎉 Example completed successfully!")
    print("\nNext steps:")
    print("1. Review the documentation in the docs/ folder")
    print("2. Check out the implementation plan for development details")
    print("3. Run tests with: pytest tests/")
    print("4. Customize configuration for your use case")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
