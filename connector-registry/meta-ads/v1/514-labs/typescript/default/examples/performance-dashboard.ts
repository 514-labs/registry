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

async function generatePerformanceDashboard() {
  const connector = createMetaAdsConnector();

  connector.initialize({
    auth: {
      type: "bearer",
      bearer: {
        token: (process as any).env.FACEBOOK_ACCESS_TOKEN!
      }
    },
    baseUrl: "https://graph.facebook.com/v23.0"
  });

  await connector.connect();

  try {
    const iProspectAccountId = 'act_469215551635137';

    console.log('📊 COMPREHENSIVE META ADS PERFORMANCE DASHBOARD');
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
        const insights = await connector.insights.get({
          objectId: iProspectAccountId,
          level: 'account',
          fields: ['spend', 'impressions', 'clicks', 'ctr', 'cpc', 'cpm', 'date_start', 'date_stop'],
          datePreset: period.preset as any
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

    // Monthly Breakdown for 2025
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
        const insights = await connector.insights.get({
          objectId: iProspectAccountId,
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

    // Display monthly histogram
    console.log('📊 2025 MONTHLY SPEND HISTOGRAM:');
    monthlyData.forEach(month => {
      const barLength = Math.round((month.spend / maxMonthlySpend) * 50);
      const bar = '█'.repeat(barLength) + '░'.repeat(50 - barLength);
      console.log(`   ${month.month.padEnd(9)} │${bar}│ $${month.spend.toLocaleString().padStart(8)} (${month.impressions.toLocaleString().padStart(7)} imp, ${month.clicks.toString().padStart(4)} clicks, ${month.ctr.toFixed(2)}% CTR)`);
    });

    console.log('\n📈 CAMPAIGN ANALYSIS WITH HISTORICAL DATA');
    console.log('='.repeat(60));

    const campaignsResponse = await connector.campaigns.list({
      adAccountId: iProspectAccountId,
      fields: ['id', 'name', 'status', 'objective', 'created_time', 'start_time', 'stop_time', 'updated_time']
    });

    const campaigns = (campaignsResponse.data as any).data || [];
    const campaignStats: CampaignStats[] = [];

    // Test historical periods where we know there was activity
    const highActivityPeriods = [
      { since: '2025-02-01', until: '2025-02-28', label: 'Feb 2025' },
      { since: '2025-04-01', until: '2025-04-30', label: 'Apr 2025' },
      { since: '2025-01-01', until: '2025-01-31', label: 'Jan 2025' },
      { since: '2025-06-01', until: '2025-06-30', label: 'Jun 2025' },
      { since: '2024-06-01', until: '2024-12-31', label: '2024 H2' }
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

        // Test each high activity period
        for (const period of highActivityPeriods) {
          try {
            const periodInsights = await connector.insights.get({
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
        console.log(`   Skipping ${campaign.name} - error: ${e.message}`);
      }
    }

    // Sort campaigns by historical spend
    campaignStats.sort((a, b) => b.historicalSpend - a.historicalSpend);

    console.log('🎯 COMPREHENSIVE CAMPAIGN PERFORMANCE (Top Performers):');
    campaignStats.filter(c => c.historicalSpend > 0).forEach((campaign, index) => {
      console.log(`\n${index + 1}. ${campaign.name.substring(0, 55)}...`);
      console.log(`   Status: ${campaign.status} | Objective: ${campaign.objective}`);
      console.log(`   Duration: ${campaign.durationDays} days (${new Date(campaign.createdTime).toLocaleDateString()} - ${campaign.stopTime ? new Date(campaign.stopTime).toLocaleDateString() : 'ongoing'})`);
      console.log(`   Historical Spend: $${campaign.historicalSpend.toLocaleString()} | Recent 2025: $${campaign.recentSpend.toLocaleString()}`);
      console.log(`   Total Performance: ${campaign.totalImpressions.toLocaleString()} impressions, ${campaign.totalClicks.toLocaleString()} clicks`);
      console.log(`   Overall CTR: ${campaign.avgCtr.toFixed(2)}% | CPC: $${campaign.avgCpc.toFixed(2)}`);

      if (campaign.activePerformance && campaign.activePerformance.length > 0) {
        console.log(`   📊 Active Period Performance:`);
        campaign.activePerformance.forEach(period => {
          console.log(`     ${period.period}: $${period.spend.toFixed(2)} spend, ${period.impressions.toLocaleString()} imp, ${period.ctr.toFixed(2)}% CTR`);
        });
      }
    });

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

    // 2. Performance Over Time Analysis
    console.log('\n\n⏰ PERFORMANCE OVER TIME ANALYSIS');
    console.log('='.repeat(60));

    const timeRanges = [
      { datePreset: 'yesterday', label: 'Yesterday' },
      { datePreset: 'last_7d', label: 'Last 7 Days' },
      { datePreset: 'last_14d', label: 'Last 14 Days' },
      { datePreset: 'last_30d', label: 'Last 30 Days' },
      { datePreset: 'last_90d', label: 'Last 90 Days' },
      { datePreset: 'lifetime', label: 'Lifetime' }
    ];

    console.log('📅 TIME PERIOD COMPARISON:');
    for (const range of timeRanges) {
      try {
        const timeInsights = await connector.insights.get({
          objectId: iProspectAccountId,
          level: 'account',
          fields: ['impressions', 'clicks', 'spend', 'ctr', 'cpc', 'cpm'],
          datePreset: range.datePreset
        });

        const data = (timeInsights.data as any).data?.[0];
        if (data && parseInt(data.impressions || '0') > 0) {
          console.log(`   ${range.label}:`);
          console.log(`     Impressions: ${parseInt(data.impressions).toLocaleString()}`);
          console.log(`     Clicks: ${parseInt(data.clicks || '0').toLocaleString()}`);
          console.log(`     Spend: $${parseFloat(data.spend || '0').toLocaleString()}`);
          console.log(`     CTR: ${parseFloat(data.ctr || '0').toFixed(2)}%`);
          console.log(`     CPC: $${parseFloat(data.cpc || '0').toFixed(2)}`);
          console.log(`     CPM: $${parseFloat(data.cpm || '0').toFixed(2)}`);
        } else {
          console.log(`   ${range.label}: No data`);
        }
        console.log('');
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (e) {
        console.log(`   ${range.label}: Error - ${e.message}`);
      }
    }

    // 3. Subgroup Histogram Data
    console.log('\n📊 SUBGROUP HISTOGRAM ANALYSIS');
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

        const subgroupInsights = await connector.insights.get({
          objectId: iProspectAccountId,
          level: 'account',
          fields: ['impressions', 'clicks', 'spend', 'ctr', 'cpc'],
          breakdowns: [subgroup.breakdown],
          datePreset: 'last_90d'
        });

        const subgroupData: SubgroupData[] = [];
        const data = (subgroupInsights.data as any).data || [];
        const totalImpressions = data.reduce((sum, item) => sum + parseInt(item.impressions || '0'), 0);

        data.forEach(item => {
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

        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (e) {
        console.log(`   ${subgroup.label}: Error - ${e.message}`);
      }
    }

    // 4. Weekly Performance Trend
    console.log('\n\n📅 WEEKLY PERFORMANCE TREND (Last 12 Weeks)');
    console.log('='.repeat(60));

    const weeklyData = [];
    const weeksAgo = 12;

    for (let week = weeksAgo; week >= 0; week--) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - (week * 7));
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 6);

      try {
        const weekInsights = await connector.insights.get({
          objectId: iProspectAccountId,
          level: 'account',
          fields: ['impressions', 'clicks', 'spend', 'ctr'],
          timeRange: {
            since: startDate.toISOString().split('T')[0],
            until: endDate.toISOString().split('T')[0]
          }
        });

        const data = (weekInsights.data as any).data?.[0];
        if (data) {
          weeklyData.push({
            week: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
            impressions: parseInt(data.impressions || '0'),
            clicks: parseInt(data.clicks || '0'),
            spend: parseFloat(data.spend || '0'),
            ctr: parseFloat(data.ctr || '0')
          });
        }
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (e) {
        console.log(`   Week ${week}: No data`);
      }
    }

    // Display weekly trend
    if (weeklyData.length > 0) {
      console.log('📊 WEEKLY IMPRESSIONS TREND:');
      const maxWeeklyImpressions = Math.max(...weeklyData.map(d => d.impressions));

      weeklyData.forEach((week, index) => {
        const barLength = Math.round((week.impressions / maxWeeklyImpressions) * 40);
        const bar = '▓'.repeat(barLength) + '░'.repeat(40 - barLength);
        console.log(`Week ${String(index + 1).padStart(2)} │${bar}│ ${week.impressions.toLocaleString().padStart(6)} impressions, ${week.clicks.toString().padStart(4)} clicks, $${week.spend.toFixed(0).padStart(5)} spend`);
      });
    }

    console.log('\n✨ DASHBOARD COMPLETE');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ Dashboard Error:', error);
  } finally {
    await connector.disconnect();
  }
}

export { generatePerformanceDashboard };

// Run the dashboard if called directly
if (typeof require !== 'undefined' && require.main === module) {
  generatePerformanceDashboard().catch(console.error);
}