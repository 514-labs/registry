# Google Ads Connector

A TypeScript connector for the Google Ads API using the connector-factory framework.

## What Was Fixed

The original implementation had several issues:

1. **Wrong API Version**: Used deprecated v16 (now v21 is the current supported version)
2. **Wrong Implementation**: Tried to use REST-style GET requests to `/campaigns` endpoint
3. **Missing GAQL Support**: Google Ads API uses GAQL (Google Ads Query Language) with POST requests to `/googleAds:search`

### Key Changes

- ✅ Updated to use `POST /customers/{customerId}/googleAds:search` endpoint
- ✅ Implemented GAQL query building for campaigns and ad groups
- ✅ Updated default API version from v16 to v21
- ✅ Added proper Content-Type headers for JSON requests

## API Version Support

As of October 2025, the supported Google Ads API versions are:
- **V19** - Sunsets February 2026
- **V20** - Sunsets June 2026
- **V21** - Sunsets August 2026 (current default)
- **V22** - Latest release (October 2025)

**Note**: V16, V17, and V18 are deprecated and no longer accessible.

## Developer Token Requirements

⚠️ **Important**: The Google Ads API has different developer token access levels:

- **Test Access** (default): Only works with test accounts
- **Basic Access**: Works with production accounts (up to 15,000 API units/day)
- **Standard Access**: Full production access

If you get this error:
```
DEVELOPER_TOKEN_NOT_APPROVED: The developer token is only approved for use with test accounts
```

You need to apply for Basic or Standard access at: https://developers.google.com/google-ads/api/docs/access-levels

## Usage

```typescript
import { createConnector } from './src'

const conn = createConnector()

// Initialize with OAuth2
conn.initialize({
  baseUrl: 'https://googleads.googleapis.com/v21',
  auth: {
    type: 'bearer',
    bearer: { token: 'YOUR_ACCESS_TOKEN' }
  },
  defaultHeaders: {
    'developer-token': 'YOUR_DEVELOPER_TOKEN',
    'login-customer-id': 'YOUR_CUSTOMER_ID',
  },
  logging: {
    enabled: true,
    level: 'info',
  }
})

// Fetch campaigns (customerId is required)
for await (const page of conn.campaigns.getAll({
  customerId: '1234567890',
  status: 'ENABLED',
  pageSize: 100
})) {
  page.forEach(campaign => {
    console.log(`${campaign.name} (${campaign.id})`)
  })
}
```

## GAQL Queries

The connector now properly uses Google Ads Query Language (GAQL):

### Campaigns
```sql
SELECT campaign.id, campaign.name, campaign.status, campaign.start_date, campaign.end_date
FROM campaign
WHERE campaign.status = 'ENABLED'
```

### Ad Groups
```sql
SELECT ad_group.id, ad_group.name, ad_group.status, ad_group.campaign, campaign.id
FROM ad_group
WHERE ad_group.status = 'ENABLED'
```

## Resources

- [Google Ads API Documentation](https://developers.google.com/google-ads/api)
- [GAQL Reference](https://developers.google.com/google-ads/api/docs/query/overview)
- [Access Levels](https://developers.google.com/google-ads/api/docs/access-levels)
