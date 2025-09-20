import { createMetaAdsConnector } from '../src';

async function basicExample() {
  // Create connector instance
  const connector = createMetaAdsConnector();

  // Initialize with your Facebook access token
  connector.initialize({
    auth: {
      type: "bearer",
      bearer: {
        token: process.env.FACEBOOK_ACCESS_TOKEN! // Your Facebook Graph API access token
      }
    },
    baseUrl: "https://graph.facebook.com/v23.0", // Use current stable version
    timeoutMs: 30000, // Optional timeout
  });

  // Connect
  await connector.connect();

  try {
    // Discover ad accounts
    const adAccounts = await connector.listAdAccounts({
      fields: ['id', 'name', 'account_status']
    });

    if (adAccounts.error) {
      throw new Error(`API Error: ${adAccounts.error.message}`);
    }

    const actualData = adAccounts.data?.data || adAccounts.data;
    if (!actualData || !Array.isArray(actualData)) {
      throw new Error('No ad accounts data received');
    }

    const activeAccount = actualData.find(acc => acc.account_status === 1);
    if (!activeAccount) {
      throw new Error('No active ad accounts found');
    }

    // List campaigns for the first active ad account
    const campaigns = await connector.listCampaigns({
      adAccountId: activeAccount.id,
      fields: ['id', 'name', 'status', 'objective', 'created_time']
    });

    // List ad sets
    const adSets = await connector.listAdSets({
      adAccountId: activeAccount.id,
      fields: ['id', 'name', 'status', 'campaign_id']
    });

    // List ads
    const ads = await connector.listAds({
      adAccountId: activeAccount.id,
      fields: ['id', 'name', 'status', 'adset_id']
    });

    // List ad creatives
    const adCreatives = await connector.listAdCreatives({
      adAccountId: activeAccount.id,
      fields: ['id', 'name', 'title', 'body']
    });

    // List custom audiences
    const customAudiences = await connector.listCustomAudiences({
      adAccountId: activeAccount.id,
      fields: ['id', 'name', 'description', 'approximate_count']
    });

    // List businesses (if user has business access)
    const businesses = await connector.listBusinesses({
      fields: ['id', 'name', 'verification_status']
    });

    // Get insights for the account
    const accountInsights = await connector.getInsights({
      objectId: activeAccount.id,
      level: "account",
      fields: ['impressions', 'clicks', 'spend', 'ctr', 'cpc'],
      timeRange: {
        since: "2024-01-01",
        until: "2024-01-31"
      }
    });

    const finalState = {
      account: activeAccount,
      campaigns: campaigns.data || [],
      adSets: adSets.data || [],
      ads: ads.data || [],
      adCreatives: adCreatives.data || [],
      customAudiences: customAudiences.data || [],
      businesses: businesses.data || [],
      insights: accountInsights.data
    };

    console.log('Final state:', JSON.stringify(finalState, null, 2));
    return finalState;

  } catch (error) {
    throw error;
  } finally {
    await connector.disconnect();
  }
}

export { basicExample };

// Run the example if called directly
if (require.main === module) {
  basicExample().catch(console.error);
}