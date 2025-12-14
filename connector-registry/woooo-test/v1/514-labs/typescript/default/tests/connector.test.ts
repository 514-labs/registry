import { createConnector } from '../src'

describe('WooooTestConnector', () => {
  it('should create a connector instance', () => {
    const connector = createConnector()
    expect(connector).toBeDefined()
  })

  it('should initialize with config', () => {
    const connector = createConnector()
    connector.init({ apiKey: 'test-key' })
    expect(connector).toBeDefined()
  })

  it('should return test message', async () => {
    const connector = createConnector()
    connector.init({ apiKey: 'test-key' })
    
    const result = await connector.testConnection()
    expect(result.status).toBe('ok')
    expect(result.message).toContain('test connector')
  })
})
