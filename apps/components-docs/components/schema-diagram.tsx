"use client";

import React, { useMemo, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  MarkerType,
  type Edge,
  type Node,
  type NodeProps,
  Position,
  Handle,
} from "reactflow";
import "reactflow/dist/style.css";
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
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";

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
        selected && "ring-2 ring-primary"
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
        <li className="flex items-center justify-between rounded-sm px-2 py-1 hover:bg-muted">
          <div
            className="flex items-center gap-2"
            style={{ paddingLeft: level * 12 }}
          >
            <span className="font-medium">{p.name}</span>
            <span className="text-muted-foreground text-[10px]">
              {p.required === false ? "(optional)" : ""}
            </span>
          </div>
          <span className="text-muted-foreground">{p.type}</span>
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
        selected && "ring-2 ring-primary"
      )}
    >
      <div className="flex items-center gap-2 border-b px-3 py-2 bg-secondary/60">
        <Globe className="h-4 w-4" />
        <div className="font-medium text-sm truncate" title={data.title}>
          {data.title}
        </div>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "px-2 py-0.5 rounded text-xs text-white",
              methodColor
            )}
          >
            {data.method}
          </span>
          <code className="text-xs text-muted-foreground">{data.path}</code>
        </div>
        {data.summary ? (
          <p className="text-xs text-muted-foreground">{data.summary}</p>
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
};

function FileNode(props: NodeProps<FileData>) {
  const { data, selected } = props;
  const Icon = data.format === "csv" ? FileText : FileJson;
  return (
    <div
      className={cn(
        "rounded-md border bg-card shadow-sm w-[260px]",
        selected && "ring-2 ring-primary"
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
}: {
  database?: { tables?: DiagramTable[]; relationships?: DiagramRelationship[] };
  endpoints?: DiagramEndpoint[];
  files?: DiagramFile[];
}) {
  const [active, setActive] = useState<"database" | "endpoints" | "files">(
    "database"
  );
  const miniMapMaskColor = "var(--rf-minimap-mask)";
  const miniMapStyle = {
    backgroundColor: "var(--muted)",
  } as React.CSSProperties;
  const miniMapNodeColor = "var(--card)";
  const miniMapNodeStrokeColor = "var(--border)";

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
        },
      });
    });
    return nodes;
  }, [database]);

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
        },
      };
    });
  }, [endpoints]);

  const jsonEdges = useMemo<Edge[]>(() => [], []);

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
        data: { name: f.name, format: f.format, details: f.details },
      };
    });
  }, [files]);

  const fileEdges = useMemo<Edge[]>(() => [], []);

  // Sidebar helpers removed for simplified file list

  return (
    <Card className="w-full overflow-hidden pt-4">
      <Tabs
        value={active}
        onValueChange={(v) => setActive(v as any)}
        className="w-full"
      >
        <div className="flex items-center justify-between px-4">
          <TabsList>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>
        </div>
        <Separator className="mt-2" />

        {/* Database Tab */}
        <TabsContent value="database" className="m-0">
          <div className="grid grid-cols-12 gap-0 h-[560px]">
            <div className="col-span-4 border-r bg-muted/40 h-full">
              <div className="p-4">
                <div className="font-medium mb-2">Tables</div>
                <Input
                  placeholder="Filter tables, columns..."
                  className="h-9"
                />
              </div>
              <Separator />
              <ScrollArea className="h-[calc(560px-72px)]">
                <div className="p-3 space-y-2">
                  <ul className="space-y-1">
                    {(database?.tables ?? []).map((t) => (
                      <li
                        key={t.label}
                        className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-secondary"
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
                nodes={dbNodes}
                edges={dbEdges}
                nodeTypes={allNodeTypes as any}
                fitView
                proOptions={{ hideAttribution: true }}
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
                  Example UML-like schema
                </Panel>
              </ReactFlow>
            </div>
          </div>
        </TabsContent>

        {/* Endpoints Tab */}
        <TabsContent value="endpoints" className="m-0">
          <div className="grid grid-cols-12 gap-0 h-[560px]">
            <div className="col-span-4 border-r bg-muted/40 h-full">
              <div className="p-4">
                <div className="font-medium mb-2">Endpoints</div>
                <Input placeholder="Filter endpoints..." className="h-9" />
              </div>
              <Separator />
              <ScrollArea className="h-[calc(560px-72px)]">
                <div className="p-3 space-y-2">
                  <ul className="space-y-1">
                    {(endpoints ?? []).map((e, idx) => (
                      <li
                        key={`${e.title}-${idx}`}
                        className="rounded-md px-2 py-1.5 hover:bg-secondary flex items-center gap-2"
                      >
                        <Badge className="text-[10px]">{e.method}</Badge>
                        <span className="text-sm">{e.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollArea>
            </div>

            <div className="col-span-8 h-full">
              <ReactFlow
                nodes={jsonNodes}
                edges={jsonEdges}
                nodeTypes={allNodeTypes as any}
                fitView
                proOptions={{ hideAttribution: true }}
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
                  Example endpoints and response schemas
                </Panel>
              </ReactFlow>
            </div>
          </div>
        </TabsContent>

        {/* Files Tab */}
        <TabsContent value="files" className="m-0">
          <div className="grid grid-cols-12 gap-0 h-[560px]">
            <div className="col-span-4 border-r bg-muted/40 h-full">
              <div className="p-4">
                <div className="font-medium mb-2">Files</div>
                <Input placeholder="Filter files..." className="h-9" />
              </div>
              <Separator />
              <ScrollArea className="h-[calc(560px-72px)]">
                <div className="p-3 space-y-2">
                  <ul className="space-y-1">
                    {(files ?? []).map((f, idx) => (
                      <li key={`${f.name}-${idx}`} className="">
                        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-secondary">
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
                nodes={fileNodes}
                edges={fileEdges}
                nodeTypes={allNodeTypes as any}
                fitView
                proOptions={{ hideAttribution: true }}
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
                  Example file schemas
                </Panel>
              </ReactFlow>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default SchemaDiagram;
