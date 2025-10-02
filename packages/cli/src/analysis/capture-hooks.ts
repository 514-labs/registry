import type { Hook } from '@connector-factory/core';

/**
 * Result container for captured raw API responses
 */
export interface CaptureResult {
  raw: any[];
}

/**
 * Creates hooks to capture raw API responses before connector transformations
 *
 * The captureRaw hook runs with priority -100 (before normalization/flattening)
 * to preserve the original API response structure.
 *
 * @returns hooks object to inject into connector config, and result container
 */
export function createCaptureHooks(): { hooks: any; result: CaptureResult } {
  const result: CaptureResult = {
    raw: []
  };

  const captureRaw: Hook = {
    name: 'quality-check:captureRaw',
    priority: -100, // Run BEFORE all transformations (normalize, flatten, validate)
    execute: (ctx: any) => {
      if (ctx.type !== 'afterResponse') return;

      // Deep clone the raw API response to prevent mutation
      const rawData = ctx.response?.data;
      if (Array.isArray(rawData)) {
        // Clone each item to preserve original structure
        result.raw.push(...JSON.parse(JSON.stringify(rawData)));
      }
    }
  };

  return {
    hooks: {
      afterResponse: [captureRaw]
    },
    result
  };
}

