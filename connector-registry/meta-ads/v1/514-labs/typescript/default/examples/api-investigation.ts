import { createMetaAdsConnector } from '../src';

async function investigateAllApis() {
  const connector = createMetaAdsConnector();

  connector.initialize({
    auth: {
      type: "bearer",
      bearer: {
        token: process.env.META_ADS_ACCESS_TOKEN || process.env.FACEBOOK_ACCESS_TOKEN!
      }
    },
    baseUrl: "https://graph.facebook.com/v23.0"
  });

  await connector.connect();

  try {
    console.log('🔍 META ADS API INVESTIGATION');
    console.log('='.repeat(80));
    console.log(`Started: ${new Date().toLocaleString()}\n`);

    // First, check token validity
    console.log('🔑 TOKEN VALIDATION:');
    try {
      const token = process.env.META_ADS_ACCESS_TOKEN || process.env.FACEBOOK_ACCESS_TOKEN!;
      const debugResponse = await connector.request({
        method: 'GET',
        path: '/debug_token',
        query: { input_token: token, access_token: token }
      });

      if (debugResponse.data.error) {
        console.log('   ❌ Token Error:', debugResponse.data.error.message);
        console.log('   🚨 Cannot proceed with API investigation - token is invalid\n');

        // Still show what APIs we have available
        console.log('📋 AVAILABLE API ENDPOINTS (requires valid token):');
        console.log('   1️⃣  adAccounts     - List and manage ad accounts');
        console.log('   2️⃣  campaigns      - List and manage campaigns');
        console.log('   3️⃣  adSets         - List and manage ad sets');
        console.log('   4️⃣  ads            - List and manage ads');
        console.log('   5️⃣  insights       - Get performance insights');
        console.log('   6️⃣  adCreatives    - List and manage ad creatives');
        console.log('   7️⃣  customAudiences- List and manage custom audiences');
        console.log('   8️⃣  savedAudiences - List and manage saved audiences');
        console.log('   9️⃣  adImages       - List and manage ad images');
        console.log('   🔟 adVideos       - List and manage ad videos');
        console.log('   1️⃣1️⃣ businesses     - List and manage businesses');
        console.log('   1️⃣2️⃣ pages          - List and manage pages');
        console.log('   1️⃣3️⃣ conversions    - List and manage conversion events');
        console.log('   1️⃣4️⃣ pixels         - List and manage pixels');
        console.log('   1️⃣5️⃣ adLabels       - List and manage ad labels');
        console.log('   1️⃣6️⃣ leadGenForms   - List and manage lead gen forms');
        console.log('\n💡 To test these endpoints, provide a valid Facebook access token');
        return;
      } else {
        console.log('   ✅ Token is valid');
        console.log(`   📱 App: ${debugResponse.data.data.application}`);
        console.log(`   👤 User: ${debugResponse.data.data.user_id}`);
        console.log(`   📅 Expires: ${new Date(debugResponse.data.data.expires_at * 1000).toLocaleString()}`);
      }
    } catch (e) {
      console.log(`   ❌ Token validation error: ${e.message}`);
    }
    console.log('');

    // 1. Ad Accounts
    console.log('1️⃣ AD ACCOUNTS:');
    try {
      const adAccountsResponse = await connector.adAccounts.list({
        fields: ['id', 'name', 'account_status', 'currency', 'timezone_name']
      });
      const accounts = adAccountsResponse.data.data || [];
      console.log(`   Found ${accounts.length} accounts`);
      accounts.forEach(acc => {
        console.log(`   - ${acc.name} (${acc.id}) - Status: ${acc.account_status} - ${acc.currency}`);
      });
    } catch (e) {
      console.log(`   Error: ${e.message}`);
    }
    console.log('');

    // Get first active account for subsequent tests
    const adAccountsResponse = await connector.adAccounts.list({
      fields: ['id', 'name', 'account_status']
    });
    const accounts = adAccountsResponse.data.data || [];
    const activeAccounts = accounts.filter(acc => acc.account_status === 1);
    const testAccountId = activeAccounts.length > 0 ? activeAccounts[0].id : accounts[0]?.id;

    if (!testAccountId) {
      console.log('❌ No accounts found - cannot test other endpoints');
      return;
    }

    console.log(`Using account ${testAccountId} for testing...\n`);

    // 2. Campaigns
    console.log('2️⃣ CAMPAIGNS:');
    try {
      const campaignsResponse = await connector.campaigns.list({
        adAccountId: testAccountId,
        fields: ['id', 'name', 'status', 'objective', 'created_time']
      });
      const campaigns = campaignsResponse.data.data || [];
      console.log(`   Found ${campaigns.length} campaigns`);
      campaigns.slice(0, 3).forEach(camp => {
        console.log(`   - ${camp.name} (${camp.id}) - ${camp.status} - ${camp.objective}`);
      });
      if (campaigns.length > 3) console.log(`   ... and ${campaigns.length - 3} more`);
    } catch (e) {
      console.log(`   Error: ${e.message}`);
    }
    console.log('');

    // 3. Ad Sets
    console.log('3️⃣ AD SETS:');
    try {
      const adSetsResponse = await connector.adSets.list({
        adAccountId: testAccountId,
        fields: ['id', 'name', 'status', 'campaign_id', 'daily_budget']
      });
      const adSets = adSetsResponse.data.data || [];
      console.log(`   Found ${adSets.length} ad sets`);
      adSets.slice(0, 3).forEach(adSet => {
        console.log(`   - ${adSet.name} (${adSet.id}) - ${adSet.status} - Budget: ${adSet.daily_budget}`);
      });
      if (adSets.length > 3) console.log(`   ... and ${adSets.length - 3} more`);
    } catch (e) {
      console.log(`   Error: ${e.message}`);
    }
    console.log('');

    // 4. Ads
    console.log('4️⃣ ADS:');
    try {
      const adsResponse = await connector.ads.list({
        adAccountId: testAccountId,
        fields: ['id', 'name', 'status', 'campaign_id', 'adset_id']
      });
      const ads = adsResponse.data.data || [];
      console.log(`   Found ${ads.length} ads`);
      ads.slice(0, 3).forEach(ad => {
        console.log(`   - ${ad.name} (${ad.id}) - ${ad.status}`);
      });
      if (ads.length > 3) console.log(`   ... and ${ads.length - 3} more`);
    } catch (e) {
      console.log(`   Error: ${e.message}`);
    }
    console.log('');

    // 5. Insights (Account level)
    console.log('5️⃣ INSIGHTS:');
    try {
      const insightsResponse = await connector.insights.get({
        objectId: testAccountId,
        level: "account",
        fields: ['impressions', 'clicks', 'spend', 'reach', 'ctr', 'cpc', 'cpm'],
        datePreset: 'last_30d'
      });
      const insights = insightsResponse.data.data || [];
      console.log(`   Found ${insights.length} insight records`);
      if (insights.length > 0) {
        const insight = insights[0];
        console.log(`   - Impressions: ${parseInt(insight.impressions || '0').toLocaleString()}`);
        console.log(`   - Clicks: ${parseInt(insight.clicks || '0').toLocaleString()}`);
        console.log(`   - Spend: $${parseFloat(insight.spend || '0').toLocaleString()}`);
      }
    } catch (e) {
      console.log(`   Error: ${e.message}`);
    }
    console.log('');

    // 6. Ad Creatives
    console.log('6️⃣ AD CREATIVES:');
    try {
      const creativesResponse = await connector.adCreatives.list({
        adAccountId: testAccountId,
        fields: ['id', 'name', 'title', 'body', 'status']
      });
      const creatives = creativesResponse.data.data || [];
      console.log(`   Found ${creatives.length} ad creatives`);
      creatives.slice(0, 3).forEach(creative => {
        console.log(`   - ${creative.name || 'Untitled'} (${creative.id}) - ${creative.status}`);
      });
      if (creatives.length > 3) console.log(`   ... and ${creatives.length - 3} more`);
    } catch (e) {
      console.log(`   Error: ${e.message}`);
    }
    console.log('');

    // 7. Custom Audiences
    console.log('7️⃣ CUSTOM AUDIENCES:');
    try {
      const customAudiencesResponse = await connector.customAudiences.list({
        adAccountId: testAccountId,
        fields: ['id', 'name', 'description', 'approximate_count', 'delivery_status']
      });
      const customAudiences = customAudiencesResponse.data.data || [];
      console.log(`   Found ${customAudiences.length} custom audiences`);
      customAudiences.slice(0, 3).forEach(aud => {
        console.log(`   - ${aud.name} (${aud.id}) - ~${aud.approximate_count} people`);
      });
      if (customAudiences.length > 3) console.log(`   ... and ${customAudiences.length - 3} more`);
    } catch (e) {
      console.log(`   Error: ${e.message}`);
    }
    console.log('');

    // 8. Saved Audiences
    console.log('8️⃣ SAVED AUDIENCES:');
    try {
      const savedAudiencesResponse = await connector.savedAudiences.list({
        adAccountId: testAccountId,
        fields: ['id', 'name', 'description', 'approximate_count']
      });
      const savedAudiences = savedAudiencesResponse.data.data || [];
      console.log(`   Found ${savedAudiences.length} saved audiences`);
      savedAudiences.slice(0, 3).forEach(aud => {
        console.log(`   - ${aud.name} (${aud.id}) - ~${aud.approximate_count} people`);
      });
      if (savedAudiences.length > 3) console.log(`   ... and ${savedAudiences.length - 3} more`);
    } catch (e) {
      console.log(`   Error: ${e.message}`);
    }
    console.log('');

    // 9. Ad Images
    console.log('9️⃣ AD IMAGES:');
    try {
      const imagesResponse = await connector.adImages.list({
        adAccountId: testAccountId,
        fields: ['hash', 'url', 'name', 'width', 'height']
      });
      const images = imagesResponse.data.data || [];
      console.log(`   Found ${images.length} ad images`);
      images.slice(0, 3).forEach(img => {
        console.log(`   - ${img.name || 'Untitled'} (${img.hash}) - ${img.width}x${img.height}`);
      });
      if (images.length > 3) console.log(`   ... and ${images.length - 3} more`);
    } catch (e) {
      console.log(`   Error: ${e.message}`);
    }
    console.log('');

    // 10. Ad Videos
    console.log('🔟 AD VIDEOS:');
    try {
      const videosResponse = await connector.adVideos.list({
        adAccountId: testAccountId,
        fields: ['id', 'title', 'description', 'length', 'status']
      });
      const videos = videosResponse.data.data || [];
      console.log(`   Found ${videos.length} ad videos`);
      videos.slice(0, 3).forEach(video => {
        console.log(`   - ${video.title || 'Untitled'} (${video.id}) - ${video.length}s - ${video.status}`);
      });
      if (videos.length > 3) console.log(`   ... and ${videos.length - 3} more`);
    } catch (e) {
      console.log(`   Error: ${e.message}`);
    }
    console.log('');

    // 11. Businesses
    console.log('1️⃣1️⃣ BUSINESSES:');
    try {
      const businessesResponse = await connector.businesses.list({
        fields: ['id', 'name', 'verification_status', 'vertical']
      });
      const businesses = businessesResponse.data.data || [];
      console.log(`   Found ${businesses.length} businesses`);
      businesses.slice(0, 3).forEach(biz => {
        console.log(`   - ${biz.name} (${biz.id}) - ${biz.verification_status} - ${biz.vertical}`);
      });
      if (businesses.length > 3) console.log(`   ... and ${businesses.length - 3} more`);
    } catch (e) {
      console.log(`   Error: ${e.message}`);
    }
    console.log('');

    // 12. Pages
    console.log('1️⃣2️⃣ PAGES:');
    try {
      const pagesResponse = await connector.pages.list({
        fields: ['id', 'name', 'category', 'fan_count', 'website']
      });
      const pages = pagesResponse.data.data || [];
      console.log(`   Found ${pages.length} pages`);
      pages.slice(0, 3).forEach(page => {
        console.log(`   - ${page.name} (${page.id}) - ${page.category} - ${page.fan_count} fans`);
      });
      if (pages.length > 3) console.log(`   ... and ${pages.length - 3} more`);
    } catch (e) {
      console.log(`   Error: ${e.message}`);
    }
    console.log('');

    // 13. Conversions
    console.log('1️⃣3️⃣ CONVERSIONS:');
    try {
      const conversionsResponse = await connector.conversions.list({
        adAccountId: testAccountId,
        fields: ['id', 'name', 'description', 'event_source_type', 'creation_time']
      });
      const conversions = conversionsResponse.data.data || [];
      console.log(`   Found ${conversions.length} conversion events`);
      conversions.slice(0, 3).forEach(conv => {
        console.log(`   - ${conv.name} (${conv.id}) - ${conv.event_source_type}`);
      });
      if (conversions.length > 3) console.log(`   ... and ${conversions.length - 3} more`);
    } catch (e) {
      console.log(`   Error: ${e.message}`);
    }
    console.log('');

    // 14. Pixels
    console.log('1️⃣4️⃣ PIXELS:');
    try {
      const pixelsResponse = await connector.pixels.list({
        fields: ['id', 'name', 'creation_time', 'last_fired_time']
      });
      const pixels = pixelsResponse.data.data || [];
      console.log(`   Found ${pixels.length} pixels`);
      pixels.slice(0, 3).forEach(pixel => {
        console.log(`   - ${pixel.name} (${pixel.id}) - Last fired: ${pixel.last_fired_time}`);
      });
      if (pixels.length > 3) console.log(`   ... and ${pixels.length - 3} more`);
    } catch (e) {
      console.log(`   Error: ${e.message}`);
    }
    console.log('');

    // 15. Ad Labels
    console.log('1️⃣5️⃣ AD LABELS:');
    try {
      const labelsResponse = await connector.adLabels.list({
        adAccountId: testAccountId,
        fields: ['id', 'name', 'created_time', 'updated_time']
      });
      const labels = labelsResponse.data.data || [];
      console.log(`   Found ${labels.length} ad labels`);
      labels.slice(0, 3).forEach(label => {
        console.log(`   - ${label.name} (${label.id})`);
      });
      if (labels.length > 3) console.log(`   ... and ${labels.length - 3} more`);
    } catch (e) {
      console.log(`   Error: ${e.message}`);
    }
    console.log('');

    // 16. Lead Gen Forms
    console.log('1️⃣6️⃣ LEAD GEN FORMS:');
    try {
      const formsResponse = await connector.leadGenForms.list({
        fields: ['id', 'name', 'status', 'leads_count', 'created_time']
      });
      const forms = formsResponse.data.data || [];
      console.log(`   Found ${forms.length} lead gen forms`);
      forms.slice(0, 3).forEach(form => {
        console.log(`   - ${form.name} (${form.id}) - ${form.status} - ${form.leads_count} leads`);
      });
      if (forms.length > 3) console.log(`   ... and ${forms.length - 3} more`);
    } catch (e) {
      console.log(`   Error: ${e.message}`);
    }

    console.log('\n🎯 INVESTIGATION COMPLETE');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ Investigation Error:', error);
  } finally {
    await connector.disconnect();
  }
}

export { investigateAllApis };

// Run the investigation if called directly
if (require.main === module) {
  investigateAllApis().catch(console.error);
}