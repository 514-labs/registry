import type { SendFn } from "../core/paginate";
import { makeCrudDomain } from "../core/make-crud-domain";

export function buildTicketsDomain(send: SendFn) {
  const base = makeCrudDomain("/crm/v3/objects/tickets", send);
  return {
    listTickets: base.list,
    getTicket: base.get,
    streamTickets: base.streamAll,
    getTickets: base.getAll,
  };
}


