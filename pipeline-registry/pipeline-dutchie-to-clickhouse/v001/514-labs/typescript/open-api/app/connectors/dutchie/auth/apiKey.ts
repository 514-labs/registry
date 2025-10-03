import type { AuthStrategy } from './base'

function toBasicToken(username: string, password: string = ''): string {
  // Basic <base64(username:password)>
  const raw = `${username}:${password}`
  const base64 = Buffer.from(raw, 'utf8').toString('base64')
  return `Basic ${base64}`
}

export class ApiKeyAuth implements AuthStrategy {
  constructor(private apiKey: string) {}
  apply(headers: Record<string, string>) {
    return { ...headers, Authorization: toBasicToken(this.apiKey, '') }
  }
}
