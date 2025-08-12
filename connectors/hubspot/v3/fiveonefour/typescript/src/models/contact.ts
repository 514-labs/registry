import type { SimplePublicObject as ContactObject } from "@hubspot/api-client/lib/codegen/crm/contacts";

export interface HubSpotContact {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
  updatedAt?: string;
  archived?: boolean;
}

export function mapContact(obj: ContactObject): HubSpotContact {
  const p = (obj as any)?.properties ?? {};
  const createdAt = (obj as any)?.createdAt;
  const updatedAt = (obj as any)?.updatedAt;
  return {
    id: (obj as any)?.id ?? "",
    email: p.email,
    firstName: p.firstname ?? p.firstName,
    lastName: p.lastname ?? p.lastName,
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
    updatedAt: updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt,
    archived: (obj as any)?.archived,
  };
}


