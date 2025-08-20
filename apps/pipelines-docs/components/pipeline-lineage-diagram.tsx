"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  type ReactFlowInstance,
  type Edge,
  type Node,
  Position,
  Handle,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
// @ts-ignore - ELK browser bundle lacks typings in this path
import ELK from "elkjs/lib/elk.bundled.js";
import { Card } from "@ui/components/card";
import { Badge } from "@ui/components/badge";
import { Input } from "@ui/components/input";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@ui/components/command";
import { cn } from "@ui/lib/utils";
import {
  Database,
  Boxes,
  ArrowRight,
  Package,
  CircuitBoard as PipelineIcon,
} from "lucide-react";

export type LineageTransformation = {
  name?: string;
  type?: string;
  description?: string;
};

export type LineageTable = {
  label: string;
  columns?: Array<{ name: string; type?: string }>;
};

// Moose graph inputs
export type MooseUiNode = {
  id: string;
  kind: string;
  title: string;
  subtitle?: string;
};

export type MooseUiEdge = {
  id: string;
  from: string;
  to: string;
  kind: string;
  label?: string;
};

export function PipelineLineageDiagram({
  sourceName,
  sourceIcon,
  destinationName,
  destinationIcon,
  transformations,
  schemaTables,
  mooseGraph,
}: {
  sourceName: string;
  sourceIcon?: string;
  destinationName?: string;
  destinationIcon?: string;
  transformations: LineageTransformation[];
  schemaTables: LineageTable[];
  mooseGraph?: { nodes: MooseUiNode[]; edges: MooseUiEdge[] } | null;
}) {
  type AnyNode = Node<any>;

  const elk = useMemo(() => new ELK(), []);

  function estimateNodeSize(n: AnyNode): { width: number; height: number } {
    if (n.type === "source") return { width: 260, height: 120 };
    if (n.type === "transform") return { width: 260, height: 120 };
    if (n.type === "schema") {
      const list = ((n.data?.tables as any[]) ?? []).length;
      const base = 88;
      const per = 18;
      return { width: 300, height: base + Math.min(list, 10) * per };
    }
    if (n.type === "moose") {
      const title = String(n.data?.title ?? "");
      const subtitle = String(n.data?.subtitle ?? "");
      const lines = 1 + (subtitle ? 1 : 0) + (title.length > 28 ? 1 : 0);
      return { width: 280, height: 80 + lines * 8 };
    }
    return { width: 220, height: 80 };
  }

  async function layout(nodes: AnyNode[], edges: Edge[]): Promise<AnyNode[]> {
    const children = nodes.map((n) => {
      const s = estimateNodeSize(n);
      return { id: n.id, width: s.width, height: s.height } as any;
    });
    const elkEdges = edges.map((e) => ({
      id: e.id,
      sources: [e.source],
      targets: [e.target],
    }));
    const res = (await elk.layout({
      id: "root",
      layoutOptions: {
        "elk.algorithm": edges.length ? "layered" : "force",
        "elk.direction": "RIGHT",
        "elk.spacing.nodeNode": "80",
        "elk.layered.spacing.nodeNodeBetweenLayers": "120",
        "elk.edgeRouting": "ORTHOGONAL",
        "elk.spacing.edgeNode": "40",
      },
      children,
      edges: elkEdges,
    } as any)) as any;
    const byId = new Map<string, any>(
      (res.children ?? []).map((c: any) => [c.id, c])
    );
    return nodes.map((n) => {
      const g = byId.get(n.id);
      return g ? { ...n, position: { x: g.x ?? 0, y: g.y ?? 0 } } : n;
    });
  }

  const rawNodes = useMemo<AnyNode[]>(() => {
    const nodes: AnyNode[] = [];

    if (mooseGraph && mooseGraph.nodes.length > 0) {
      for (const n of mooseGraph.nodes) {
        nodes.push({
          id: n.id,
          type: "moose",
          position: { x: 0, y: 0 },
          data: {
            kind: n.kind,
            title: n.title,
            subtitle: n.subtitle,
          },
        });
      }
      return nodes;
    }

    nodes.push({
      id: "source",
      type: "source",
      position: { x: 0, y: 0 },
      data: { name: sourceName, icon: sourceIcon },
    });

    transformations.forEach((t, idx) => {
      nodes.push({
        id: `t-${idx}`,
        type: "transform",
        position: { x: 0, y: 0 },
        data: {
          name: t.name || `Transformation ${idx + 1}`,
          sub: t.type || t.description,
        },
      });
    });

    nodes.push({
      id: "schema",
      type: "schema",
      position: { x: 0, y: 0 },
      data: {
        name: destinationName || "Schema",
        icon: destinationIcon,
        tables: schemaTables,
      },
    });

    return nodes;
  }, [
    sourceName,
    sourceIcon,
    destinationName,
    destinationIcon,
    transformations,
    schemaTables,
    mooseGraph,
  ]);

  const rawEdges = useMemo<Edge[]>(() => {
    const edges: Edge[] = [];
    if (mooseGraph && mooseGraph.edges.length > 0) {
      for (const e of mooseGraph.edges) {
        edges.push({
          id: e.id,
          source: e.from,
          target: e.to,
          type: "smoothstep",
          label: e.label,
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }
      return edges;
    }
    const hasTransforms = transformations.length > 0;
    if (hasTransforms) {
      edges.push({
        id: "e-src-t0",
        source: "source",
        target: "t-0",
        sourceHandle: "r",
        targetHandle: "l",
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed },
      });
      for (let i = 0; i < transformations.length - 1; i += 1) {
        edges.push({
          id: `e-t${i}-t${i + 1}`,
          source: `t-${i}`,
          target: `t-${i + 1}`,
          sourceHandle: "r",
          targetHandle: "l",
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }
      edges.push({
        id: "e-last-schema",
        source: `t-${transformations.length - 1}`,
        target: "schema",
        sourceHandle: "r",
        targetHandle: "l",
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed },
      });
    } else {
      edges.push({
        id: "e-src-schema",
        source: "source",
        target: "schema",
        sourceHandle: "r",
        targetHandle: "l",
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed },
      });
    }
    return edges;
  }, [transformations.length, mooseGraph]);

  const [layoutNodes, setLayoutNodes] = useState<AnyNode[]>(rawNodes);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const laid = await layout(rawNodes, rawEdges);
      if (!cancelled) setLayoutNodes(laid);
    })();
    return () => {
      cancelled = true;
    };
  }, [rawNodes, rawEdges]);

  const nodeTypes = useMemo(
    () => ({
      source: SourceNode,
      transform: TransformNode,
      schema: SchemaNode,
      moose: MooseNode,
    }),
    []
  );

  const flowRef = useRef<ReactFlowInstance | null>(null);
  const [flowReady, setFlowReady] = useState(false);
  const [hasAutoCentered, setHasAutoCentered] = useState(false);

  function centerOnNodes(ids: string[]) {
    const instance = flowRef.current;
    if (!instance || ids.length === 0) return;
    const nodes = instance.getNodes().filter((n) => ids.includes(n.id));
    if (!nodes.length) return;
    try {
      instance.fitView({
        nodes: nodes as any,
        padding: 0.2,
        duration: 600,
      } as any);
    } catch {}
  }

  function focusNodeById(id: string) {
    centerOnNodes([id]);
  }

  function focusEdgeById(id: string) {
    const e = rawEdges.find((x) => x.id === id);
    if (!e) return;
    centerOnNodes([e.source, e.target]);
  }

  function displayNameForNode(n: AnyNode): string {
    if (n.type === "moose") {
      const title = String((n as any).data?.title ?? "");
      return title || n.id;
    }
    if (n.type === "source")
      return `Source: ${String((n as any).data?.name ?? "")}`;
    if (n.type === "transform")
      return `Transformation: ${String((n as any).data?.name ?? "")}`;
    if (n.type === "schema") {
      const name = String((n as any).data?.name ?? "Schema");
      return name ? `Schema: ${name}` : "Schema";
    }
    return n.id;
  }

  const currentNodes = useMemo(
    () => (layoutNodes.length ? layoutNodes : rawNodes),
    [layoutNodes, rawNodes]
  );
  const nodeNameById = useMemo(() => {
    const m = new Map<string, string>();
    currentNodes.forEach((n) => m.set(n.id, displayNameForNode(n)));
    return m;
  }, [currentNodes]);

  type SearchNodeItem = {
    kind: "node";
    id: string;
    label: string;
    sub?: string;
    icon?: React.ReactNode;
  };
  type SearchEdgeItem = {
    kind: "edge";
    id: string;
    label: string;
    sub?: string;
    icon?: React.ReactNode;
  };

  const nodeItems = useMemo<SearchNodeItem[]>(() => {
    return currentNodes.map((n) => {
      const label = displayNameForNode(n);
      const sub = (() => {
        if (n.type === "moose")
          return String(
            (n as any).data?.subtitle ?? (n as any).data?.kind ?? ""
          );
        if (n.type === "transform") return String((n as any).data?.sub ?? "");
        if (n.type === "source") return "Source";
        if (n.type === "schema") return "Schema";
        return "";
      })();
      const icon =
        n.type === "moose" ? (
          <PipelineIcon className="h-4 w-4" />
        ) : n.type === "source" ? (
          <Package className="h-4 w-4" />
        ) : n.type === "transform" ? (
          <Boxes className="h-4 w-4" />
        ) : (
          <Database className="h-4 w-4" />
        );
      return { kind: "node", id: n.id, label, sub, icon };
    });
  }, [currentNodes]);

  const edgeItems = useMemo<SearchEdgeItem[]>(() => {
    return rawEdges.map((e) => {
      const from = nodeNameById.get(e.source) ?? e.source;
      const to = nodeNameById.get(e.target) ?? e.target;
      const label = e.label ? String(e.label) : `${from} → ${to}`;
      const sub = e.label ? `${from} → ${to}` : undefined;
      return {
        kind: "edge",
        id: e.id,
        label,
        sub,
        icon: <ArrowRight className="h-4 w-4" />,
      };
    });
  }, [rawEdges, nodeNameById]);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (searchRef.current && !searchRef.current.contains(t)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function includesI(s: string | undefined, q: string): boolean {
    if (!q) return true;
    if (!s) return false;
    return s.toLowerCase().includes(q.toLowerCase());
  }

  const filteredNodeItems = useMemo(() => {
    if (!searchQuery) return nodeItems;
    return nodeItems.filter(
      (it) => includesI(it.label, searchQuery) || includesI(it.sub, searchQuery)
    );
  }, [nodeItems, searchQuery]);

  const filteredEdgeItems = useMemo(() => {
    if (!searchQuery) return edgeItems;
    return edgeItems.filter(
      (it) => includesI(it.label, searchQuery) || includesI(it.sub, searchQuery)
    );
  }, [edgeItems, searchQuery]);

  // Auto-center once after nodes have been laid out and the flow is ready
  useEffect(() => {
    if (!flowReady || hasAutoCentered) return;
    const nodes = currentNodes;
    if (!nodes || nodes.length === 0) return;
    try {
      const instance = flowRef.current;
      if (instance) {
        instance.fitView({ padding: 0.2, duration: 400 } as any);
        setHasAutoCentered(true);
      }
    } catch {}
  }, [flowReady, hasAutoCentered, currentNodes]);

  return (
    <Card className="w-full overflow-hidden py-0">
      <div className="h-[520px]">
        <ReactFlow
          nodes={(layoutNodes.length ? layoutNodes : rawNodes) as Node[]}
          edges={rawEdges}
          nodeTypes={nodeTypes as any}
          fitView
          proOptions={{ hideAttribution: true }}
          onInit={(instance) => {
            flowRef.current = instance as ReactFlowInstance;
            setFlowReady(true);
          }}
        >
          <Background />
          <MiniMap pannable zoomable />
          <Controls position="bottom-right" />
          <Panel position="top-right" className="space-y-2">
            <div className="w-[320px] relative" ref={searchRef}>
              <Input
                placeholder="Search nodes or edges..."
                className="h-8"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setSearchOpen(false);
                    (e.target as HTMLInputElement).blur();
                  }
                }}
              />
              {searchOpen ? (
                <div className="absolute left-0 right-0 mt-1 z-10 rounded-md border bg-popover text-popover-foreground shadow-md">
                  <Command>
                    <CommandList>
                      {filteredNodeItems.length > 0 ? (
                        <CommandGroup heading="Nodes">
                          {filteredNodeItems.map((it) => (
                            <CommandItem
                              key={`node-${it.id}`}
                              value={`${it.label} ${it.sub ?? ""}`}
                              onSelect={() => {
                                focusNodeById(it.id);
                                setSearchOpen(false);
                              }}
                            >
                              <span className="mr-2 text-muted-foreground">
                                {it.icon}
                              </span>
                              <span className="truncate">{it.label}</span>
                              {it.sub ? (
                                <span className="ml-auto text-xs text-muted-foreground">
                                  {it.sub}
                                </span>
                              ) : null}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ) : null}
                      {filteredEdgeItems.length > 0 ? (
                        <CommandGroup heading="Edges">
                          {filteredEdgeItems.map((it) => (
                            <CommandItem
                              key={`edge-${it.id}`}
                              value={`${it.label} ${it.sub ?? ""}`}
                              onSelect={() => {
                                focusEdgeById(it.id);
                                setSearchOpen(false);
                              }}
                            >
                              <span className="mr-2 text-muted-foreground">
                                {it.icon}
                              </span>
                              <span className="truncate">{it.label}</span>
                              {it.sub ? (
                                <span className="ml-auto text-xs text-muted-foreground">
                                  {it.sub}
                                </span>
                              ) : null}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ) : null}
                      {filteredNodeItems.length === 0 &&
                      filteredEdgeItems.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                          No results
                        </div>
                      ) : null}
                    </CommandList>
                  </Command>
                </div>
              ) : null}
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </Card>
  );
}

function SourceNode({
  data,
  selected,
}: {
  data: { name: string; icon?: string };
  selected: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-md border bg-card shadow-sm w-[260px]",
        selected && "ring-2 ring-primary"
      )}
    >
      <div className="flex items-center gap-2 border-b px-3 py-2 bg-secondary/60">
        <PipelineIcon className="h-4 w-4" />
        <div className="font-medium text-sm">Source</div>
      </div>
      <div className="p-3 flex items-center gap-3">
        {data.icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.icon}
            alt="source"
            className="h-8 w-8 rounded-sm object-contain"
          />
        ) : (
          <Package className="h-8 w-8 text-muted-foreground" />
        )}
        <div>
          <div className="text-sm font-medium">{data.name}</div>
          <div className="text-xs text-muted-foreground">Connector</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="r" />
    </div>
  );
}

