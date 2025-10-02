/**
 * Quality Check Command
 * Orchestrates quality analysis for connectors using pluggable checks
 */

import { loadConfigFromFileOrEnv } from '../config';
import { loadQualityCheckConfig } from '../analysis/config-loader';
import { loadConnector } from '../connectors/loader';
import { executeResource } from '../connectors/executor';
import { analyzeQuality, analyzeComparison } from '../quality/analyzer';
import { displayQualityReport, displayComparisonReport, displaySummary } from '../quality/reporter';
import type { QualityAnalysisResults } from '../quality/types';

export interface CheckQualityOptions {
  connector: string;
  language: string;
  implementation: string;
  connectorDir: string;
  configPath?: string;
  enableLogs: boolean;
  verbose: boolean;
}

export async function checkQuality(options: CheckQualityOptions): Promise<number> {
  const { connector, language, implementation, connectorDir, configPath, verbose } = options;

  console.log(`\n🔍 Loading quality check configuration...`);

  try {
    // 1. Load configuration
    const qualityConfig = await loadQualityCheckConfig(connectorDir);
    console.log(`✅ Found ${qualityConfig.resources.length} resource(s) to analyze\n`);

    const authConfig = await loadConfigFromFileOrEnv(configPath ?? null, {
      connector,
      language,
      implementation,
      enableLogs: false,
    });

    // 2. Load and initialize connector
    const { instance, captureResult } = await loadConnector(
      connectorDir,
      authConfig.connectorConfig
    );

    // 3. Process each resource
    const results: Array<{ resourceName: string; results: QualityAnalysisResults }> = [];

    for (const resource of qualityConfig.resources) {
      console.log(`\n📥 Fetching sample data for: ${resource.name}...`);

      try {
        // Execute resource operation
        const { raw, normalized } = await executeResource(
          instance,
          captureResult,
          resource
        );

        if (normalized.length === 0) {
          console.warn(`⚠️  No records returned for ${resource.name}`);
          continue;
        }

        console.log(`✅ Fetched ${normalized.length} record(s)\n`);

        // Run quality checks
        if (raw.length > 0) {
          // Comparison analysis (raw vs normalized)
          const comparison = analyzeComparison(raw, normalized);
          displayComparisonReport(resource.name, comparison, { verbose });
          results.push({ resourceName: resource.name, results: comparison.normalized });
        } else {
          // Simple analysis (normalized only)
          const analysis = analyzeQuality(normalized);
          displayQualityReport(resource.name, analysis, { verbose });
          results.push({ resourceName: resource.name, results: analysis });
        }
      } catch (error: any) {
        console.error(`❌ Failed to analyze ${resource.name}: ${error.message}`);
        if (verbose) {
          console.error(error);
        }
        continue;
      }
    }

    // 4. Display overall summary
    if (results.length > 1) {
      displaySummary(results);
    }

    console.log(`${'='.repeat(60)}`);
    console.log(`✅ Quality check complete!`);
    console.log(`${'='.repeat(60)}\n`);

    return 0;
  } catch (error: any) {
    console.error(`\n❌ Quality check failed: ${error.message}\n`);
    if (verbose) {
      console.error(error);
    }
    return 1;
  }
}

