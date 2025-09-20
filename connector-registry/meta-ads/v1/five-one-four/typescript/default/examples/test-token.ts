import { createMetaAdsConnector } from '../src';

async function testToken() {
  const connector = createMetaAdsConnector();

  if (!process.env.FACEBOOK_ACCESS_TOKEN) {
    console.log('❌ Please set FACEBOOK_ACCESS_TOKEN environment variable');
    return;
  }

  connector.initialize({
    auth: {
      type: "bearer",
      bearer: {
        token: process.env.FACEBOOK_ACCESS_TOKEN
      }
    },
    baseUrl: "https://graph.facebook.com/v23.0" // Use current stable version
  });

  await connector.connect();

  try {
    console.log('🧪 Testing your Facebook access token...\n');

    // Test basic user info endpoint first
    console.log('1️⃣ Testing /me endpoint...');
    const userInfo = await connector.request({
      method: "GET",
      path: "/me",
      query: { fields: "id,name" }
    });

    if (userInfo.error) {
      console.log('❌ /me failed:', userInfo.error.message);
      console.log('💡 Your token may be invalid or expired');
      return;
    }

    console.log('✅ User info:', userInfo);

    // Test permissions
    console.log('\n2️⃣ Checking token permissions...');
    const permissions = await connector.request({
      method: "GET",
      path: "/me/permissions"
    });

    if (permissions.data) {
      const grantedPerms = permissions.data
        .filter((p: any) => p.status === 'granted')
        .map((p: any) => p.permission);

      console.log('✅ Granted permissions:', grantedPerms);

      const requiredPerms = ['ads_read', 'ads_management'];
      const hasRequired = requiredPerms.every(perm => grantedPerms.includes(perm));

      if (!hasRequired) {
        console.log('⚠️  Missing required permissions:',
          requiredPerms.filter(perm => !grantedPerms.includes(perm)));
        console.log('💡 Go to Facebook Graph Explorer and add these permissions');
      }
    }

    // Test ad accounts
    console.log('\n3️⃣ Testing ad accounts access...');
    const adAccounts = await connector.listAdAccounts({
      fields: ['id', 'name', 'account_status']
    });

    if (adAccounts.error) {
      console.log('❌ Ad accounts failed:', adAccounts.error.message);
      if (adAccounts.error.code === 2500) {
        console.log('💡 This is likely because you need a USER access token, not an APP token');
        console.log('🔗 Get one from: https://developers.facebook.com/tools/explorer/');
        console.log('   - Select your app');
        console.log('   - Add "ads_read" permission');
        console.log('   - Generate User Access Token');
      }
    } else if (adAccounts.data && Array.isArray(adAccounts.data)) {
      console.log(`✅ Found ${adAccounts.data.length} ad account(s):`);
      adAccounts.data.forEach(acc => {
        const status = acc.account_status === 1 ? 'Active' : 'Inactive';
        console.log(`   - ${acc.name} (${acc.id}) - ${status}`);
      });

      const activeCount = adAccounts.data.filter(acc => acc.account_status === 1).length;
      if (activeCount === 0) {
        console.log('⚠️  No active ad accounts found');
      } else {
        console.log(`🎉 Ready to use! You have ${activeCount} active ad account(s)`);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await connector.disconnect();
  }
}

testToken();