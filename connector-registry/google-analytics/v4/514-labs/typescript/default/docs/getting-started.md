# Getting Started with Google Analytics GA4 Connector

## Prerequisites

- Node.js >= 20
- A Google Cloud Project with Google Analytics Data API enabled
- Access to a Google Analytics 4 property

## Step 1: Enable the Google Analytics Data API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services > Library**
4. Search for "Google Analytics Data API"
5. Click on it and press **Enable**

## Step 2: Set Up Authentication

The connector supports three authentication methods. Choose the one that best fits your use case:

### Option A: Service Account (Recommended for Server-to-Server)

This is the recommended approach for production applications and server-side integrations.

#### Steps:
1. In Google Cloud Console, go to **IAM & Admin > Service Accounts**
2. Click **Create Service Account**
3. Give it a name (e.g., "ga4-connector") and click **Create**
4. Skip the optional permissions and click **Done**
5. Click on the newly created service account
6. Go to the **Keys** tab
7. Click **Add Key > Create New Key**
8. Choose **JSON** format and click **Create**
9. The JSON key file will be downloaded to your computer

#### Grant Access to Google Analytics:
1. Go to your [Google Analytics account](https://analytics.google.com/)
2. Navigate to **Admin** (bottom left)
3. In the **Property** column, click **Property Access Management**
4. Click the **+** icon in the top right
5. Add the service account email (found in the JSON file as `client_email`)
6. Grant at least **Viewer** permissions
7. Click **Add**

#### Find Your Property ID:
1. In Google Analytics, go to **Admin**
2. Make sure you have the correct property selected
3. Click on **Property Settings**
4. Your Property ID is displayed at the top (format: 123456789)

#### Configure Environment Variables:
Create a `.env` file in the connector directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials from the downloaded JSON file:

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
GOOGLE_PROPERTY_ID=123456789
```

### Option B: OAuth 2.0 (For User-Based Access)

Use this method when you need to access analytics on behalf of a user.

#### Steps:
1. In Google Cloud Console, go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth client ID**
3. If prompted, configure the OAuth consent screen first
4. Choose **Desktop app** or **Web application** as the application type
5. Give it a name and click **Create**
6. Download the client ID and client secret

#### Get a Refresh Token:
Use the [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/) or implement the OAuth flow in your application.

1. Go to OAuth 2.0 Playground
2. Click the gear icon (settings) in the top right
3. Check "Use your own OAuth credentials"
4. Enter your Client ID and Client Secret
5. In Step 1, find and select "Google Analytics Data API v1"
6. Click "Authorize APIs"
7. Sign in with your Google account that has access to the GA4 property
8. In Step 2, click "Exchange authorization code for tokens"
9. Copy the refresh token

#### Configure Environment Variables:
```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token
GOOGLE_PROPERTY_ID=123456789
```

### Option C: API Key (Limited Functionality)

Note: API keys have limited functionality with Google Analytics Data API. Service Account or OAuth is strongly recommended.

#### Steps:
1. In Google Cloud Console, go to **APIs & Services > Credentials**
2. Click **Create Credentials > API Key**
3. Copy the generated API key
4. (Recommended) Click **Restrict Key** and limit it to Google Analytics Data API

#### Configure Environment Variables:
```bash
GOOGLE_API_KEY=your-api-key-here
GOOGLE_PROPERTY_ID=123456789
```

## Step 3: Install Dependencies

```bash
pnpm -F @514labs/connector-google-analytics install
```

## Step 4: Basic Usage

### Using Service Account Authentication:

```typescript
import { createConnector } from '@514labs/connector-google-analytics'
import dotenv from 'dotenv'

dotenv.config()

const conn = createConnector()
conn.initialize({
  baseUrl: 'https://analyticsdata.googleapis.com/v1beta',
  auth: {
    type: 'oauth2',
    oauth2: {
      grantType: 'jwt',
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
      privateKey: process.env.GOOGLE_PRIVATE_KEY!,
      tokenUrl: 'https://oauth2.googleapis.com/token',
      scope: 'https://www.googleapis.com/auth/analytics.readonly'
    }
  },
  logging: { enabled: true, level: 'info' },
})

// Fetch reports
for await (const page of conn.reports.getAll({
  pageSize: 100,
  maxItems: 500
})) {
  console.log(`Received ${page.length} reports`)
  console.log(page)
}
```

### Using OAuth 2.0:

```typescript
import { createConnector } from '@514labs/connector-google-analytics'
import dotenv from 'dotenv'

dotenv.config()

const conn = createConnector()
conn.initialize({
  baseUrl: 'https://analyticsdata.googleapis.com/v1beta',
  auth: {
    type: 'oauth2',
    oauth2: {
      grantType: 'refresh_token',
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN!,
      tokenUrl: 'https://oauth2.googleapis.com/token'
    }
  },
  logging: { enabled: true, level: 'info' },
})
```

## Step 5: Run the Example

The connector includes a basic example file. Update it with your credentials:

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your credentials
# Then run the example
pnpm tsx examples/basic-usage.ts
```

## Next Steps

- Review [Configuration Documentation](./configuration.md) for advanced options
- Check [Schema Documentation](./schema.md) to understand available data structures
- Read [Limits Documentation](./limits.md) for API quotas and rate limits
- Explore [Observability Documentation](./observability.md) for monitoring and logging

## Common Issues

### "Permission Denied" Error
Make sure your service account or OAuth user has at least Viewer access to the GA4 property in Google Analytics.

### "Property Not Found" Error
Verify that your `GOOGLE_PROPERTY_ID` is correct. It should be a numeric ID (e.g., 123456789), not a measurement ID (e.g., G-XXXXXXXXXX).

### "Invalid Credentials" Error
For service accounts, ensure the private key is properly formatted with escaped newlines (`\n`). The key should be enclosed in double quotes in the .env file.

### "API Not Enabled" Error
Make sure you've enabled the Google Analytics Data API in your Google Cloud project.
