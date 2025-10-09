import { createMetaAdsConnector } from '../src';

async function streamingExample() {
  const connector = createMetaAdsConnector();

  connector.initialize({
    auth: {
      type: "bearer",
      bearer: {
        token: process.env.FACEBOOK_ACCESS_TOKEN!
      }
    }
  });

  await connector.connect();

  try {
    // First get an ad account to use for streaming
    console.log('Getting ad accounts...');
    const adAccounts = await connector.adAccounts.list({
      fields: ['id', 'name', 'account_status']
    });

    const activeAccount = adAccounts.data?.find(acc => acc.account_status === 1);
    if (!activeAccount) {
      console.log('No active ad accounts found');
      return;
    }

    console.log(`Using ad account: ${activeAccount.name}`);
    console.log('Streaming all campaigns...');

    // Stream all campaigns with pagination
    let campaignCount = 0;
    for await (const campaign of connector.campaigns.stream({
      adAccountId: activeAccount.id,
      fields: ['id', 'name', 'status'],
      pageSize: 10 // Process 10 campaigns at a time
    })) {
      console.log(`Campaign ${++campaignCount}:`, campaign.name, campaign.status);

      // Stop after 50 campaigns for demo purposes
      if (campaignCount >= 50) break;
    }

    console.log('Streaming all ads...');

    // Stream all ads
    let adCount = 0;
    for await (const ad of connector.ads.stream({
      adAccountId: activeAccount.id,
      fields: ['id', 'name', 'status'],
      pageSize: 20
    })) {
      console.log(`Ad ${++adCount}:`, ad.name, ad.status);

      if (adCount >= 100) break;
    }

  } catch (error) {
    console.error('Streaming error:', error);
  } finally {
    await connector.disconnect();
  }
}

streamingExample();