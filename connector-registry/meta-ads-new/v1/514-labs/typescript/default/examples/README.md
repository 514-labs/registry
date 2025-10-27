# Meta Ads Examples

## universal-performance-dashboard.ts

Comprehensive example that demonstrates the full API surface of the Meta Ads connector.

**Features demonstrated:**
- `adAccounts.list()` - Discover all available ad accounts
- `campaigns.list()` - List campaigns with field filtering
- `insights.get()` - Fetch insights with various parameters:
  - Date presets (`last_year`, `this_year`, `last_90d`)
  - Time ranges (custom date ranges)
  - Breakdowns (age, gender, device_platform, publisher_platform)
  - Multiple aggregation levels (account, campaign)

**Usage:**

```bash
# Set your Meta Ads access token
export FACEBOOK_ACCESS_TOKEN="your_token_here"
# or
export META_ADS_ACCESS_TOKEN="your_token_here"

# Build the connector
npm run build

# Run the dashboard
npx tsx examples/universal-performance-dashboard.ts
```

**What it does:**
1. Discovers all active ad accounts
2. For each account:
   - Shows historical performance overview (2024, 2025, recent 90 days)
   - Displays monthly performance breakdown with ASCII histograms
   - Analyzes top campaigns with historical spend data
   - Shows demographic breakdowns (age, gender, device, platform)

**Testing the new implementation:**

This example is identical to the one in the original `meta-ads` connector. Run it with both connectors to verify they produce the same results:

```bash
# Old connector
cd connector-registry/meta-ads/v1/514-labs/typescript/default
npx tsx examples/universal-performance-dashboard.ts > /tmp/old-output.txt

# New connector
cd connector-registry/meta-ads-new/v1/514-labs/typescript/default
npx tsx examples/universal-performance-dashboard.ts > /tmp/new-output.txt

# Compare outputs
diff /tmp/old-output.txt /tmp/new-output.txt
```

They should produce identical results, proving the new `makeMetaResource` pattern works correctly.
