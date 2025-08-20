/**
 * Moose Lineage Manifest types
 *
 * Central reference for static lineage graphs used by pipeline implementations.
 * Pipelines can embed a manifest under `moose/lineage.manifest.json` (preferred)
 * or `lineage/manifest.json` within the implementation directory.
 */

export type MooseLineageNodeType =
  | "connector"
  | "ingest_api"
  | "stream"
  | "dlq"
  | "transform"
  | "sync"
  | "table"
  | "materialized_view"
  | "external_table"
  | "consumption_api"
  | "openapi_spec"
  | "client"
  | "workflow"
  | (string & {});

export interface MooseConnectorRef {
  /** Connector registry ID (e.g., "google-analytics", "hubspot") */
  name: string;
  /** Optional version tag within the connector registry (e.g., "v4", "v2025-07") */
  version?: string;
  /** Author/organization for the provider (e.g., "514-labs") */
  author?: string;
  /** Implementation language (e.g., "typescript", "python") */
  language?: string;
  /** Implementation name under the language directory (e.g., "data-api", "default") */
  implementation?: string;
}

export interface MooseConnectorAttrs {
  /** Ingestion mode */
  mode: "webhook" | "etl" | "cdc" | (string & {});
  /** Schema/content hash to fingerprint the upstream payload or schema */
  schema_hash: string;
  /** Canonical reference to the connector that powers this node */
  connector: MooseConnectorRef;
  /**
   * Optional path on disk to a relevant schema for this connector node.
   * Use a repo-relative path so it can be linked in docs.
   */
  schema_path?: string;
  /**
   * Optional human/system identifier for the specific instance used by the pipeline
   * (e.g., a GA4 property like "properties/1234", an account ID, etc.).
   */
  identifier?: string;
  /** Allow additional vendor-specific attributes */
  [key: string]: unknown;
}

export interface MooseIngestApiAttrs {
  route: string;
  version: string;
  auth: {
    method: "jwt" | "api_key" | "none" | (string & {});
    audience?: string;
  };
}

export interface MooseStreamAttrs {
  partitions: number;
  retention_seconds: number;
}

export interface MooseDlqAttrs {
  backing: "stream" | "table" | (string & {});
}

export interface MooseTransformAttrs {
  code_ref: { repo: string; path: string; commit: string; line?: number };
  dlq?: string; // nodeId
}

export interface MooseSyncAttrs {
  semantics: "at_least_once" | (string & {});
  flush: { rows?: number; interval_ms?: number };
  offset_tracking: boolean;
}

export interface MooseTableAttrs {
  physical_name: string;
  engine: string;
  order_by: string;
  deduplicate?: boolean;
}

export interface MooseMaterializedViewAttrs {
  target_table: string;
  select_from: string[];
}

export interface MooseExternalTableAttrs {
  provider: "clickpipes" | "debezium" | "aws_dms" | (string & {});
  lifecycle: "externally_managed" | (string & {});
}

export interface MooseConsumptionApiAttrs {
  route: string;
  query_spec: { params_schema_ref: string; tables_referenced: string[] };
  auth: Record<string, unknown>;
}

export interface MooseOpenapiSpecAttrs {
  path: string; // typically .moose/openapi.yaml
}

export interface MooseClientAttrs {
  kind: "dashboard" | "service" | "agent" | (string & {});
  sdk?: { language: string; version: string };
}

export interface MooseWorkflowAttrs {
  kind: "workflow" | "task" | (string & {});
  schedule?: string;
}

export interface MooseLineageNodeBase {
  /** Unique node ID within the manifest graph */
  id: string;
  /** Node kind */
  type: MooseLineageNodeType;
  /** Human-readable name */
  name: string;
  /** Logical namespace/owner for this node (e.g., system or domain) */
  namespace: string;
  /** Version for the node definition/model */
  version: string;
}

export type MooseLineageNode =
  | (MooseLineageNodeBase & { type: "connector"; attrs: MooseConnectorAttrs })
  | (MooseLineageNodeBase & { type: "ingest_api"; attrs: MooseIngestApiAttrs })
  | (MooseLineageNodeBase & { type: "stream"; attrs: MooseStreamAttrs })
  | (MooseLineageNodeBase & { type: "dlq"; attrs: MooseDlqAttrs })
  | (MooseLineageNodeBase & { type: "transform"; attrs: MooseTransformAttrs })
  | (MooseLineageNodeBase & { type: "sync"; attrs: MooseSyncAttrs })
  | (MooseLineageNodeBase & { type: "table"; attrs: MooseTableAttrs })
  | (MooseLineageNodeBase & {
      type: "materialized_view";
      attrs: MooseMaterializedViewAttrs;
    })
  | (MooseLineageNodeBase & {
      type: "external_table";
      attrs: MooseExternalTableAttrs;
    })
  | (MooseLineageNodeBase & {
      type: "consumption_api";
      attrs: MooseConsumptionApiAttrs;
    })
  | (MooseLineageNodeBase & {
      type: "openapi_spec";
      attrs: MooseOpenapiSpecAttrs;
    })
  | (MooseLineageNodeBase & { type: "client"; attrs: MooseClientAttrs })
  | (MooseLineageNodeBase & { type: "workflow"; attrs: MooseWorkflowAttrs })
  | (MooseLineageNodeBase & { type: string; attrs?: Record<string, unknown> });

export type MooseLineageEdgeType =
  | "produces"
  | "publishes"
  | "dead_letters_to"
  | "transforms"
  | "emits"
  | "syncs_to"
  | "writes"
  | "derives"
  | "reads"
  | "queries"
  | "serves"
  | "documents"
  | "triggers"
  | "backfills"
  | "retries_from"
  | (string & {});

export type MooseEdgeCommonAttrs = {
  schema_from_hash?: string;
  schema_to_hash?: string;
  privacy_tags?: string[];
  policy?: {
    retention_days?: number;
    encryption?: "at_rest" | "none" | (string & {});
  };
} & Record<string, unknown>;

export interface MooseLineageEdge {
  from: string;
  to: string;
  type: MooseLineageEdgeType;
  attrs?: MooseEdgeCommonAttrs;
}

export interface MooseLineageManifest {
  version: string;
  namespace: string;
  nodes: MooseLineageNode[];
  edges: MooseLineageEdge[];
}
