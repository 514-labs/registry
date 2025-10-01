import { generateUniversalPerformanceDashboard } from './universal-performance-dashboard';

async function runDemo() {
  console.log('🚀 UNIVERSAL META ADS PERFORMANCE DASHBOARD DEMO');
  console.log('='.repeat(60));
  console.log('✨ This dashboard works with ANY Facebook access token!');
  console.log('✨ No hardcoded account IDs - fully dynamic discovery');
  console.log('✨ Supports both FACEBOOK_ACCESS_TOKEN and META_ADS_ACCESS_TOKEN env vars');
  console.log('✨ Automatically analyzes ALL active accounts');
  console.log('✨ Shows comprehensive historical data when available');
  console.log('✨ Gracefully handles accounts with no data');
  console.log('');

  // Run the universal dashboard
  await generateUniversalPerformanceDashboard();
}

// Run demo if called directly
if (typeof require !== 'undefined' && require.main === module) {
  runDemo().catch(console.error);
}

export { runDemo };