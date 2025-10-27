import { createMetaAdsConnector } from '../src';

interface PerformanceData {
  period: string;
  impressions: number;
  clicks: number;
  spend: number;
  ctr: number;
  cpc: number;
  cpm: number;
  dateStart?: string;
  dateStop?: string;
}

interface CampaignStats {
  id: string;
  name: string;
  status: string;
  objective: string;
  createdTime: string;
  startTime?: string;
  stopTime?: string;
  durationDays: number;
  historicalSpend: number;
  recentSpend: number;
  totalImpressions: number;
  totalClicks: number;
  avgCtr: number;
  avgCpc: number;
  activePerformance?: PerformanceData[];
}

interface SubgroupData {
  category: string;
  value: string;
  impressions: number;
  clicks: number;
  spend: number;
  ctr: number;
  cpc: number;
  percentage: number;
}

interface MonthlyData {
  month: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
}

async function generateUniversalPerformanceDashboard() {
  const connector = createMetaAdsConnector();

  connector.initialize({
    auth: {
      type: "bearer",
      bearer: {
        token: (process as any).env.FACEBOOK_ACCESS_TOKEN! || (process as any).env.META_ADS_ACCESS_TOKEN!
      }
    },
    baseUrl: "https://graph.facebook.com/v23.0"
  });

  await connector.connect();

  try {
    // Get all available accounts dynamically
    console.log('🔍 DISCOVERING AVAILABLE AD ACCOUNTS');
    console.log('='.repeat(60));

    const adAccountsResponse = await connector.adAccounts.list({
      fields: ['id', 'name', 'account_status', 'currency', 'timezone_name']
    });

    const accounts = (adAccountsResponse.data as any).data || [];
    const activeAccounts = accounts.filter((acc: any) => acc.account_status === 1);

    console.log(`Found ${accounts.length} total accounts, ${activeAccounts.length} active`);
    activeAccounts.forEach((acc: any, index: number) => {
      console.log(`   ${index + 1}. ${acc.name} (${acc.id}) - ${acc.currency}`);
    });

    if (activeAccounts.length === 0) {
      console.log('❌ No active ad accounts found. Cannot generate dashboard.');
      return;
    }

    console.log('\n📊 GENERATING COMPREHENSIVE DASHBOARD FOR ALL ACTIVE ACCOUNTS');
    console.log('='.repeat(80));

    // Generate dashboard for each active account
    for (const account of activeAccounts) {
      await generateAccountDashboard(connector, account);
    }

    console.log('\n🎉 ALL ACCOUNT DASHBOARDS COMPLETE');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ Dashboard Error:', error);
  } finally {
    await connector.disconnect();
  }
}

