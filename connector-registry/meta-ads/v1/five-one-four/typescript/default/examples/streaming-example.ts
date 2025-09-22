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
    console.log('Streaming all campaigns...');

    // Stream all campaigns with pagination
    let campaignCount = 0;
    for await (const campaign of connector.streamCampaigns({
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
    for await (const ad of connector.streamAds({
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