import type { paths } from '../generated/dutchie'

export type InventoryArray = paths['/inventory']['get']['responses']['200']['content']['application/json']
export type InventoryItem = InventoryArray extends (infer T)[] ? T : unknown
export type Model = InventoryItem
