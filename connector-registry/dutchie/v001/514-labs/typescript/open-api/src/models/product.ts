import type { paths } from '../generated/dutchie'

export type ProductArray = paths['/products']['get']['responses']['200']['content']['application/json']
export type Product = ProductArray extends (infer T)[] ? T : unknown
export type Model = Product
