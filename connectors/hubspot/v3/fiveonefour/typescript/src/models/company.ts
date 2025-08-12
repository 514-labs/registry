import type { SimplePublicObject as CompanyObject } from "@hubspot/api-client/lib/codegen/crm/companies";

export interface HubSpotCompany {
  id: string;
  name?: string;
  domain?: string;
  createdAt?: string;
  updatedAt?: string;
  archived?: boolean;
}

export function mapCompany(obj: CompanyObject): HubSpotCompany {
  const p = (obj as any)?.properties ?? {};
  const createdAt = (obj as any)?.createdAt;
  const updatedAt = (obj as any)?.updatedAt;
  return {
    id: (obj as any)?.id ?? "",
    name: p.name,
    domain: p.domain,
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
    updatedAt: updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt,
    archived: (obj as any)?.archived,
  };
}


