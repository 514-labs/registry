import type { SimplePublicObject as TicketObject } from "@hubspot/api-client/lib/codegen/crm/tickets";

export interface HubSpotTicket {
  id: string;
  subject?: string;
  content?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  archived?: boolean;
}

export function mapTicket(obj: TicketObject): HubSpotTicket {
  const p = (obj as any)?.properties ?? {};
  const createdAt = (obj as any)?.createdAt;
  const updatedAt = (obj as any)?.updatedAt;
  return {
    id: (obj as any)?.id ?? "",
    subject: p.subject,
    content: p.content,
    status: p.hs_pipeline_stage ?? p.status,
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
    updatedAt: updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt,
    archived: (obj as any)?.archived,
  };
}


