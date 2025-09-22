"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import { Package, Workflow } from "lucide-react";
import { useEffect, useState } from "react";
import ConnectorDiscoverGrid from "./ConnectorDiscoverGrid";
import PipelineDiscoverGrid from "./PipelineDiscoverGrid";
import type { DiscoverConnector, DiscoverPipeline } from "@/lib/discover";

export default function DiscoverPage() {
  const [connectors, setConnectors] = useState<DiscoverConnector[]>([]);
  const [pipelines, setPipelines] = useState<DiscoverPipeline[]>([]);
  const [loading, setLoading] = useState({ connectors: true, pipelines: true });

  useEffect(() => {
    // Fetch connectors
    fetch('/api/discover/connectors')
      .then(res => res.json())
      .then(data => {
        setConnectors(data);
        setLoading(prev => ({ ...prev, connectors: false }));
      })
      .catch(() => {
        setLoading(prev => ({ ...prev, connectors: false }));
      });

    // Fetch pipelines
    fetch('/api/discover/pipelines')
      .then(res => res.json())
      .then(data => {
        setPipelines(data);
        setLoading(prev => ({ ...prev, pipelines: false }));
      })
      .catch(() => {
        setLoading(prev => ({ ...prev, pipelines: false }));
      });
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 xl:px-0 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Discover</h1>
        <p className="text-muted-foreground mt-1">
          Browse and discover connectors and pipelines for your data
          infrastructure
        </p>
      </div>
      <Tabs defaultValue="connectors" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="connectors" className="flex gap-2">
            <Package className="h-4 w-4" />
            Connectors ({loading.connectors ? "..." : connectors.length})
          </TabsTrigger>
          <TabsTrigger value="pipelines" className="flex gap-2">
            <Workflow className="h-4 w-4" />
            Pipelines ({loading.pipelines ? "..." : pipelines.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="connectors" className="mt-6">
          {loading.connectors ? (
            <div className="flex justify-center py-8">
              <div className="text-muted-foreground">Loading connectors...</div>
            </div>
          ) : (
            <ConnectorDiscoverGrid connectors={connectors} />
          )}
        </TabsContent>
        <TabsContent value="pipelines" className="mt-6">
          {loading.pipelines ? (
            <div className="flex justify-center py-8">
              <div className="text-muted-foreground">Loading pipelines...</div>
            </div>
          ) : (
            <PipelineDiscoverGrid pipelines={pipelines} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
