"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
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

  return (
    <Card className="w-full overflow-hidden">
      <div className="p-4 font-medium">Pipeline Lineage</div>
      <div className="h-[420px]">
        <ReactFlow
          nodes={(layoutNodes.length ? layoutNodes : rawNodes) as Node[]}
          edges={rawEdges}
          nodeTypes={nodeTypes as any}
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
            {mooseGraph && mooseGraph.nodes.length > 0
              ? "Moose Lineage Graph"
              : "Source → Transformations → Schema"}
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
