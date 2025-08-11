import type { SendFn } from "../core/paginate";
import { makeCrudDomain } from "../core/make-crud-domain";

export function buildContactsDomain(send: SendFn) {
  const base = makeCrudDomain("/crm/v3/objects/contacts", send);
  return {
    listContacts: base.list,
    getContact: base.get,
    streamContacts: base.streamAll,
    getContacts: base.getAll,
  };
}


