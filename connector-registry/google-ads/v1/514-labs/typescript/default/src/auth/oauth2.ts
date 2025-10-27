import type { AuthStrategy } from './base'

export interface OAuth2Config {
  accessToken: string
  refreshToken?: string
  clientId?: string
  clientSecret?: string
  tokenEndpoint?: string
}

export class OAuth2Auth implements AuthStrategy {
  constructor(private config: OAuth2Config) {}

  apply(headers: Record<string, string>) {
    return {
      ...headers,
      Authorization: `Bearer ${this.config.accessToken}`
    }
  }

  // Method to refresh token if needed
  async refreshAccessToken(): Promise<string> {
    if (!this.config.refreshToken || !this.config.clientId || !this.config.clientSecret || !this.config.tokenEndpoint) {
      throw new Error('Missing OAuth2 configuration for token refresh')
    }

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: this.config.refreshToken,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    })

    const response = await fetch(this.config.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`)
    }

    const data = await response.json()
    this.config.accessToken = data.access_token
    return data.access_token
  }
}
