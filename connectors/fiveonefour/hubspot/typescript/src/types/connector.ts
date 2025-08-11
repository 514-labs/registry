import type { ResponseEnvelope } from "./envelopes";
import type { ConnectorConfig } from "./config";

export interface HubSpotConnector {
  initialize(config: ConnectorConfig): Promise<void> | void;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;

  request(options: {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    path: string;
    query?: Record<string, string | number | boolean | undefined>;
    headers?: Record<string, string>;
    body?: unknown;
    timeoutMs?: number;
    operation?: string;
  }): Promise<ResponseEnvelope<any>>;

  paginate<T = any>(options: {
    path: string;
    query?: Record<string, any>;
    pageSize?: number;
    extractItems?: (res: any) => T[];
    extractNextCursor?: (res: any) => string | undefined;
  }): AsyncIterable<T[]>;

  // Domain: Contacts
  listContacts(params?: {
    properties?: string[];
    limit?: number;
    after?: string;
  }): Promise<ResponseEnvelope<{ results: any[]; paging?: any }>>;

  getContact(params: { id: string; properties?: string[] }): Promise<ResponseEnvelope<any>>;
}


