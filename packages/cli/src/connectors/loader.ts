/**
 * Connector Loader
 * Loads and initializes connectors from the filesystem
 */

import type { ConnectorConfig } from '@connector-factory/core';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { createCaptureHooks, type CaptureResult } from '../analysis/capture-hooks';

/**
 * Connector instance with captured raw data
 * Note: instance is `unknown` because connectors are dynamically loaded
 */
export interface ConnectorInstance {
  instance: unknown;
  captureResult: CaptureResult;
}

/**
 * Load and initialize a connector from the filesystem
 */
export async function loadConnector(
  connectorDir: string,
  config: ConnectorConfig
): Promise<ConnectorInstance> {
  const connectorPath = path.resolve(connectorDir, 'dist/src/index.js');
  const mod = await import(pathToFileURL(connectorPath).toString()) as Record<string, unknown>;
  
  // Find the factory function (starts with 'create')
  const factory = Object.entries(mod).find(
    ([k, v]) => k.startsWith('create') && typeof v === 'function'
  );

  if (!factory) {
    throw new Error(`No connector factory found in ${connectorPath}`);
  }

  // Call factory to create instance
  const factoryFn = factory[1] as () => {
    initialize(config: ConnectorConfig): void;
    connect?: () => Promise<void>;
  };
  
  const instance = factoryFn();

  // Create capture hooks to grab raw API responses
  const { hooks: captureHooks, result: captureResult } = createCaptureHooks();

  // Convert bearer auth to basic auth if needed (for connectors that use basic)
  const initConfig: ConnectorConfig = {
    ...config,
    auth: config.auth?.type === 'bearer'
      ? {
          type: 'basic' as const,
          basic: { username: (config.auth.bearer as { token: string }).token }
        }
      : config.auth,
    // Inject capture hooks to intercept responses
    hooks: {
      beforeRequest: [],
      afterResponse: [...(captureHooks.afterResponse || [])],
      onError: [],
      onRetry: []
    }
  };

  instance.initialize(initConfig);

  if (typeof instance.connect === 'function') {
    await instance.connect();
  }

  return { instance, captureResult };
}
