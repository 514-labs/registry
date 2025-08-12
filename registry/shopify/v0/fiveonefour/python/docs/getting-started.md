## Getting Started — Connect to Shopify (Read‑Only)

This guide explains how to prepare your Shopify store and configuration so the Python Shopify connector can read data from your store using the GraphQL Admin API under the hood.

### Prerequisites

- A Shopify store (development store recommended for testing)
- Admin access to create a custom app in the store
- Decision on auth mode (custom app token vs public app OAuth)

**Note**: If you don't have a Shopify store yet, you can create a development store through [Shopify Partners](https://partners.shopify.com) for free testing.

### Development Store Setup (Recommended for Testing)

If you're new to Shopify development, we recommend starting with a development store:

1. **Create a Shopify Partners Account**: Go to [partners.shopify.com](https://partners.shopify.com) and sign up for a free account
2. **Create a Development Store**: In your Partners dashboard, click "Stores" → "Add store" → "Development store"
3. **Store Details**: Choose a name and select "Development store" as the store type
4. **Populate with Test Data**: Choose "populate with generated test data" during creation to start with realistic products, customers, and orders
5. **Access**: You'll get admin access to this store for testing your connector
6. **Benefits**: Development stores are free, can't process real payments, and are perfect for API testing

**Note**: Your store URL will be `your-name.myshopify.com` - keep this for API calls.

### Test Data and Checkout Flows

For realistic testing of your connector, especially if you'll be reading orders and payment data:

1. **Generated Test Data**: Choose "populate with generated test data" when creating your development store to start with realistic products, customers, and orders
2. **Test Payment Gateway**: Enable Bogus Gateway (or Shopify Payments test mode) to place test orders without real charges
3. **Test Order Flow**: Use Shopify's test card numbers to simulate successful and failed payments
4. **Sample Data Apps**: If you want different test fixtures, you can add sample data apps from the Shopify App Store

**Why This Matters**: Having realistic test data ensures your connector can handle real-world scenarios and edge cases during development.

### Shopify CLI (Optional for Future Development)

If you later decide to turn your connector into an installable Shopify app:

1. **Install Shopify CLI**: `npm install -g @shopify/cli @shopify/theme`
2. **Login**: `shopify auth login`
3. **App Development**: Use `shopify app dev` for local development with hot reloading
4. **Store Preview**: `shopify store preview` to test your app in different store contexts

**Note**: This is optional for the current read-only connector implementation but useful if you plan to expand functionality later.

### Choose authentication mode

- Recommended for single‑store setups: custom app with Admin API access token.
- Public app OAuth (Shopify Partners) is possible but not required for read‑only extraction in one store. Note: order data for public apps may require additional approvals from Shopify.

**Important Note**: This connector uses the **GraphQL Admin API** by default with no REST fallback in this release. Provide `SHOPIFY_SHOP`, `SHOPIFY_API_VERSION` (e.g., `2025-07`), and `SHOPIFY_ACCESS_TOKEN` before use. REST may be added later if needed.

**Future Considerations**: 
- REST API will continue to work for existing implementations
- New public apps distributed after April 1, 2025, must use GraphQL
- For read-only data extraction, REST provides a simpler, more straightforward interface
- If you need to build a distributable app later, consider migrating to GraphQL

### Create a custom app and token

1. **Access the Shopify Admin**: Log into your Shopify store admin panel
2. **Navigate to Apps**: Go to Settings → Apps and sales channels → Develop apps (enable if prompted)
3. **Create an App**: Click "Create an app" and give it a name
4. **Configure Admin API access**:
   - In the app configuration, go to "Admin API access scopes"
   - Grant only the read scopes you need (least‑privilege principle):
     - **Products/Variants/Collections**: `read_products`, `read_collections` (or `read_collection_listings`)
     - **Inventory/Locations**: `read_inventory`, `read_locations`
     - **Orders/Fulfillments/Transactions**: `read_orders`, `read_fulfillments`
     - **Customers**: `read_customers`
5. **Install the app**: Click "Install app" to add it to your store
6. **Get the access token**: After installation, you'll see the "Admin API access token" - this is your authentication credential
7. **Store securely**: Save this token; it will be sent as the `X-Shopify-Access-Token` header with every API request

**Understanding API Scopes**: Each scope grants access to specific data. For example:
- `read_products` allows you to fetch products, variants, and their metadata
- `read_orders` gives access to order history, customer details, and fulfillment status
- `read_inventory` provides current stock levels across locations
- Start with minimal scopes and add more as needed for your use case

### Collect configuration values

- Shop domain: `your-store.myshopify.com` (no protocol)
- API version: e.g., `2025-07` (pin a stable version)
- Access token: from the custom app install page
- Optional: proxy/TLS settings, request timeout, concurrency preferences

### Environment variables (example)

```bash
export SHOPIFY_SHOP="your-store.myshopify.com"
export SHOPIFY_API_VERSION="2025-07"
export SHOPIFY_ACCESS_TOKEN="<your-admin-api-access-token>"
```

### Connector configuration mapping

Use these values when configuring the connector:

```json
{
  "shop": "{SHOPIFY_SHOP}",
  "apiVersion": "2025-07",
  "accessToken": "<SHOPIFY_ACCESS_TOKEN>",
  "defaults": { "query": { "limit": 250 } }
}
```

**Note**: This is a minimal configuration. For advanced options including retry policies, rate limiting, connection pooling, and hooks, see the [Configuration Guide](configuration.md).

### Validate credentials (smoke test)

- Make a read request to `GET /admin/api/{version}/shop.json` with header `X-Shopify-Access-Token: <token>`
- A 200 response confirms domain, version, and token are correct
- Expect `X-Shopify-Shop-Api-Call-Limit: used/40` in response headers

**Optional REST Smoke Test (Manual)**:

```python
import requests

store = "your-store-name"               # no https, just the subdomain
token = "shpat_xxx"                     # Admin API access token
url = f"https://{store}.myshopify.com/admin/api/2025-07/shop.json"

r = requests.get(url, headers={
    "X-Shopify-Access-Token": token
})
r.raise_for_status()
print(r.json())

# If that returns shop data, your connector is authenticated and ready to go
```

### Operational considerations

- **Rate limits**: REST uses a 40-token leaky bucket at ≈2 rps; GraphQL uses a cost-based model. The connector adapts from `X-Shopify-Shop-Api-Call-Limit` and maps GraphQL cost extensions into headers for visibility. 429 is retried with backoff and `Retry-After`.
- **Pagination**: Uses GraphQL cursors (`edges`/`pageInfo`) with `limit` defaulted and capped internally (≤250).
- **Versioning**: Pin `apiVersion` and monitor `X-Shopify-Api-Deprecated-Reason` warnings.
- **Security**: Never commit tokens; store secrets securely.

### Public app OAuth (optional)

- Create an app in Shopify Partners, configure redirect URLs, and request the same read scopes as above.
- Be aware of restrictions for protected data (e.g., orders) and Shopify’s approval process.

### Next steps

- Provide the shop domain, API version, and access token to the connector's configuration.
- Start with low scope reads (Products/Customers) and validate pagination and rate limits before scaling to Orders.

## 📚 Additional Documentation

- **[Architecture](architecture.md)** - Technical implementation details and API mapping
- **[Configuration](configuration.md)** - Complete configuration options and examples
- **[Testing](testing.md)** - Testing strategy and development practices
- **[Why GraphQL?](why-graphql.md)** - Our implementation approach and rationale

### Troubleshooting Common Issues

**401 Unauthorized**: Check that your access token is correct and hasn't been revoked
**403 Forbidden**: Verify you have the correct API scopes enabled for the endpoint you're trying to access
**404 Not Found**: Ensure your shop domain is correct and the API version exists
**429 Too Many Requests**: The connector handles this automatically, but you can monitor rate limit headers
**500+ Server Errors**: These are usually temporary; the connector will retry automatically

**Still having issues?** Check the [Shopify API documentation](https://shopify.dev/api) for endpoint-specific requirements and limitations.


