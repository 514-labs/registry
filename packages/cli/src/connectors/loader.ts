/**
 * Connector Loader
 * Loads and initializes connectors from the filesystem
 */

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createCaptureHooks } from '../analysis/capture-hooks';
import type { CaptureResult } from '../analysis/capture-hooks';

export interface ConnectorInstance {
  instance: any;
  captureResult: CaptureResult;
}

/**
 * Load and initialize a connector from the filesystem
 */
export async function loadConnector(
  connectorDir: string,
  config: any
): Promise<ConnectorInstance> {
  const connectorPath = path.resolve(connectorDir, 'dist/src/index.js');
  const mod = await import(pathToFileURL(connectorPath).toString());

  // Find the factory function (starts with 'create')
  const factory = Object.entries(mod).find(
    ([k, v]) => k.startsWith('create') && typeof v === 'function'
  );

  if (!factory) {
    throw new Error(`No connector factory found in ${connectorPath}`);
  }

  const instance = (factory[1] as any)();

  // Create capture hooks to grab raw API responses
  const { hooks: captureHooks, result: captureResult } = createCaptureHooks();

  // Convert bearer auth to basic auth if needed (for connectors that use basic)
  const initConfig = {
    ...config,
    auth: config.auth?.type === 'bearer'
      ? {
          type: 'basic',
          basic: { username: (config.auth as any).bearer.token }
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