function TransformNode({
  data,
  selected,
}: {
  data: { name: string; sub?: string };
  selected: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-md border bg-card shadow-sm w-[260px]",
        selected && "ring-2 ring-primary"
      )}
    >
      <div className="flex items-center gap-2 border-b px-3 py-2 bg-secondary/60">
        <Boxes className="h-4 w-4" />
        <div className="font-medium text-sm">Transformation</div>
      </div>
      <div className="p-3">
        <div className="text-sm font-medium flex items-center gap-2">
          <span>{data.name}</span>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        {data.sub ? (
          <div className="text-xs text-muted-foreground mt-1">{data.sub}</div>
        ) : null}
      </div>
      <Handle type="target" position={Position.Left} id="l" />
      <Handle type="source" position={Position.Right} id="r" />
    </div>
  );
}

function SchemaNode({
  data,
  selected,
}: {
  data: { name?: string; icon?: string; tables: LineageTable[] };
  selected: boolean;
}) {
  const preview = (data.tables ?? []).slice(0, 8);
  const remaining = Math.max(0, (data.tables?.length ?? 0) - preview.length);
  return (
    <div
      className={cn(
        "rounded-md border bg-card shadow-sm w-[300px]",
        selected && "ring-2 ring-primary"
      )}
    >
      <div className="flex items-center gap-2 border-b px-3 py-2 bg-secondary/60">
        <Database className="h-4 w-4" />
        <div className="font-medium text-sm">
          {data.name ? `${data.name} Schema` : "Schema"}
        </div>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          {data.icon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.icon}
              alt="destination"
              className="h-6 w-6 rounded-sm object-contain"
            />
          ) : null}
          <Badge variant="secondary" className="text-[10px]">
            {data.tables?.length ?? 0} tables
          </Badge>
        </div>
        <ul className="text-xs space-y-1">
          {preview.map((t, idx) => (
            <li
              key={`${t.label}-${idx}`}
              className="flex items-center justify-between rounded-sm px-2 py-1 hover:bg-muted"
            >
              <span className="truncate">{t.label}</span>
              <span className="text-muted-foreground">
                {t.columns?.length ?? 0}
              </span>
            </li>
          ))}
          {remaining > 0 ? (
            <li className="text-xs text-muted-foreground px-2 py-1">
              and {remaining} more…
            </li>
          ) : null}
        </ul>
      </div>
      <Handle type="target" position={Position.Left} id="l" />
    </div>
  );
}

export default PipelineLineageDiagram;

function MooseNode({
  data,
  selected,
}: {
  data: { kind: string; title: string; subtitle?: string };
  selected: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-md border bg-card shadow-sm w-[280px]",
        selected && "ring-2 ring-primary"
      )}
    >
      <div className="flex items-center gap-2 border-b px-3 py-2 bg-secondary/60">
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {data.kind}
        </span>
      </div>
      <div className="p-3">
        <div className="text-sm font-medium flex items-center gap-2">
          <span className="truncate" title={data.title}>
            {data.title}
          </span>
        </div>
        {data.subtitle ? (
          <div
            className="text-xs text-muted-foreground mt-1 truncate"
            title={data.subtitle}
          >
            {data.subtitle}
          </div>
        ) : null}
      </div>
      <Handle type="target" position={Position.Left} id="l" />
      <Handle type="source" position={Position.Right} id="r" />
    </div>
  );
}
