import type { paths } from '../generated/dutchie'

export type Brand = paths['/brand']['get']['responses']['200']['content']['application/json'] extends infer R
  ? R extends unknown[]
    ? R[number]
    : unknown
  : unknown

export type Model = Brand


