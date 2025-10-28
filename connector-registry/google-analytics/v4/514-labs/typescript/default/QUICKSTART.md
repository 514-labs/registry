# Google Analytics GA4 Connector - Quick Start Guide

This guide will get you up and running with the Google Analytics GA4 connector in under 10 minutes.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup Steps](#setup-steps)
3. [Authentication Methods](#authentication-methods)
4. [Running the Example](#running-the-example)
5. [Next Steps](#next-steps)

## Prerequisites

- Node.js >= 20 installed
- A Google Cloud Project
- Access to a Google Analytics 4 property

## Setup Steps

### 1. Enable the Google Analytics Data API

```bash
# Quick link to enable the API
# https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com
```

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select or create a project
3. Navigate to **APIs & Services > Library**
4. Search for "Google Analytics Data API"
5. Click **Enable**

### 2. Choose Your Authentication Method

You have three options. We recommend **Service Account** for most use cases.

#### Option A: Service Account (Recommended)

**When to use:** Production applications, server-to-server integrations

**Steps:**
1. Go to [Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Click **Create Service Account**
3. Name it (e.g., "ga4-connector") and click **Create** then **Done**
4. Click on the service account > **Keys** tab
5. Click **Add Key > Create New Key** > Choose **JSON** > Click **Create**
6. Save the downloaded JSON file securely

**Grant GA4 Access:**
1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (bottom left)
3. Under **Property**, click **Property Access Management**
4. Click **+** (top right) to add the service account email
5. Grant **Viewer** permissions (or higher if needed)

**Get Property ID:**
1. In Google Analytics Admin, click **Property Settings**
2. Copy the Property ID (numeric, e.g., 123456789)

#### Option B: OAuth 2.0

**When to use:** User-based access, desktop/web applications

**Steps:**
1. Go to [Credentials](https://console.cloud.google.com/apis/credentials)
2. Click **Create Credentials > OAuth client ID**
3. Configure OAuth consent screen if prompted
4. Choose **Desktop app** or **Web application**
5. Save the Client ID and Client Secret

**Get Refresh Token:**
1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click settings icon (top right)
3. Check "Use your own OAuth credentials"
4. Enter your Client ID and Client Secret
5. Select "Google Analytics Data API v1" scope
6. Authorize with your Google account
7. Exchange authorization code for tokens
8. Copy the refresh token

#### Option C: API Key

**When to use:** Public data access only (limited functionality)

**Steps:**
1. Go to [Credentials](https://console.cloud.google.com/apis/credentials)
2. Click **Create Credentials > API Key**
3. Copy the API key
4. (Recommended) Restrict the key to Google Analytics Data API

### 3. Install Dependencies

```bash
cd /Users/georgeanderson/514/registry/connector-registry/google-analytics/ga4/514labs/typescript/default
pnpm install
```

### 4. Configure Environment Variables

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `.env` based on your authentication method:

**For Service Account:**
```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
GOOGLE_PROPERTY_ID=123456789
```

**For OAuth 2.0:**
```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token
GOOGLE_PROPERTY_ID=123456789
```

**For API Key:**
```bash
GOOGLE_API_KEY=your-api-key-here
GOOGLE_PROPERTY_ID=123456789
```

**Important:** For Service Account, extract the values from your JSON key file:
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` = value of `client_email` field
- `GOOGLE_PRIVATE_KEY` = value of `private_key` field (keep the quotes and \n characters)

## Authentication Methods Comparison

| Method | Use Case | Pros | Cons |
|--------|----------|------|------|
| **Service Account** | Production, server-side | Best for automation, no user interaction needed | Requires GA property access management |
| **OAuth 2.0** | User-based access | Access user's data | Requires user authorization, token management |
| **API Key** | Public data | Simple setup | Very limited functionality |

## Running the Example

Once you've configured your `.env` file, run the example:

```bash
pnpm tsx examples/basic-usage.ts
```

Expected output:
```
Initializing Google Analytics GA4 Connector...
Using Service Account authentication
Connector initialized successfully!
Property ID: 123456789

Fetching reports...
Received page with 100 items (total: 100)
...
Example completed successfully!
```

## Testing the Connector

Run the test suite to verify everything is working:

```bash
pnpm test
```

Build the connector:

```bash
pnpm build
```

## Common Issues and Solutions

### Issue: "Permission Denied" Error

**Solution:** Ensure your service account or OAuth user has access to the GA4 property:
1. Go to Google Analytics Admin
2. Property Access Management
3. Add the service account email with Viewer permissions

### Issue: "Invalid Private Key" Error

**Solution:** Make sure your private key in `.env` is properly formatted:
- Keep the double quotes around the key
- Keep the `\n` characters (do not replace with actual newlines)
- Copy the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

Example:
```bash
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG...\n-----END PRIVATE KEY-----\n"
```

### Issue: "Property Not Found" Error

**Solution:** Verify your Property ID:
- Use the numeric Property ID (e.g., 123456789), NOT the Measurement ID (e.g., G-XXXXXXXXXX)
- Find it in Google Analytics > Admin > Property Settings

### Issue: "API Not Enabled" Error

**Solution:** Enable the Google Analytics Data API:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services > Library
3. Search "Google Analytics Data API"
4. Click Enable

### Issue: "Module Not Found" Error

**Solution:** Ensure dependencies are installed:
```bash
pnpm install
```

## Next Steps

### 1. Explore the Connector Structure

```
connector-registry/google-analytics/ga4/514labs/typescript/default/
├── src/
│   ├── client/connector.ts      # Main connector implementation
│   ├── resources/reports.ts     # Reports resource
│   └── observability/           # Logging and metrics
├── examples/basic-usage.ts      # Working example
├── docs/                        # Detailed documentation
└── tests/                       # Test suite
```

### 2. Review Documentation

- **[Getting Started Guide](./docs/getting-started.md)** - Complete setup instructions
- **[Configuration Reference](./docs/configuration.md)** - All configuration options
- **[Schema Documentation](./docs/schema.md)** - Data structures
- **[API Limits](./docs/limits.md)** - Rate limits and quotas
- **[Observability](./docs/observability.md)** - Logging and monitoring

### 3. Implement Your Use Case

The connector provides several methods for data access:

```typescript
import { createConnector } from './src'

const conn = createConnector()
conn.initialize({ /* your config */ })

// Paginated fetching
for await (const page of conn.reports.getAll({ pageSize: 100 })) {
  // Process page
}

// Stream large datasets
for await (const item of conn.reports.stream({ pageSize: 100 })) {
  // Process item
}

// Get single item
const report = await conn.reports.get('id')
```

### 4. Add More Resources

To add additional GA4 resources (dimensions, metrics, etc.):

1. Create a new resource file in `src/resources/`
2. Follow the pattern in `reports.ts`
3. Register it in `src/client/connector.ts`
4. Add tests in `tests/`

### 5. Production Considerations

Before deploying to production:

- Store credentials in a secure secret manager (not in `.env` files)
- Enable logging and metrics for monitoring
- Configure appropriate rate limiting and retry logic
- Review the [Limits documentation](./docs/limits.md) for API quotas
- Set up error handling and alerting

## Additional Resources

- [Google Analytics Data API Documentation](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [514 Labs Registry Framework](https://github.com/514labs/registry)
- [Connector Specifications](https://registry.514.dev/docs/specifications/)

## Support

Need help? Check these resources:

1. Review the [Getting Started Guide](./docs/getting-started.md)
2. Check the [examples](./examples/) directory
3. Review test files for implementation examples
4. Open an issue on [GitHub](https://github.com/514labs/registry)

---

**Congratulations!** You've successfully set up the Google Analytics GA4 connector. Happy coding!
