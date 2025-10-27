export interface AuthStrategy {
  apply(headers: Record<string,string>): Record<string,string>
}
