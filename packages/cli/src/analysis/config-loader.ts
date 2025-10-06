/**
 * Quality check configuration loader
 */

import { z } from 'zod';
import fs from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

const QualityCheckResourceSchema = z.object({
  name: z.string(),
  operation: z.string(),
  sampleSize: z.number().optional().default(20),
  params: z.record(z.any()).optional(),
});

const QualityCheckConfigSchema = z.object({
  connector: z.string(),
  version: z.string().optional(),
  implementation: z.string().optional(),
  resources: z.array(QualityCheckResourceSchema),
});

export type QualityCheckConfig = z.infer<typeof QualityCheckConfigSchema>;
export type QualityCheckResource = z.infer<typeof QualityCheckResourceSchema>;

/**
 * Load and validate quality check configuration from quality-check.yaml
 */
export async function loadQualityCheckConfig(connectorDir: string): Promise<QualityCheckConfig> {
  const configPath = path.join(connectorDir, 'quality-check.yaml');

  try {
    const content = await fs.readFile(configPath, 'utf-8');
    const parsed = YAML.parse(content);
    return QualityCheckConfigSchema.parse(parsed);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw new Error(
        `No quality-check.yaml found in: ${connectorDir}\n` +
          `Create a quality-check.yaml file to define which resources to test.`
      );
    }
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid quality-check.yaml format:\n${error.message}`);
    }
    throw error;
  }
}

