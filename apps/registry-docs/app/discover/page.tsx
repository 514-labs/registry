import {
  buildDiscoverConnectors,
  buildDiscoverPipelines,
} from "@/lib/discover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import { Package, Workflow } from "lucide-react";
import ConnectorDiscoverGrid from "./ConnectorDiscoverGrid";
import PipelineDiscoverGrid from "./PipelineDiscoverGrid";

export default async function DiscoverPage() {
  const [connectors, pipelines] = await Promise.all([
    buildDiscoverConnectors(),
    buildDiscoverPipelines(),
  ]);

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
            Connectors ({connectors.length})
          </TabsTrigger>
          <TabsTrigger value="pipelines" className="flex gap-2">
            <Workflow className="h-4 w-4" />
            Pipelines ({pipelines.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="connectors" className="mt-6">
          <ConnectorDiscoverGrid connectors={connectors} />
        </TabsContent>
        <TabsContent value="pipelines" className="mt-6">
          <PipelineDiscoverGrid pipelines={pipelines} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
