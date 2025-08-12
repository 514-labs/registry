import type { SimplePublicObject as DealObject } from "@hubspot/api-client/lib/codegen/crm/deals";

export interface HubSpotDeal {
  id: string;
  name?: string;
  amount?: number;
  closeDate?: string;
  stage?: string;
  pipeline?: string;
  createdAt?: string;
  updatedAt?: string;
  archived?: boolean;
}

export function mapDeal(obj: DealObject): HubSpotDeal {
  const p = (obj as any)?.properties ?? {};
  const createdAt = (obj as any)?.createdAt;
  const updatedAt = (obj as any)?.updatedAt;
  const amountStr = p.amount as string | undefined;
  return {
    id: (obj as any)?.id ?? "",
    name: p.dealname ?? p.name,
    amount: amountStr != null ? Number(amountStr) : undefined,
    closeDate: p.closedate,
    stage: p.dealstage,
    pipeline: p.pipeline,
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
    updatedAt: updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt,
    archived: (obj as any)?.archived,
  };
}


