/**
 * Contacts domain
 * Thin binding that maps the contacts API path to shared CRUD and streaming helpers.
 * Keeps request/retry/rate‑limit in the connector; keeps types in `src/models/contacts`.
 */
import type { SendFn } from "../core/paginate";
import { makeCrudDomain } from "../core/make-crud-domain";
import type { Contact, ContactsResponse, ContactResponse } from "../models/contacts";

export function buildContactsDomain(send: SendFn) {
  const base = makeCrudDomain<Contact, ContactsResponse, ContactResponse>("/crm/v3/objects/contacts", send);
  return {
    listContacts: base.list,
    getContact: base.get,
    streamContacts: base.streamAll,
    getContacts: base.getAll,
  };
}


