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
  Folder,
  FileText,
  ChevronRight,
  ChevronDown,
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
type EndpointData = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  title: string;
  summary?: string;
  fields?: Array<{ name: string; type: string }>;
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
        {data.fields && data.fields.length > 0 ? (
          <ul className="text-xs grid grid-cols-2 gap-x-2 gap-y-1">
            {data.fields.map((f, i) => (
              <li key={i} className="flex items-center justify-between">
                <span>{f.name}</span>
                <span className="text-muted-foreground">{f.type}</span>
              </li>
            ))}
          </ul>
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

export function SchemaDiagram() {
  const [active, setActive] = useState<"database" | "endpoints" | "files">(
    "database"
  );

  // Database schema example
  const dbNodes = useMemo<Node<TableData>[]>(
    () => [
      {
        id: "customers",
        type: "table",
        position: { x: 0, y: 0 },
        data: {
          label: "customers",
          columns: [
            { name: "id", type: "uuid", isPrimaryKey: true },
            { name: "email", type: "text" },
            { name: "name", type: "text" },
            { name: "created_at", type: "timestamp" },
          ],
        },
      },
      {
        id: "orders",
        type: "table",
        position: { x: 360, y: -20 },
        data: {
          label: "orders",
          columns: [
            { name: "id", type: "uuid", isPrimaryKey: true },
            { name: "customer_id", type: "uuid", isForeignKey: true },
            { name: "status", type: "text" },
            { name: "created_at", type: "timestamp" },
          ],
        },
      },
      {
        id: "order_items",
        type: "table",
        position: { x: 720, y: 120 },
        data: {
          label: "order_items",
          columns: [
            { name: "id", type: "uuid", isPrimaryKey: true },
            { name: "order_id", type: "uuid", isForeignKey: true },
            { name: "product_id", type: "uuid", isForeignKey: true },
            { name: "quantity", type: "int" },
          ],
        },
      },
      {
        id: "products",
        type: "table",
        position: { x: 360, y: 300 },
        data: {
          label: "products",
          columns: [
            { name: "id", type: "uuid", isPrimaryKey: true },
            { name: "sku", type: "text" },
            { name: "name", type: "text" },
            { name: "price", type: "numeric" },
          ],
        },
      },
    ],
    []
  );

  const dbEdges = useMemo<Edge[]>(
    () => [
      {
        id: "e1",
        source: "orders",
        target: "customers",
        sourceHandle: "r",
        targetHandle: "l",
        label: "customer_id → customers.id",
        type: "smoothstep",
        animated: false,
        style: { strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e2",
        source: "order_items",
        target: "orders",
        sourceHandle: "r",
        targetHandle: "l",
        label: "order_id → orders.id",
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3",
        source: "order_items",
        target: "products",
        sourceHandle: "r",
        targetHandle: "l",
        label: "product_id → products.id",
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ],
    []
  );

  // JSON endpoints example data
  const jsonCategories = [
    {
      name: "Users",
      endpoints: [
        {
          id: "list-users",
          method: "GET",
          path: "/v1/users",
          title: "List Users",
        },
        {
          id: "get-user",
          method: "GET",
          path: "/v1/users/:id",
          title: "Get User",
        },
        {
          id: "create-user",
          method: "POST",
          path: "/v1/users",
          title: "Create User",
        },
      ],
    },
    {
      name: "Orders",
      endpoints: [
        {
          id: "list-orders",
          method: "GET",
          path: "/v1/orders",
          title: "List Orders",
        },
        {
          id: "get-order",
          method: "GET",
          path: "/v1/orders/:id",
          title: "Get Order",
        },
      ],
    },
  ] as const;

  const jsonNodes = useMemo<Node<EndpointData>[]>(
    () => [
      {
        id: "list-users",
        type: "endpoint",
        position: { x: 0, y: 0 },
        data: {
          method: "GET",
          path: "/v1/users",
          title: "List Users",
          summary: "Returns a paginated list of users",
          fields: [
            { name: "id", type: "string" },
            { name: "email", type: "string" },
          ],
        },
      },
      {
        id: "get-user",
        type: "endpoint",
        position: { x: 360, y: 120 },
        data: {
          method: "GET",
          path: "/v1/users/:id",
          title: "Get User",
          summary: "Returns details for a single user",
          fields: [
            { name: "id", type: "string" },
            { name: "name", type: "string" },
            { name: "createdAt", type: "string (date-time)" },
          ],
        },
      },
      {
        id: "list-orders",
        type: "endpoint",
        position: { x: 720, y: 0 },
        data: {
          method: "GET",
          path: "/v1/orders",
          title: "List Orders",
          summary: "Returns a paginated list of orders",
          fields: [
            { name: "id", type: "string" },
            { name: "customerId", type: "string" },
            { name: "status", type: "string" },
          ],
        },
      },
    ],
    []
  );

  const jsonEdges = useMemo<Edge[]>(
    () => [
      {
        id: "ej1",
        source: "list-users",
        target: "get-user",
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "ej2",
        source: "get-user",
        target: "list-orders",
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ],
    []
  );

  // Files example data
  type FileTree =
    | { type: "folder"; name: string; children: FileTree[] }
    | { type: "file"; name: string; format: "csv" | "json" };

  const files: FileTree[] = [
    {
      type: "folder",
      name: "data",
      children: [
        { type: "file", name: "customers.csv", format: "csv" },
        { type: "file", name: "orders.json", format: "json" },
        {
          type: "folder",
          name: "archived",
          children: [
            { type: "file", name: "2019-orders.json", format: "json" },
            { type: "file", name: "2018-customers.csv", format: "csv" },
          ],
        },
      ],
    },
  ];

  const fileNodes = useMemo<Node<FileData>[]>(
    () => [
      {
        id: "customers.csv",
        type: "file",
        position: { x: 80, y: 20 },
        data: {
          name: "customers.csv",
          format: "csv",
          details: "id,email,name,created_at",
        },
      },
      {
        id: "orders.json",
        type: "file",
        position: { x: 420, y: 160 },
        data: { name: "orders.json", format: "json", details: "Array<Order>" },
      },
      {
        id: "2019-orders.json",
        type: "file",
        position: { x: 760, y: 280 },
        data: { name: "2019-orders.json", format: "json" },
      },
    ],
    []
  );

  const fileEdges = useMemo<Edge[]>(
    () => [
      {
        id: "f1",
        source: "customers.csv",
        target: "orders.json",
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "f2",
        source: "orders.json",
        target: "2019-orders.json",
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ],
    []
  );

  // Sidebar helpers
  const [openFolders, setOpenFolders] = useState<Set<string>>(
    new Set(["data", "data/archived"])
  );
  const toggleFolder = (path: string) => {
    setOpenFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const renderFileTree = (tree: FileTree[], parentPath = "") => (
    <ul className="space-y-1">
      {tree.map((item, idx) => {
        if (item.type === "folder") {
          const path = parentPath ? `${parentPath}/${item.name}` : item.name;
          const isOpen = openFolders.has(path);
          return (
            <li key={`${item.name}-${idx}`} className="">
              <button
                type="button"
                onClick={() => toggleFolder(path)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-secondary text-left"
              >
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <Folder className="h-4 w-4" />
                <span className="text-sm">{item.name}</span>
              </button>
              {isOpen ? (
                <div className="pl-5">
                  {renderFileTree(item.children, path)}
                </div>
              ) : null}
            </li>
          );
        }
        return (
          <li key={`${item.name}-${idx}`} className="">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-secondary">
              <FileText className="h-4 w-4" />
              <span className="text-sm">{item.name}</span>
              <Badge variant="secondary" className="ml-auto text-[10px]">
                {item.format}
              </Badge>
            </div>
          </li>
        );
      })}
    </ul>
  );

  return (
    <Card className="w-full overflow-hidden">
      <Tabs
        value={active}
        onValueChange={(v) => setActive(v as any)}
        className="w-full"
      >
        <div className="flex items-center justify-between px-4 pt-3">
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
                    {["customers", "orders", "order_items", "products"].map(
                      (t) => (
                        <li
                          key={t}
                          className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-secondary"
                        >
                          <span className="text-sm">{t}</span>
                          <Badge variant="secondary" className="text-[10px]">
                            {t.length}
                          </Badge>
                        </li>
                      )
                    )}
                  </ul>
                  <Separator className="my-2" />
                  <div className="text-xs uppercase text-muted-foreground px-1">
                    Legend
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-1">
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
                <MiniMap pannable zoomable />
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
                <div className="p-3 space-y-4">
                  {jsonCategories.map((cat) => (
                    <div key={cat.name} className="space-y-2">
                      <div className="text-xs uppercase text-muted-foreground px-1">
                        {cat.name}
                      </div>
                      <ul className="space-y-1">
                        {cat.endpoints.map((e) => (
                          <li
                            key={e.id}
                            className="rounded-md px-2 py-1.5 hover:bg-secondary flex items-center gap-2"
                          >
                            <Badge className="text-[10px]">{e.method}</Badge>
                            <span className="text-sm">{e.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
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
                <MiniMap pannable zoomable />
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
                <div className="p-3 space-y-2">{renderFileTree(files)}</div>
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
                <MiniMap pannable zoomable />
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
