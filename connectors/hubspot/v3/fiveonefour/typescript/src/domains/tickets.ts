import type { SendFn } from "../core/paginate";
import { makeCrudDomain } from "../core/make-crud-domain";
import type { Ticket, TicketsResponse, TicketResponse } from "../models/tickets";

export function buildTicketsDomain(send: SendFn) {
  const base = makeCrudDomain<Ticket, TicketsResponse, TicketResponse>("/crm/v3/objects/tickets", send);
  return {
    listTickets: base.list,
    getTicket: base.get,
    streamTickets: base.streamAll,
    getTickets: base.getAll,
  };
}


