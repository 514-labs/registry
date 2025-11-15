# Orders

Orders represent customer purchases in a Shopify store. Each order contains line items, customer information, and fulfillment details.

## API Endpoint

```
GET /admin/api/2024-10/orders.json
```

## Common Queries

### List all open orders
```typescript
for await (const page of connector.orders.list({ status: 'open' })) {
  // Process orders
}
```

### Filter by financial status
```typescript
for await (const page of connector.orders.list({
  financial_status: 'paid'
})) {
  // Process paid orders
}
```

### Filter by fulfillment status
```typescript
for await (const page of connector.orders.list({
  fulfillment_status: 'unfulfilled'
})) {
  // Process unfulfilled orders
}
```

### Get recent orders
```typescript
for await (const page of connector.orders.list({
  created_at_min: '2024-01-01T00:00:00Z'
})) {
  // Process recent orders
}
```

## Key Fields

- **id**: Unique identifier
- **name**: Order number (e.g., #1001)
- **email**: Customer email
- **financial_status**: Payment status
- **fulfillment_status**: Shipping status
- **line_items**: Products in the order
- **total_price**: Total order value

## References

- [Shopify Order API](https://shopify.dev/docs/api/admin-rest/2024-10/resources/order)
