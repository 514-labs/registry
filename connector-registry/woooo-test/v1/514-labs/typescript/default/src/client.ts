import { ApiConnectorBase } from '@connector-factory/core'
import type { CoreConfig } from '@connector-factory/core'
import type { WooooTestConfig } from './config'

/**
 * Minimal test connector
 * This is a test connector - do not use in production
 */
export class WooooTestConnector extends ApiConnectorBase {
  init(userConfig: WooooTestConfig = {}) {
    const coreConfig: CoreConfig = {
      baseUrl: userConfig.baseUrl || 'https://api.example.com',
      userAgent: 'woooo-test-connector/0.1.0',
      defaultHeaders: userConfig.apiKey
        ? { 'X-API-Key': userConfig.apiKey }
        : {},
      auth: {
        type: 'bearer',
        bearer: { token: '' },
      },
    }

    super.initialize(coreConfig, (cfg) => cfg)
    return this
  }

  /**
   * Test method - returns a simple message
   */
  async testConnection(): Promise<{ status: string; message: string }> {
    return {
      status: 'ok',
      message: 'This is a test connector - do not use in production',
    }
  }
}

export function createConnector(): WooooTestConnector {
  return new WooooTestConnector()
}
