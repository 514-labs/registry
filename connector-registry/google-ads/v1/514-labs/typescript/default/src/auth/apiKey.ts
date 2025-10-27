import type { AuthStrategy } from './base'

export class ApiKeyAuth implements AuthStrategy {
  constructor(private apiKey: string, private headerName: string = 'X-API-Key') {}

  apply(headers: Record<string, string>) {
    return { ...headers, [this.headerName]: this.apiKey }
  }
}
