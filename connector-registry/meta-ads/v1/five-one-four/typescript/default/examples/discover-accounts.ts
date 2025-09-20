import { createMetaAdsConnector } from '../src';

async function discoverAccountsExample() {
  const connector = createMetaAdsConnector();

  connector.initialize({
    auth: {
      type: "bearer",
      bearer: {
        token: process.env.FACEBOOK_ACCESS_TOKEN!
      }
    },
    baseUrl: "https://graph.facebook.com/v23.0" // Use current stable version
  });

  await connector.connect();

  try {
    // First, discover available ad accounts
    console.log('🔍 Discovering your ad accounts...\n');

    const adAccounts = await connector.listAdAccounts({
      fields: ['id', 'name', 'account_status', 'currency', 'timezone_name']
    });

    if (!adAccounts.data || adAccounts.data.length === 0) {
      console.log('❌ No ad accounts found. Make sure your access token has the right permissions.');
      return;
    }

    console.log('📊 Found ad accounts:');
    adAccounts.data.forEach((account, index) => {
      const status = account.account_status === 1 ? '✅ Active' : '❌ Inactive';
      console.log(`${index + 1}. ${account.name} (${account.id})`);
      console.log(`   Status: ${status}`);
      console.log(`   Currency: ${account.currency}`);
      console.log(`   Timezone: ${account.timezone_name || 'N/A'}`);
      console.log('');
    });

    // Use the first active ad account
    const activeAccount = adAccounts.data.find(acc => acc.account_status === 1);
    if (!activeAccount) {
      console.log('❌ No active ad accounts found.');
      return;
    }

    console.log(`🚀 Using ad account: ${activeAccount.name} (${activeAccount.id})\n`);

    // Now list campaigns for this ad account
    const campaigns = await connector.listCampaigns({
      adAccountId: activeAccount.id,
      fields: ['id', 'name', 'status', 'objective', 'created_time']
    });

    console.log('📈 Campaigns:');
    if (campaigns.data && campaigns.data.length > 0) {
      campaigns.data.forEach((campaign, index) => {
        console.log(`${index + 1}. ${campaign.name}`);
        console.log(`   ID: ${campaign.id}`);
        console.log(`   Status: ${campaign.status}`);
        console.log(`   Objective: ${campaign.objective || 'N/A'}`);
        console.log('');
      });

      // Get insights for the first campaign
      const firstCampaign = campaigns.data[0];
      console.log(`📊 Getting insights for campaign: ${firstCampaign.name}\n`);

      const insights = await connector.getInsights({
        objectId: firstCampaign.id,
        level: "campaign",
        fields: ['impressions', 'clicks', 'spend', 'ctr', 'cpc'],
        timeRange: {
          since: "2024-01-01",
          until: "2024-12-31"
        }
      });

      if (insights.data && insights.data.length > 0) {
        const insight = insights.data[0];
        console.log('💰 Performance metrics:');
        console.log(`   Impressions: ${insight.impressions || 'N/A'}`);
        console.log(`   Clicks: ${insight.clicks || 'N/A'}`);
        console.log(`   Spend: $${insight.spend || 'N/A'}`);
        console.log(`   CTR: ${insight.ctr || 'N/A'}%`);
        console.log(`   CPC: $${insight.cpc || 'N/A'}`);
      } else {
        console.log('📊 No insights data available for this campaign.');
      }

    } else {
      console.log('📈 No campaigns found in this ad account.');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connector.disconnect();
  }
}

// Run the example
discoverAccountsExample();