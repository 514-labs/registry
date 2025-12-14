# Products

Products are the goods and services that merchants sell. Each product can have multiple variants (e.g., different sizes or colors).

## API Endpoint

```
GET /admin/api/2024-10/products.json
```

## Common Queries

### List all active products
```typescript
for await (const page of connector.products.list({ status: 'active' })) {
  // Process products
}
```

### Filter by vendor
```typescript
for await (const page of connector.products.list({ vendor: 'Nike' })) {
  // Process products
}
```

### Filter by product type
```typescript
for await (const page of connector.products.list({ product_type: 'Shoes' })) {
  // Process products
}
```

### Get products updated since a date
```typescript
for await (const page of connector.products.list({
  updated_at_min: '2024-01-01T00:00:00Z'
})) {
  // Process products
}
```

## Key Fields

- **id**: Unique identifier
- **title**: Product name
- **handle**: URL-friendly unique identifier
- **status**: Product status (active, archived, draft)
- **variants**: Array of product variants with prices and inventory
- **images**: Product images

## References

- [Shopify Product API](https://shopify.dev/docs/api/admin-rest/2024-10/resources/product)