async function generateAccountDashboard(connector: any, account: any) {
  const accountId = account.id;
  const accountName = account.name;

  console.log(`\n🏢 ACCOUNT: ${accountName} (${accountId})`);
  console.log('='.repeat(80));
  console.log(`Generated: ${new Date().toLocaleString()}\n`);

  // 0. Historical Overview First
  console.log('🏆 HISTORICAL PERFORMANCE OVERVIEW');
  console.log('='.repeat(60));

  const historicalPeriods = [
    { preset: 'last_year', label: '2024 (Last Year)', key: '2024' },
    { preset: 'this_year', label: '2025 (This Year)', key: '2025' },
    { preset: 'last_90d', label: 'Recent 90 Days', key: 'recent' }
  ];

  const yearlyStats: Record<string, PerformanceData> = {};

  for (const period of historicalPeriods) {
    try {
      const insights = await connector.insights.list({
        objectId: accountId,
        level: 'account',
        fields: ['spend', 'impressions', 'clicks', 'ctr', 'cpc', 'cpm', 'date_start', 'date_stop'],
        datePreset: period.preset
      });

      const data = (insights.data as any).data?.[0];
      if (data && parseFloat(data.spend || '0') > 0) {
        yearlyStats[period.key] = {
          period: period.label,
          spend: parseFloat(data.spend),
          impressions: parseInt(data.impressions || '0'),
          clicks: parseInt(data.clicks || '0'),
          ctr: parseFloat(data.ctr || '0'),
          cpc: parseFloat(data.cpc || '0'),
          cpm: parseFloat(data.cpm || '0'),
          dateStart: data.date_start,
          dateStop: data.date_stop
        };
      }
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (e) {
      console.log(`   ${period.label}: No data available`);
    }
  }

  // Display historical overview
  console.log('💰 TOTAL ACCOUNT PERFORMANCE:');
  let totalHistoricalSpend = 0;
  const hasData = Object.keys(yearlyStats).length > 0;

  if (hasData) {
    Object.values(yearlyStats).forEach(stat => {
      totalHistoricalSpend += stat.spend;
      console.log(`   ${stat.period}:`);
      console.log(`     Spend: $${stat.spend.toLocaleString()}`);
      console.log(`     Impressions: ${stat.impressions.toLocaleString()}`);
      console.log(`     Clicks: ${stat.clicks.toLocaleString()}`);
      console.log(`     CTR: ${stat.ctr.toFixed(2)}%`);
      console.log(`     CPC: $${stat.cpc.toFixed(2)}`);
      console.log(`     CPM: $${stat.cpm.toFixed(2)}`);
      if (stat.dateStart) console.log(`     Period: ${stat.dateStart} to ${stat.dateStop}`);
      console.log('');
    });

    console.log(`🎯 TOTAL HISTORICAL SPEND: $${totalHistoricalSpend.toLocaleString()}\n`);
  } else {
    console.log('   📭 No historical performance data found for this account\n');
  }

  // Monthly Breakdown for 2025 (only if there's data)
  if (yearlyStats['2025'] || yearlyStats['recent']) {
    console.log('📅 2025 MONTHLY PERFORMANCE BREAKDOWN');
    console.log('='.repeat(60));

    const months2025 = [
      { since: '2025-01-01', until: '2025-01-31', name: 'January' },
      { since: '2025-02-01', until: '2025-02-28', name: 'February' },
      { since: '2025-03-01', until: '2025-03-31', name: 'March' },
      { since: '2025-04-01', until: '2025-04-30', name: 'April' },
      { since: '2025-05-01', until: '2025-05-31', name: 'May' },
      { since: '2025-06-01', until: '2025-06-30', name: 'June' },
      { since: '2025-07-01', until: '2025-07-31', name: 'July' },
      { since: '2025-08-01', until: '2025-08-31', name: 'August' },
      { since: '2025-09-01', until: '2025-09-30', name: 'September' }
    ];

    const monthlyData: MonthlyData[] = [];
    let maxMonthlySpend = 0;

    for (const month of months2025) {
      try {
        const insights = await connector.insights.list({
          objectId: accountId,
          level: 'account',
          fields: ['spend', 'impressions', 'clicks', 'ctr', 'cpc', 'cpm'],
          timeRange: { since: month.since, until: month.until }
        });

        const data = (insights.data as any).data?.[0];
        if (data && parseFloat(data.spend || '0') > 0) {
          const monthData = {
            month: month.name,
            spend: parseFloat(data.spend),
            impressions: parseInt(data.impressions || '0'),
            clicks: parseInt(data.clicks || '0'),
            ctr: parseFloat(data.ctr || '0'),
            cpc: parseFloat(data.cpc || '0'),
            cpm: parseFloat(data.cpm || '0')
          };
          monthlyData.push(monthData);
          maxMonthlySpend = Math.max(maxMonthlySpend, monthData.spend);
        }
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (e) {
        // Skip months with no data
      }
    }

    if (monthlyData.length > 0) {
      // Display monthly histogram
      console.log('📊 2025 MONTHLY SPEND HISTOGRAM:');
      monthlyData.forEach(month => {
        const barLength = Math.round((month.spend / maxMonthlySpend) * 50);
        const bar = '█'.repeat(barLength) + '░'.repeat(50 - barLength);
        console.log(`   ${month.month.padEnd(9)} │${bar}│ $${month.spend.toLocaleString().padStart(8)} (${month.impressions.toLocaleString().padStart(7)} imp, ${month.clicks.toString().padStart(4)} clicks, ${month.ctr.toFixed(2)}% CTR)`);
      });
      console.log('');
    }
  }

  // Campaign Analysis with Historical Data
  console.log('📈 CAMPAIGN ANALYSIS WITH HISTORICAL DATA');
  console.log('='.repeat(60));

  const campaignsResponse = await connector.campaigns.list({
    adAccountId: accountId,
    fields: ['id', 'name', 'status', 'objective', 'created_time', 'start_time', 'stop_time', 'updated_time']
  });

  const campaigns = (campaignsResponse.data as any).data || [];
  const campaignStats: CampaignStats[] = [];

  if (campaigns.length === 0) {
    console.log('📭 No campaigns found for this account\n');
  } else {
    console.log(`🔍 Analyzing ${campaigns.length} campaigns for historical data...\n`);

    // Test historical periods where we might find data
    const testPeriods = [
      { since: '2025-02-01', until: '2025-02-28', label: 'Feb 2025' },
      { since: '2025-04-01', until: '2025-04-30', label: 'Apr 2025' },
      { since: '2025-01-01', until: '2025-01-31', label: 'Jan 2025' },
      { since: '2025-06-01', until: '2025-06-30', label: 'Jun 2025' },
      { since: '2024-06-01', until: '2024-12-31', label: '2024 H2' },
      { since: '2024-01-01', until: '2024-06-30', label: '2024 H1' }
    ];

    for (const campaign of campaigns.slice(0, 8)) {
      try {
        const createdDate = new Date(campaign.created_time);
        const now = new Date();
        const stopDate = campaign.stop_time ? new Date(campaign.stop_time) : now;
        const startDate = campaign.start_time ? new Date(campaign.start_time) : createdDate;
        const durationDays = Math.ceil((stopDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

        // Try to find historical performance data for this campaign
        let historicalSpend = 0;
        let recentSpend = 0;
        let totalImpressions = 0;
        let totalClicks = 0;
        const activePerformance: PerformanceData[] = [];

        // Test each period
        for (const period of testPeriods) {
          try {
            const periodInsights = await connector.insights.list({
              objectId: campaign.id,
              level: 'campaign',
              fields: ['spend', 'impressions', 'clicks', 'ctr', 'cpc', 'cpm'],
              timeRange: { since: period.since, until: period.until }
            });

            const data = (periodInsights.data as any).data?.[0];
            if (data && parseFloat(data.spend || '0') > 0) {
              const spend = parseFloat(data.spend);
              const impressions = parseInt(data.impressions || '0');
              const clicks = parseInt(data.clicks || '0');

              historicalSpend += spend;
              totalImpressions += impressions;
              totalClicks += clicks;

              if (period.label.includes('2025')) {
                recentSpend += spend;
              }

              activePerformance.push({
                period: period.label,
                spend,
                impressions,
                clicks,
                ctr: parseFloat(data.ctr || '0'),
                cpc: parseFloat(data.cpc || '0'),
                cpm: parseFloat(data.cpm || '0')
              });
            }
            await new Promise(resolve => setTimeout(resolve, 250));
          } catch (e) {
            // Continue to next period
          }
        }

        campaignStats.push({
          id: campaign.id,
          name: campaign.name,
          status: campaign.status,
          objective: campaign.objective,
          createdTime: campaign.created_time,
          startTime: campaign.start_time,
          stopTime: campaign.stop_time,
          durationDays,
          historicalSpend,
          recentSpend,
          totalImpressions,
          totalClicks,
          avgCtr: totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0,
          avgCpc: totalClicks > 0 ? (historicalSpend / totalClicks) : 0,
          activePerformance: activePerformance.length > 0 ? activePerformance : undefined
        });

      } catch (e) {
        console.log(`   Skipping ${campaign.name} - error: ${(e as Error).message}`);
      }
    }

    // Sort campaigns by historical spend
    campaignStats.sort((a, b) => b.historicalSpend - a.historicalSpend);

    console.log('🎯 COMPREHENSIVE CAMPAIGN PERFORMANCE (Top Performers):');
    const activeCampaigns = campaignStats.filter(c => c.historicalSpend > 0);

    if (activeCampaigns.length > 0) {
      activeCampaigns.slice(0, 5).forEach((campaign, index) => {
        console.log(`\n${index + 1}. ${campaign.name.substring(0, 55)}...`);
        console.log(`   Status: ${campaign.status} | Objective: ${campaign.objective}`);
        console.log(`   Duration: ${campaign.durationDays} days (${new Date(campaign.createdTime).toLocaleDateString()} - ${campaign.stopTime ? new Date(campaign.stopTime).toLocaleDateString() : 'ongoing'})`);
        console.log(`   Historical Spend: $${campaign.historicalSpend.toLocaleString()} | Recent 2025: $${campaign.recentSpend.toLocaleString()}`);
        console.log(`   Total Performance: ${campaign.totalImpressions.toLocaleString()} impressions, ${campaign.totalClicks.toLocaleString()} clicks`);
        console.log(`   Overall CTR: ${campaign.avgCtr.toFixed(2)}% | CPC: $${campaign.avgCpc.toFixed(2)}`);

        if (campaign.activePerformance && campaign.activePerformance.length > 0) {
          console.log(`   📊 Active Period Performance:`);
          campaign.activePerformance.slice(0, 3).forEach(period => {
            console.log(`     ${period.period}: $${period.spend.toFixed(2)} spend, ${period.impressions.toLocaleString()} imp, ${period.ctr.toFixed(2)}% CTR`);
          });
        }
      });
    } else {
      console.log('   📭 No campaigns with historical spend data found');
    }

    // Show campaigns with no historical data
    const inactiveCampaigns = campaignStats.filter(c => c.historicalSpend === 0);
    if (inactiveCampaigns.length > 0) {
      console.log(`\n📝 CAMPAIGNS WITH NO HISTORICAL SPEND DATA (${inactiveCampaigns.length}):`);
      inactiveCampaigns.slice(0, 3).forEach(campaign => {
        console.log(`   • ${campaign.name.substring(0, 60)}... (${campaign.status})`);
      });
      if (inactiveCampaigns.length > 3) {
        console.log(`   ... and ${inactiveCampaigns.length - 3} more`);
      }
    }
  }

  // Only show demographic analysis if there's recent data
  if (yearlyStats['recent']) {
    console.log('\n📊 SUBGROUP HISTOGRAM ANALYSIS (Recent 90 Days)');
    console.log('='.repeat(60));

    const subgroups = [
      { breakdown: 'age', label: 'Age Groups' },
      { breakdown: 'gender', label: 'Gender' },
      { breakdown: 'device_platform', label: 'Device Platform' },
      { breakdown: 'publisher_platform', label: 'Publisher Platform' }
    ];

    for (const subgroup of subgroups) {
      try {
        console.log(`\n📈 ${subgroup.label.toUpperCase()} HISTOGRAM:`);

        const subgroupInsights = await connector.insights.list({
          objectId: accountId,
          level: 'account',
          fields: ['impressions', 'clicks', 'spend', 'ctr', 'cpc'],
          breakdowns: [subgroup.breakdown],
          datePreset: 'last_90d'
        });

        const subgroupData: SubgroupData[] = [];
        const data = (subgroupInsights.data as any).data || [];
        const totalImpressions = data.reduce((sum: number, item: any) => sum + parseInt(item.impressions || '0'), 0);

        data.forEach((item: any) => {
          const impressions = parseInt(item.impressions || '0');
          const clicks = parseInt(item.clicks || '0');
          const spend = parseFloat(item.spend || '0');

          subgroupData.push({
            category: subgroup.breakdown,
            value: item[subgroup.breakdown] || 'unknown',
            impressions,
            clicks,
            spend,
            ctr: parseFloat(item.ctr || '0'),
            cpc: parseFloat(item.cpc || '0'),
            percentage: totalImpressions > 0 ? (impressions / totalImpressions) * 100 : 0
          });
        });

        if (subgroupData.length > 0) {
          // Sort by impressions descending
          subgroupData.sort((a, b) => b.impressions - a.impressions);

          // Create ASCII histogram
          const maxImpressions = Math.max(...subgroupData.map(d => d.impressions));
          const maxBarLength = 50;

          subgroupData.forEach(item => {
            const barLength = Math.round((item.impressions / maxImpressions) * maxBarLength);
            const bar = '█'.repeat(barLength) + '░'.repeat(maxBarLength - barLength);

            console.log(`   ${item.value.padEnd(15)} │${bar}│ ${item.impressions.toLocaleString().padStart(8)} (${item.percentage.toFixed(1)}%) CTR: ${item.ctr.toFixed(2)}%`);
          });
        } else {
          console.log('   📭 No breakdown data available');
        }

        await new Promise(resolve => setTimeout(resolve, 400));
      } catch (e) {
        console.log(`   ${subgroup.label}: Error - ${(e as Error).message}`);
      }
    }
  }

  console.log(`\n✨ DASHBOARD COMPLETE FOR ${accountName}`);
  console.log('='.repeat(80));
}

export { generateUniversalPerformanceDashboard };

// Run the dashboard if called directly
if (typeof require !== 'undefined' && require.main === module) {
  generateUniversalPerformanceDashboard().catch(console.error);
}