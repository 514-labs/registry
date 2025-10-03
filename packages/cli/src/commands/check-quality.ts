/**
 * Quality Check Command
 * Orchestrates quality analysis for connectors using pluggable checks
 */

import { loadQualityCheckConfig } from '../analysis/config-loader';
import { loadConfigFromFileOrEnv } from '../config';
import { executeResource } from '../connectors/executor';
import { loadConnector } from '../connectors/loader';
import { analyzeComparison } from '../quality/analyzer';
import { displayComparisonReport, displaySummary, getExitCode } from '../quality/reporter';

export interface CheckQualityOptions {
  connector: string;
  language: string;
  implementation: string;
  connectorDir: string;
  configPath?: string;
  verbose: boolean;
}

export async function checkQuality(options: CheckQualityOptions): Promise<number> {
  const { connector, language, implementation, connectorDir, configPath, verbose } = options;

  console.log(`\n🔍 Loading quality check configuration...`);

  try {
    // 1. Load quality check configuration
    const qualityConfig = await loadQualityCheckConfig(connectorDir);
    console.log(`✅ Found ${qualityConfig.resources.length} resource(s) to analyze\n`);

    // 2. Load auth configuration
    const authConfig = await loadConfigFromFileOrEnv(configPath ?? null, {
      connector,
      language,
      implementation,
      enableLogs: false, // Quality check doesn't need connector logs
    });

    // 3. Load and initialize connector
    const { instance, captureResult } = await loadConnector(
      connectorDir,
      authConfig.connectorConfig
    );

    // 4. Analyze each resource
    for (const resource of qualityConfig.resources) {
      console.log(`\n📥 Fetching sample data for: ${resource.name}...`);

      try {
        const { raw, normalized } = await executeResource(instance, captureResult, resource);

        if (normalized.length === 0) {
          console.warn(`⚠️  No records returned for ${resource.name}`);
          continue;
        }

        if (raw.length === 0) {
          throw new Error(
            `No raw API data captured for ${resource.name}. ` +
            `Connector must implement hooks properly to enable quality checks.`
          );
        }

        console.log(`✅ Fetched ${normalized.length} record(s)\n`);

        // Analyze and compare raw vs normalized
        const comparison = analyzeComparison(raw, normalized);
        displayComparisonReport(resource.name, comparison, { verbose });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`❌ Failed to analyze ${resource.name}: ${message}`);
        if (verbose) {
          console.error(error);
        }
      }
    }

    // 5. Display overall summary
    displaySummary();
    
    return getExitCode();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`\n❌ Quality check failed: ${message}\n`);
    if (verbose) {
      console.error(error);
    }
    return 2; // Fatal error
  }
}

