# Documentation Index

Welcome to the Shopify Python Connector documentation. This guide helps you navigate to the information you need.

## 🚀 Getting Started

- **[README](README.md)** - Quick overview and getting started
- **[Getting Started](getting-started.md)** - Setup your Shopify store and configure the connector

## 🔧 Development & Configuration

- **[Architecture](architecture.md)** - Technical implementation details and API mapping
- **[Configuration](configuration.md)** - Complete configuration options and examples
- **[Testing](testing.md)** - Testing strategy and development practices

## 🤔 Understanding Our Approach

- **[Why GraphQL?](why-graphql.md)** - Our implementation approach and rationale

## 📖 Quick Reference

### **Basic Usage**
```python
from shopify_connector import ShopifyConnector

connector = ShopifyConnector({
    "shop": "your-store.myshopify.com",
    "apiVersion": "2024-07",
    "accessToken": "your-admin-api-token"
})

connector.connect()
products = connector.get('/products')
connector.disconnect()
```

### **Common Operations**
- **Single Request**: `connector.get('/products')`
- **Pagination**: `connector.paginate('/orders')`
- **Check Connection**: `connector.isConnected()`

### **Key Features**
- Read-only data extraction
- Automatic pagination via Link headers
- Built-in retry and rate limiting
- GraphQL under the hood with REST fallback
- Full API connector specification compliance

## 🎯 What You're Looking For

### **"I want to get started quickly"**
→ Start with [README](README.md), then [Getting Started](getting-started.md)

### **"I need to configure advanced options"**
→ See [Configuration](configuration.md) for retry policies, rate limiting, hooks, etc.

### **"I want to understand how it works"**
→ Read [Architecture](architecture.md) for technical details

### **"I'm developing or contributing"**
→ Check [Testing](testing.md) for development practices

### **"Why did you choose GraphQL?"**
→ Read [Why GraphQL?](why-graphql.md) for our rationale

### **"I need to troubleshoot"**
→ Check the troubleshooting section in [Getting Started](getting-started.md)

## 🔗 External Resources

- [Shopify Admin API Documentation](https://shopify.dev/api/admin)
- [API Connector Specification](../api-connector.mdx)
- [Shopify Partners](https://partners.shopify.com) (for development stores)
