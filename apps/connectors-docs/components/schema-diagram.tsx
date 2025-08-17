"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  type ReactFlowInstance,
  MarkerType,
  type Edge,
  type Node,
  type NodeProps,
  Position,
  Handle,
} from "reactflow";
import "reactflow/dist/style.css";
// @ts-ignore - ELK browser bundle lacks typings in this path
import ELK from "elkjs/lib/elk.bundled.js";
import { Card } from "@ui/components/card";
import { Separator } from "@ui/components/separator";
import { ScrollArea } from "@ui/components/scroll-area";
import { Badge } from "@ui/components/badge";
import { Input } from "@ui/components/input";
import { cn } from "@ui/lib/utils";
import {
  Database,
  KeyRound,
  Link2,
  Globe,
  FileJson,
  FileText,
  ChevronRight,
  ChevronDown,
  Folder,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ui/components/tooltip";

type Column = {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  nullable?: boolean;
};

type TableData = {
  label: string;
  columns: Column[];
};

function TableNode(props: NodeProps<TableData>) {
  const { data, selected } = props;
  return (
    <div
      className={cn(
        "rounded-md border bg-card text-card-foreground shadow-sm w-[280px]",
        (selected || (data as any).highlighted) && "ring-2 ring-primary"
      )}
    >
      <div className="flex items-center gap-2 border-b px-3 py-2 bg-secondary/60">
        <Database className="h-4 w-4" />
        <div className="font-medium text-sm">{data.label}</div>
      </div>
      <div className="p-2">
        <ul className="space-y-1">
          {data.columns.map((col, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between rounded-sm px-2 py-1 hover:bg-muted"
            >
              <div className="flex items-center gap-2 text-sm">
                {col.isPrimaryKey ? (
                  <KeyRound className="h-3.5 w-3.5 text-amber-600" />
                ) : col.isForeignKey ? (
                  <Link2 className="h-3.5 w-3.5 text-sky-700" />
                ) : (
                  <span className="h-3.5 w-3.5" />
                )}
                <span className="font-medium">{col.name}</span>
                <span className="text-muted-foreground">
                  {col.nullable ? "?" : ""}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{col.type}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Handles for connecting tables */}
      <Handle type="source" position={Position.Right} id="r" />
      <Handle type="target" position={Position.Left} id="l" />
    </div>
  );
}

const nodeTypes = { table: TableNode } as const;
// JSON endpoint node
type EndpointParam = {
  name: string;
  type: string;
  required?: boolean;
  children?: EndpointParam[];
};

type EndpointData = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  title: string;
  summary?: string;
  params?: EndpointParam[];
  highlighted?: boolean;
};

function EndpointNode(props: NodeProps<EndpointData>) {
  const { data, selected } = props;
  const methodColor =
    data.method === "GET"
      ? "bg-sky-600"
      : data.method === "POST"
        ? "bg-emerald-600"
        : data.method === "DELETE"
          ? "bg-rose-600"
          : "bg-amber-600";

  const renderParams = (
    params: EndpointParam[],
    level = 0
  ): React.ReactNode => {
    return params.map((p, idx) => (
      <React.Fragment key={`${p.name}-${idx}`}>
        <li className="flex items-center justify-between rounded-sm px-2 py-1 hover:bg-muted min-w-0 gap-2">
          <div
            className="flex items-center gap-2 min-w-0 flex-1"
            style={{ paddingLeft: level * 12 }}
          >
            <Tooltip delayDuration={1000}>
              <TooltipTrigger asChild>
                <span className="font-medium truncate">{p.name}</span>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                align="start"
                className="max-w-[520px] break-words"
              >
                {p.name}
              </TooltipContent>
            </Tooltip>
            <span className="text-muted-foreground text-[10px] whitespace-nowrap">
              {p.required === false ? "(optional)" : ""}
            </span>
          </div>
          <span className="text-muted-foreground truncate max-w-[45%]">
            {p.type}
          </span>
        </li>
        {p.children && p.children.length > 0
          ? renderParams(p.children, level + 1)
          : null}
      </React.Fragment>
    ));
  };

  return (
    <div
      className={cn(
        "rounded-md border bg-card shadow-sm w-[320px]",
        (selected || data.highlighted) && "ring-2 ring-primary"
      )}
    >
      <div className="flex items-center gap-2 border-b px-3 py-2 bg-secondary/60 min-w-0">
        <Globe className="h-4 w-4" />
        <Tooltip delayDuration={1000}>
          <TooltipTrigger asChild>
            <div className="font-medium text-sm truncate min-w-0 flex-1">
              {data.title}
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            align="start"
            className="max-w-[520px] break-words"
          >
            {data.title}
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={cn(
              "px-2 py-0.5 rounded text-xs text-white",
              methodColor
            )}
          >
            {data.method}
          </span>
          <Tooltip delayDuration={1000}>
            <TooltipTrigger asChild>
              <code className="text-xs text-muted-foreground truncate min-w-0 flex-1">
                {data.path}
              </code>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              align="start"
              className="max-w-[520px] break-words"
            >
              {data.path}
            </TooltipContent>
          </Tooltip>
        </div>
        {data.summary ? (
          <p className="text-xs text-muted-foreground line-clamp-2 break-words">
            {data.summary}
          </p>
        ) : null}
        {data.params && data.params.length > 0 ? (
          <ul className="text-xs space-y-0.5">{renderParams(data.params)}</ul>
        ) : null}
      </div>
      <Handle type="source" position={Position.Right} id="r" />
      <Handle type="target" position={Position.Left} id="l" />
    </div>
  );
}

// File node
type FileData = {
  name: string;
  format: "csv" | "json" | "parquet" | "avro" | "ndjson" | string;
  details?: string;
  highlighted?: boolean;
};

function FileNode(props: NodeProps<FileData>) {
  const { data, selected } = props;
  const Icon = data.format === "csv" ? FileText : FileJson;
  return (
    <div
      className={cn(
        "rounded-md border bg-card shadow-sm w-[260px]",
        (selected || data.highlighted) && "ring-2 ring-primary"
      )}
    >
      <div className="flex items-center gap-2 border-b px-3 py-2 bg-secondary/60">
        <Icon className="h-4 w-4" />
        <div className="font-medium text-sm truncate" title={data.name}>
          {data.name}
        </div>
        <Badge variant="secondary" className="ml-auto text-[10px]">
          {data.format}
        </Badge>
      </div>
      {data.details ? (
        <div className="p-3">
          <p className="text-xs text-muted-foreground">{data.details}</p>
        </div>
      ) : null}
      <Handle type="source" position={Position.Right} id="r" />
      <Handle type="target" position={Position.Left} id="l" />
    </div>
  );
}

const allNodeTypes = {
  table: TableNode,
  endpoint: EndpointNode,
  file: FileNode,
} as const;

// --- ELK layout helpers ----------------------------------------------------

type AnyNode = Node<any>;

const elkInstance = new ELK();

type ElkLayoutOptions = {
  direction?: "RIGHT" | "DOWN" | "LEFT" | "UP";
  nodeSpacing?: number;
  layerSpacing?: number;
  edgeNodeSpacing?: number;
};

function estimateNodeSize(n: AnyNode): { width: number; height: number } {
  // Provide best-effort size hints so ELK can avoid overlaps. These
  // do not need to be pixel-perfect; we prefer generous spacing.
  const type = n.type;
  if (type === "table") {
    const columns = ((n.data as any)?.columns as any[]) ?? [];
    const width = 280; // matches TableNode width
    const base = 56; // header + paddings
    const row = 24; // per column row
    return { width, height: base + columns.length * row };
  }
  if (type === "endpoint") {
    const params = ((n.data as any)?.params as any[]) ?? [];
    const flatten = (ps: any[]): number =>
      ps.reduce(
        (acc, p) =>
          acc + 1 + (Array.isArray(p.children) ? flatten(p.children) : 0),
        0
      );
    const width = 320; // matches EndpointNode width
    const base = 88; // header + path + summary
    const per = 18;
    return { width, height: base + flatten(params) * per };
  }
  if (type === "file") {
    const width = 260; // matches FileNode width
    const hasDetails = Boolean((n.data as any)?.details);
    return { width, height: hasDetails ? 120 : 80 };
  }
  // default fallback
  return { width: 200, height: 80 };
}

async function runElkLayout(
  nodes: AnyNode[],
  edges: Edge[],
  opts?: ElkLayoutOptions
): Promise<AnyNode[]> {
  const hasEdges = (edges?.length ?? 0) > 0;
  const layoutOptions: Record<string, string> = {
    "elk.algorithm": hasEdges ? "layered" : "force",
    "elk.direction": opts?.direction ?? "RIGHT",
    // spacing between nodes in same layer
    "elk.spacing.nodeNode": String(opts?.nodeSpacing ?? 80),
    // spacing between layers
    "elk.layered.spacing.nodeNodeBetweenLayers": String(
      opts?.layerSpacing ?? 100
    ),
    // route edges around nodes instead of through them
    "elk.edgeRouting": "ORTHOGONAL",
    // keep some distance between edges and nodes
    "elk.spacing.edgeNode": String(opts?.edgeNodeSpacing ?? 40),
    // crossing minimization improves readability
    "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
  };

  const children = nodes.map((n) => {
    const size = estimateNodeSize(n);
    return {
      id: n.id,
      width: size.width,
      height: size.height,
    };
  });

  const elkEdges = edges.map((e) => ({
    id: e.id,
    sources: [e.source],
    targets: [e.target],
  }));

  const graph = {
    id: "root",
    layoutOptions,
    children,
    edges: elkEdges,
  } as any;

  const res = (await elkInstance.layout(graph)) as any;
  const byId = new Map<string, any>(
    (res.children ?? []).map((c: any) => [c.id, c])
  );
  return nodes.map((n) => {
    const g = byId.get(n.id);
    if (!g) return n;
    return {
      ...n,
      position: { x: g.x ?? n.position.x, y: g.y ?? n.position.y },
    };
  });
}

type DiagramTable = {
  label: string;
  columns: Column[];
};

type DiagramRelationship = {
  sourceTable: string;
  targetTable: string;
  label?: string;
};

type DiagramEndpoint = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | string;
  path: string;
  title: string;
  summary?: string;
  params?: EndpointParam[];
  folders?: string[];
};

type DiagramFile = {
  name: string;
  format: "csv" | "json" | "parquet" | "avro" | "ndjson" | string;
  details?: string;
};

export function SchemaDiagram({
  database,
  endpoints,
  files,
  errors,
  connectorName,
}: {
  database?: { tables?: DiagramTable[]; relationships?: DiagramRelationship[] };
  endpoints?: DiagramEndpoint[];
  files?: DiagramFile[];
  errors?: string[];
  connectorName?: string;
}) {
  const [active, setActive] = useState<"database" | "endpoints" | "files">(
    "database"
  );
  const [dbFilter, setDbFilter] = useState("");
  const [epFilter, setEpFilter] = useState("");
  const [fileFilter, setFileFilter] = useState("");
  const miniMapMaskColor = "var(--rf-minimap-mask)";
  const miniMapStyle = {
    backgroundColor: "var(--muted)",
  } as React.CSSProperties;
  const miniMapNodeColor = "var(--card)";
  const miniMapNodeStrokeColor = "var(--border)";
  const dbFlowRef = useRef<ReactFlowInstance | null>(null);
  const jsonFlowRef = useRef<ReactFlowInstance | null>(null);
  const fileFlowRef = useRef<ReactFlowInstance | null>(null);

  // Database schema from props
  const dbNodes = useMemo<Node<TableData>[]>(() => {
    const tables = database?.tables ?? [];
    const seen = new Set<string>();
    const nodes: Node<TableData>[] = [];
    tables.forEach((t, idx) => {
      const baseId = t.label;
      let id = baseId;
      let suffix = 1;
      while (seen.has(id)) {
        id = `${baseId}-${suffix++}`;
      }
      seen.add(id);
      const x = (idx % 3) * 360;
      const y = Math.floor(idx / 3) * 160;
      nodes.push({
        id,
        type: "table",
        position: { x, y },
        data: {
          label: t.label,
          columns: (t.columns ?? []).map((c) => ({
            name: c.name,
            type: c.type,
            isPrimaryKey: c.isPrimaryKey,
            isForeignKey: c.isForeignKey,
            nullable: c.nullable,
          })),
          // @ts-expect-error: augmenting for highlight support
          highlighted: tableMatches(t, dbFilter) && dbFilter.length > 0,
        },
      });
    });
    return nodes;
  }, [database, dbFilter]);

  const dbEdges = useMemo<Edge[]>(() => {
    const rels = database?.relationships ?? [];
    return rels.map((r, idx) => ({
      id: `rel-${idx}`,
      source: r.sourceTable,
      target: r.targetTable,
      sourceHandle: "r",
      targetHandle: "l",
      label: r.label,
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed },
    }));
  }, [database]);

  // Layouted variants
  const [dbLayoutNodes, setDbLayoutNodes] = useState<Node<TableData>[]>([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const laid = await runElkLayout(dbNodes as AnyNode[], dbEdges, {
        direction: "RIGHT",
        nodeSpacing: 80,
        layerSpacing: 120,
        edgeNodeSpacing: 50,
      });
      if (!cancelled) setDbLayoutNodes(laid as Node<TableData>[]);
    })();
    return () => {
      cancelled = true;
    };
  }, [dbNodes, dbEdges]);

  // Endpoints from props
  const jsonNodes = useMemo<Node<EndpointData>[]>(() => {
    const eps = endpoints ?? [];
    return eps.map((e, idx) => {
      const x = (idx % 3) * 360;
      const y = Math.floor(idx / 3) * 160;
      const id = `${e.method}-${e.path}-${idx}`;
      return {
        id,
        type: "endpoint",
        position: { x, y },
        data: {
          method: (e.method as any) ?? "GET",
          path: e.path,
          title: e.title,
          summary: e.summary,
          params: e.params,
          highlighted: endpointMatches(e, epFilter) && epFilter.length > 0,
        },
      };
    });
  }, [endpoints, epFilter]);

  const jsonEdges = useMemo<Edge[]>(() => [], []);

  const [jsonLayoutNodes, setJsonLayoutNodes] = useState<Node<EndpointData>[]>(
    []
  );
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const laid = await runElkLayout(jsonNodes as AnyNode[], jsonEdges, {
        direction: "RIGHT",
        nodeSpacing: 80,
        layerSpacing: 100,
        edgeNodeSpacing: 40,
      });
      if (!cancelled) setJsonLayoutNodes(laid as Node<EndpointData>[]);
    })();
    return () => {
      cancelled = true;
    };
  }, [jsonNodes, jsonEdges]);

  // Files from props
  const fileNodes = useMemo<Node<FileData>[]>(() => {
    const list = files ?? [];
    return list.map((f, idx) => {
      const x = (idx % 3) * 360 + 80;
      const y = Math.floor(idx / 3) * 140 + 20;
      return {
        id: `${f.name}-${idx}`,
        type: "file",
        position: { x, y },
        data: {
          name: f.name,
          format: f.format,
          details: f.details,
          highlighted: fileMatches(f, fileFilter) && fileFilter.length > 0,
        },
      };
    });
  }, [files, fileFilter]);

  const fileEdges = useMemo<Edge[]>(() => [], []);

  const [fileLayoutNodes, setFileLayoutNodes] = useState<Node<FileData>[]>([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const laid = await runElkLayout(fileNodes as AnyNode[], fileEdges, {
        direction: "RIGHT",
        nodeSpacing: 70,
        layerSpacing: 100,
        edgeNodeSpacing: 40,
      });
      if (!cancelled) setFileLayoutNodes(laid as Node<FileData>[]);
    })();
    return () => {
      cancelled = true;
    };
  }, [fileNodes, fileEdges]);

  // Sidebar helpers removed for simplified file list

  const hasDatabase = (database?.tables?.length ?? 0) > 0;
  const hasEndpoints = (endpoints?.length ?? 0) > 0;
  const hasFiles = (files?.length ?? 0) > 0;
  const hasAny = hasDatabase || hasEndpoints || hasFiles;
  const connectorLabel = connectorName ?? "";

  // Pick first available tab automatically
  useEffect(() => {
    const desired = hasDatabase
      ? "database"
      : hasEndpoints
        ? "endpoints"
        : hasFiles
          ? "files"
          : undefined;
    if (desired && active !== desired) setActive(desired as any);
  }, [hasDatabase, hasEndpoints, hasFiles]);

  function includesI(s: string | undefined, q: string): boolean {
    if (!q) return true;
    if (!s) return false;
    return s.toLowerCase().includes(q.toLowerCase());
  }

  function tableMatches(t: DiagramTable, q: string): boolean {
    if (!q) return true;
    if (includesI(t.label, q)) return true;
    return (t.columns ?? []).some(
      (c) => includesI(c.name, q) || includesI(c.type, q)
    );
  }

  function endpointMatches(e: DiagramEndpoint, q: string): boolean {
    if (!q) return true;
    if (
      includesI(e.title, q) ||
      includesI(e.path, q) ||
      includesI(String(e.method), q)
    )
      return true;
    if ((e.folders ?? []).some((f) => includesI(f, q))) return true;
    const stack: EndpointParam[] = [...(e.params ?? [])];
    while (stack.length) {
      const p = stack.pop()!;
      if (includesI(p.name, q) || includesI(p.type, q)) return true;
      if (p.children) stack.push(...p.children);
    }
    return false;
  }

  // Focus helpers for centering/zooming to nodes
  function centerOnNode(
    instance: ReactFlowInstance | null,
    predicate: (n: AnyNode) => boolean
  ) {
    if (!instance) return;
    const nodes = instance.getNodes();
    const target = nodes.find(predicate);
    if (!target) return;
    try {
      instance.fitView({
        nodes: [target as any],
        padding: 0.2,
        duration: 600,
      } as any);
    } catch {}
  }

  function focusTableByLabel(label: string) {
    centerOnNode(dbFlowRef.current, (n) => {
      const d: any = (n as any).data;
      return n.type === "table" && (n.id === label || d?.label === label);
    });
  }

  function focusEndpointItem(e: DiagramEndpoint) {
    const method = String(e.method).toUpperCase();
    centerOnNode(jsonFlowRef.current, (n) => {
      const d: any = (n as any).data;
      return (
        n.type === "endpoint" &&
        String(d?.method).toUpperCase() === method &&
        d?.path === e.path
      );
    });
  }

  function focusFileItem(f: DiagramFile) {
    centerOnNode(fileFlowRef.current, (n) => {
      const d: any = (n as any).data;
      return (
        n.type === "file" &&
        d?.name === f.name &&
        String(d?.format) === String(f.format)
      );
    });
  }

  // Build a nested tree by endpoint folders (derived from registry path)
  type EndpointFolderNode = {
    key: string;
    name: string;
    children: Map<string, EndpointFolderNode>;
    endpoints: DiagramEndpoint[];
  };

  const endpointTree = useMemo<EndpointFolderNode>(() => {
    const root: EndpointFolderNode = {
      key: "",
      name: "",
      children: new Map(),
      endpoints: [],
    };
    const list = (endpoints ?? []).filter((e) => endpointMatches(e, epFilter));
    for (const e of list) {
      const parts = Array.isArray(e.folders) ? e.folders : [];
      let node = root;
      let pathAcc = "";
      for (const part of parts) {
        pathAcc = pathAcc ? `${pathAcc}/${part}` : part;
        if (!node.children.has(part)) {
          node.children.set(part, {
            key: pathAcc,
            name: part,
            children: new Map(),
            endpoints: [],
          });
        }
        node = node.children.get(part)!;
      }
      node.endpoints.push(e);
    }
    return root;
  }, [endpoints, epFilter]);

  function countDescendantEndpoints(node: EndpointFolderNode): number {
    let total = node.endpoints.length;
    for (const child of node.children.values())
      total += countDescendantEndpoints(child);
    return total;
  }

  // Track expanded folders
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  useEffect(() => {
    // Auto-expand all when filtering
    if (epFilter) {
      const allKeys: string[] = [];
      const collect = (n: EndpointFolderNode) => {
        for (const child of n.children.values()) {
          allKeys.push(child.key);
          collect(child);
        }
      };
      collect(endpointTree);
      setExpandedFolders(new Set(allKeys));
    }
  }, [epFilter, endpointTree]);

  function toggleFolder(key: string) {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function renderEndpointTree(
    node: EndpointFolderNode,
    depth = 0
  ): React.ReactNode {
    const items: React.ReactNode[] = [];
    const sortedChildren = Array.from(node.children.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    for (const child of sortedChildren) {
      const isOpen = expandedFolders.has(child.key);
      const count = countDescendantEndpoints(child);
      items.push(
        <li key={`folder-${child.key}`} className="">
          <div
            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-secondary cursor-pointer"
            style={{ paddingLeft: depth * 12 }}
            onClick={() => toggleFolder(child.key)}
          >
            {isOpen ? (
              <ChevronDown className="h-4 w-4 ml-2" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-2" />
            )}
            <Folder className="h-4 w-4" />
            <span className="text-sm font-medium">{child.name}</span>
            <Badge variant="secondary" className="ml-auto text-[10px]">
              {count}
            </Badge>
          </div>
          {isOpen ? (
            <ul className="space-y-1">
              {renderEndpointTree(child, depth + 1)}
            </ul>
          ) : null}
        </li>
      );
    }
    // leaf endpoints at this level
    for (const e of node.endpoints) {
      items.push(
        <li key={`ep-${e.title}-${e.path}`} className="">
          <div
            className="rounded-md px-2 py-1.5 hover:bg-secondary flex items-center gap-2 cursor-pointer"
            style={{ paddingLeft: depth * 12 + 24 }}
            onClick={() => focusEndpointItem(e)}
          >
            <Badge className="text-[10px]">{e.method}</Badge>
            <span className="text-sm">{e.title}</span>
          </div>
        </li>
      );
    }
    return items;
  }

  function fileMatches(f: DiagramFile, q: string): boolean {
    if (!q) return true;
    return (
      includesI(f.name, q) ||
      includesI(String(f.format), q) ||
      includesI(f.details, q)
    );
  }

  // Render error pane if errors present
  if (errors && errors.length > 0) {
    return (
      <Card className="w-full overflow-hidden pt-4">
        <div className="p-4">
          <div className="mb-2 font-semibold">Schema errors</div>
          <div className="rounded-md border bg-destructive/10 text-destructive">
            <pre className="p-3 text-sm whitespace-pre-wrap break-words">
              {errors.map((e, i) => `• ${e}`).join("\n")}
            </pre>
          </div>
          <div className="mt-2">
            <button
              type="button"
              className="px-3 py-1.5 text-sm rounded-md border hover:bg-secondary"
              onClick={() => navigator.clipboard.writeText(errors.join("\n"))}
            >
              Copy errors
            </button>
          </div>
        </div>
      </Card>
    );
  }

  if (!hasAny) {
    return (
      <Card className="w-full overflow-hidden pt-4">
        <div className="p-6 text-sm text-muted-foreground">
          No schema was provided for this connector.
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden pt-4">
      <Tabs
        value={active}
        onValueChange={(v) => setActive(v as any)}
        className="w-full"
      >
        <div className="flex items-center justify-between px-4">
          <TabsList>
            {hasDatabase && (
              <TabsTrigger value="database">Database</TabsTrigger>
            )}
            {hasEndpoints && (
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            )}
            {hasFiles && <TabsTrigger value="files">Files</TabsTrigger>}
          </TabsList>
        </div>
        <Separator className="mt-2" />

        {/* Database Tab */}
        {hasDatabase && (
          <TabsContent value="database" className="m-0">
            <div className="grid grid-cols-12 gap-0 h-[560px]">
              <div className="col-span-4 border-r bg-muted/40 h-full">
                <div className="p-4">
                  <div className="font-medium mb-2">Tables</div>
                  <Input
                    placeholder="Filter tables, columns..."
                    className="h-9"
                    value={dbFilter}
                    onChange={(e) => setDbFilter(e.target.value)}
                  />
                </div>
                <Separator />
                <ScrollArea className="h-[calc(560px-72px)]">
                  <div className="p-3 space-y-2">
                    <ul className="space-y-1">
                      {(database?.tables ?? [])
                        .filter((t) => tableMatches(t, dbFilter))
                        .map((t) => (
                          <li
                            key={t.label}
                            className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-secondary cursor-pointer"
                            onClick={() => focusTableByLabel(t.label)}
                          >
                            <span className="text-sm">{t.label}</span>
                            <Badge variant="secondary" className="text-[10px]">
                              {t.columns?.length ?? 0}
                            </Badge>
                          </li>
                        ))}
                    </ul>
                    <Separator className="my-2" />
                    <div className="text-xs uppercase text-muted-foreground px-1">
                      Legend
                    </div>
                    <div className="grid grid-cols-1 gap-2 p-1">
                      <div className="flex items-center gap-2 text-sm">
                        <KeyRound className="h-3.5 w-3.5 text-amber-600" />
                        <span>Primary Key</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Link2 className="h-3.5 w-3.5 text-sky-700" />
                        <span>Foreign Key</span>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>

              <div className="col-span-8 h-full">
                <ReactFlow
                  nodes={
                    (dbLayoutNodes.length ? dbLayoutNodes : dbNodes) as Node[]
                  }
                  edges={dbEdges}
                  nodeTypes={allNodeTypes as any}
                  fitView
                  proOptions={{ hideAttribution: true }}
                  onInit={(instance) => {
                    dbFlowRef.current = instance as ReactFlowInstance;
                  }}
                >
                  <Background />
                  <MiniMap
                    pannable
                    zoomable
                    style={miniMapStyle}
                    maskColor={miniMapMaskColor}
                    nodeColor={miniMapNodeColor}
                    nodeStrokeColor={miniMapNodeStrokeColor}
                  />
                  <Controls position="bottom-right" />
                  <Panel
                    position="top-right"
                    className="rounded-md border bg-card px-2 py-1 text-xs shadow-sm"
                  >
                    {connectorLabel
                      ? `${connectorLabel} Database Schema`
                      : `Database Schema`}
                  </Panel>
                </ReactFlow>
              </div>
            </div>
          </TabsContent>
        )}

        {/* Endpoints Tab */}
        {hasEndpoints && (
          <TabsContent value="endpoints" className="m-0">
            <div className="grid grid-cols-12 gap-0 h-[560px]">
              <div className="col-span-4 border-r bg-muted/40 h-full">
                <div className="p-4">
                  <div className="font-medium mb-2">Endpoints</div>
                  <Input
                    placeholder="Filter endpoints..."
                    className="h-9"
                    value={epFilter}
                    onChange={(e) => setEpFilter(e.target.value)}
                  />
                </div>
                <Separator />
                <ScrollArea className="h-[calc(560px-72px)]">
                  <div className="p-3 space-y-2">
                    <ul className="space-y-1">
                      {renderEndpointTree(endpointTree, 0)}
                    </ul>
                  </div>
                </ScrollArea>
              </div>

              <div className="col-span-8 h-full">
                <ReactFlow
                  nodes={
                    (jsonLayoutNodes.length
                      ? jsonLayoutNodes
                      : jsonNodes) as Node[]
                  }
                  edges={jsonEdges}
                  nodeTypes={allNodeTypes as any}
                  fitView
                  proOptions={{ hideAttribution: true }}
                  onInit={(instance) => {
                    jsonFlowRef.current = instance as ReactFlowInstance;
                  }}
                >
                  <Background />
                  <MiniMap
                    pannable
                    zoomable
                    style={miniMapStyle}
                    maskColor={miniMapMaskColor}
                    nodeColor={miniMapNodeColor}
                    nodeStrokeColor={miniMapNodeStrokeColor}
                  />
                  <Controls position="bottom-right" />
                  <Panel
                    position="top-right"
                    className="rounded-md border bg-card px-2 py-1 text-xs shadow-sm"
                  >
                    {connectorLabel
                      ? `${connectorLabel} Endpoints Schema`
                      : `Endpoints Schema`}
                  </Panel>
                </ReactFlow>
              </div>
            </div>
          </TabsContent>
        )}

        {/* Files Tab */}
        {hasFiles && (
          <TabsContent value="files" className="m-0">
            <div className="grid grid-cols-12 gap-0 h-[560px]">
              <div className="col-span-4 border-r bg-muted/40 h-full">
                <div className="p-4">
                  <div className="font-medium mb-2">Files</div>
                  <Input
                    placeholder="Filter files..."
                    className="h-9"
                    value={fileFilter}
                    onChange={(e) => setFileFilter(e.target.value)}
                  />
                </div>
                <Separator />
                <ScrollArea className="h-[calc(560px-72px)]">
                  <div className="p-3 space-y-2">
                    <ul className="space-y-1">
                      {(files ?? [])
                        .filter((f) => fileMatches(f, fileFilter))
                        .map((f, idx) => (
                          <li key={`${f.name}-${idx}`} className="">
                            <div
                              className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-secondary cursor-pointer"
                              onClick={() => focusFileItem(f)}
                            >
                              <FileText className="h-4 w-4" />
                              <span className="text-sm">{f.name}</span>
                              <Badge
                                variant="secondary"
                                className="ml-auto text-[10px]"
                              >
                                {f.format}
                              </Badge>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                </ScrollArea>
              </div>

              <div className="col-span-8 h-full">
                <ReactFlow
                  nodes={
                    (fileLayoutNodes.length
                      ? fileLayoutNodes
                      : fileNodes) as Node[]
                  }
                  edges={fileEdges}
                  nodeTypes={allNodeTypes as any}
                  fitView
                  proOptions={{ hideAttribution: true }}
                  onInit={(instance) => {
                    fileFlowRef.current = instance as ReactFlowInstance;
                  }}
                >
                  <Background />
                  <MiniMap
                    pannable
                    zoomable
                    style={miniMapStyle}
                    maskColor={miniMapMaskColor}
                    nodeColor={miniMapNodeColor}
                    nodeStrokeColor={miniMapNodeStrokeColor}
                  />
                  <Controls position="bottom-right" />
                  <Panel
                    position="top-right"
                    className="rounded-md border bg-card px-2 py-1 text-xs shadow-sm"
                  >
                    {connectorLabel
                      ? `${connectorLabel} Files Schema`
                      : `Files Schema`}
                  </Panel>
                </ReactFlow>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </Card>
  );
}

export default SchemaDiagram;
