import jwt from 'jsonwebtoken'

export interface ServiceAccountConfig {
  email: string
  privateKey: string
  scope: string
}

export interface TokenResponse {
  token: string
  expiresAt: number
}

/**
 * Generate a JWT token for Google Service Account authentication
 * @param config - Service account configuration
 * @returns JWT token and expiration time
 */
export function generateServiceAccountToken(config: ServiceAccountConfig): TokenResponse {
  const now = Math.floor(Date.now() / 1000)
  const expiration = now + 3600 // Token valid for 1 hour

  const payload = {
    iss: config.email,
    scope: config.scope,
    aud: 'https://oauth2.googleapis.com/token',
    exp: expiration,
    iat: now,
  }

  const token = jwt.sign(payload, config.privateKey, {
    algorithm: 'RS256',
  })

  return {
    token,
    expiresAt: expiration * 1000, // Convert to milliseconds
  }
}

/**
 * Exchange JWT token for Google access token
 * @param jwtToken - The JWT token
 * @returns Access token
 */
export async function exchangeJwtForAccessToken(jwtToken: string): Promise<string> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwtToken,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to exchange JWT for access token: ${error}`)
  }

  const data = await response.json()
  return data.access_token
}

/**
 * Get a valid Google access token for service account authentication
 * Generates JWT and exchanges it for an access token
 * @param config - Service account configuration
 * @returns Access token
 */
export async function getServiceAccountAccessToken(
  config: ServiceAccountConfig
): Promise<string> {
  const { token: jwtToken } = generateServiceAccountToken(config)
  const accessToken = await exchangeJwtForAccessToken(jwtToken)
  return accessToken
}
