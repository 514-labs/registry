# Customers

Customers represent people who have purchased from or created an account in a Shopify store.

## API Endpoint

```
GET /admin/api/2024-10/customers.json
```

## Common Queries

### List all customers
```typescript
for await (const page of connector.customers.list()) {
  // Process customers
}
```

### Search for a customer by email
```typescript
const customers = await connector.customers.search({
  query: 'email:john@example.com'
})
```

### Search for customers by name
```typescript
const customers = await connector.customers.search({
  query: 'first_name:John last_name:Doe'
})
```

### Get customers created after a date
```typescript
for await (const page of connector.customers.list({
  created_at_min: '2024-01-01T00:00:00Z'
})) {
  // Process recent customers
}
```

## Key Fields

- **id**: Unique identifier
- **email**: Customer email address
- **first_name**: Customer first name
- **last_name**: Customer last name
- **accepts_marketing**: Marketing consent status
- **verified_email**: Email verification status
- **addresses**: Customer addresses

## Search Query Syntax

The search endpoint supports a powerful query syntax:

- `email:john@example.com` - Search by email
- `first_name:John` - Search by first name
- `last_name:Doe` - Search by last name
- `phone:555-1234` - Search by phone
- `state:enabled` - Filter by account state
- `tag:VIP` - Filter by tag

Multiple criteria can be combined with spaces (AND logic).

## References

- [Shopify Customer API](https://shopify.dev/docs/api/admin-rest/2024-10/resources/customer)
- [Customer Search Query Syntax](https://shopify.dev/docs/api/admin-rest/2024-10/resources/customer#get-customers-search)
