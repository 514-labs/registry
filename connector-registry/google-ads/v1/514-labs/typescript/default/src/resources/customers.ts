import { makeCrudResource } from '../lib/make-resource'
import type { SendFn } from '../lib/paginate'
import type { Customer } from '../generated/types.gen'

export const createCustomersResource = (send: SendFn) => {
  return makeCrudResource<Customer, undefined>(
    '/customers',
    send
  )
}
