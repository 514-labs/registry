"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";

import { Package } from "lucide-react";
import { Workflow } from "lucide-react";
import ConnectorDiscoverGrid from "./connector-discover-grid";
import PipelineDiscoverGrid from "./pipeline-discover-grid";
import ConnectorFilterBar from "./connector-filter-bar";
import PipelineFilterBar from "./pipeline-filter-bar";
import useConnectorDiscovery from "@/hooks/useConnectorDiscovery";
import usePipelineDiscovery from "@/hooks/usePipelineDiscovery";
import type { DiscoverConnector } from "./connector-discover-grid";
import type { DiscoverPipeline } from "./pipeline-discover-grid";

export function DiscoveryGrid({
  connectors,
  pipelines,
}: {
  connectors: DiscoverConnector[];
  pipelines: DiscoverPipeline[];
}) {
  const connectorState = useConnectorDiscovery(connectors);
  const pipelineState = usePipelineDiscovery(pipelines);
  return (
    <Tabs defaultValue="connectors" className="w-full">
      <div className="flex flex-row justify-between items-center">
        <TabsList>
          <TabsTrigger value="connectors" className="flex gap-2">
            <Package className="h-4 w-4" />
            Connectors ({connectors.length})
          </TabsTrigger>
          <TabsTrigger value="pipelines" className="flex gap-2">
            <Workflow className="h-4 w-4" />
            Pipelines ({pipelines.length})
          </TabsTrigger>
        </TabsList>
        <div>
          <TabsContent value="connectors" className="mt-6">
            <ConnectorFilterBar
              query={connectorState.query}
              setQuery={connectorState.setQuery}
              sourceTypes={connectorState.sourceTypes}
              extractionPatterns={connectorState.extractionPatterns}
              domains={connectorState.domains}
              tags={connectorState.tags}
              selectedSourceTypes={connectorState.selectedSourceTypes}
              setSelectedSourceTypes={connectorState.setSelectedSourceTypes}
              selectedExtractions={connectorState.selectedExtractions}
              setSelectedExtractions={connectorState.setSelectedExtractions}
              selectedDomains={connectorState.selectedDomains}
              setSelectedDomains={connectorState.setSelectedDomains}
              selectedTags={connectorState.selectedTags}
              setSelectedTags={connectorState.setSelectedTags}
            />
          </TabsContent>
          <TabsContent value="pipelines" className="mt-6">
            <PipelineFilterBar
              query={pipelineState.query}
              setQuery={pipelineState.setQuery}
              sourceTypes={pipelineState.sourceTypes}
              extractionPatterns={pipelineState.extractionPatterns}
              domains={pipelineState.domains}
              tags={pipelineState.tags}
              selectedSourceTypes={pipelineState.selectedSourceTypes}
              setSelectedSourceTypes={pipelineState.setSelectedSourceTypes}
              selectedExtractions={pipelineState.selectedExtractions}
              setSelectedExtractions={pipelineState.setSelectedExtractions}
              selectedDomains={pipelineState.selectedDomains}
              setSelectedDomains={pipelineState.setSelectedDomains}
              selectedTags={pipelineState.selectedTags}
              setSelectedTags={pipelineState.setSelectedTags}
            />
          </TabsContent>
        </div>
      </div>
      <TabsContent value="connectors" className="mt-6">
        <ConnectorDiscoverGrid connectors={connectorState.filtered} />
      </TabsContent>
      <TabsContent value="pipelines" className="mt-6">
        <PipelineDiscoverGrid pipelines={pipelineState.filtered} />
      </TabsContent>
    </Tabs>
  );
}

// export function DiscoveryGridDetailed() {
//   return (
//     <div>
//       <h1>Discovery Grid Detailed</h1>
//     </div>
//   );
// }
