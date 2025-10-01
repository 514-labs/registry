"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";

import { Package, Workflow, Filter } from "lucide-react";
import { Button } from "@ui/components/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@ui/components/sheet";
import ConnectorDiscoverGrid from "./connector/connector-discover-grid";
import PipelineDiscoverGrid from "./pipeline/pipeline-discover-grid";
import ConnectorFilterBar from "./connector/connector-filter-bar";
import PipelineFilterBar from "./pipeline/pipeline-filter-bar";
import useConnectorDiscovery from "@/hooks/useConnectorDiscovery";
import usePipelineDiscovery from "@/hooks/usePipelineDiscovery";
import type { DiscoverConnector } from "./connector/connector-discover-grid";
import type { DiscoverPipeline } from "./pipeline/pipeline-discover-grid";

export function DiscoveryGrid({
  connectors,
  pipelines,
}: {
  connectors: DiscoverConnector[];
  pipelines: DiscoverPipeline[];
}) {
  const [activeTab, setActiveTab] = useState("connectors");
  const connectorState = useConnectorDiscovery(connectors);
  const pipelineState = usePipelineDiscovery(pipelines);
  return (
    <Tabs defaultValue="connectors" className="w-full" onValueChange={setActiveTab}>
      <div className="w-full overflow-x-auto lg:overflow-visible">
        <TabsList className="w-full lg:w-auto">
          <TabsTrigger value="connectors" className="flex gap-2 lg:flex-initial flex-1">
            <Package className="h-4 w-4" />
            Connectors ({connectors.length})
          </TabsTrigger>
          <TabsTrigger value="pipelines" className="flex gap-2 lg:flex-initial flex-1">
            <Workflow className="h-4 w-4" />
            Pipelines ({pipelines.length})
          </TabsTrigger>
        </TabsList>
      </div>
      
      <Sheet modal={false}>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden mt-4 w-full">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-5 pt-8 fixed top-0 left-0 h-full min-h-screen z-50">
          <SheetHeader className="pb-4 pt-4">
            <SheetTitle>
              Filter
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
            {activeTab === "connectors" ? (
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
            ) : (
              <PipelineFilterBar
                query={pipelineState.query}
                setQuery={pipelineState.setQuery}
                tags={pipelineState.tags}
                selectedTags={pipelineState.selectedTags}
                setSelectedTags={pipelineState.setSelectedTags}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      <TabsContent value="connectors" className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-6">
          <aside className="hidden lg:block sticky top-24 h-fit space-y-4">
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
          </aside>
          <section>
            <ConnectorDiscoverGrid connectors={connectorState.filtered} />
          </section>
        </div>
      </TabsContent>

      <TabsContent value="pipelines" className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-6">
          <aside className="hidden lg:block sticky top-24 h-fit space-y-4">
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
          </aside>
          <section>
            <PipelineDiscoverGrid pipelines={pipelineState.filtered} />
          </section>
        </div>
      </TabsContent>
    </Tabs>
  );
}

export function DiscoveryGridDetailed({
  connectors,
  pipelines,
}: {
  connectors: DiscoverConnector[];
  pipelines: DiscoverPipeline[];
}) {
  const [activeTab, setActiveTab] = useState("connectors");
  const connectorState = useConnectorDiscovery(connectors);
  const pipelineState = usePipelineDiscovery(pipelines);
  return (
    <Tabs defaultValue="connectors" className="w-full" onValueChange={setActiveTab}>
      <div className="w-full overflow-x-auto lg:overflow-visible">
        <TabsList className="w-full lg:w-auto">
          <TabsTrigger value="connectors" className="flex gap-2 lg:flex-initial flex-1">
            <Package className="h-4 w-4" />
            Connectors ({connectors.length})
          </TabsTrigger>
          <TabsTrigger value="pipelines" className="flex gap-2 lg:flex-initial flex-1">
            <Workflow className="h-4 w-4" />
            Pipelines ({pipelines.length})
          </TabsTrigger>
        </TabsList>
      </div>
      
      <Sheet modal={false}>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden mt-4 w-full">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </SheetTrigger>
          <SheetContent side="left" className="w-80 p-5 pt-8 fixed top-0 left-0 h-full min-h-screen z-50">
            <SheetHeader className="pb-4 pt-4">
              <SheetTitle>
                Filter
              </SheetTitle>
            </SheetHeader>
            <div className="mt-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
              {activeTab === "connectors" ? (
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
              ) : (
                <PipelineFilterBar
                  query={pipelineState.query}
                  setQuery={pipelineState.setQuery}
                  tags={pipelineState.tags}
                  selectedTags={pipelineState.selectedTags}
                  setSelectedTags={pipelineState.setSelectedTags}
                />
              )}
            </div>
          </SheetContent>
        </Sheet>

      <TabsContent value="connectors" className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-6">
          <aside className="hidden lg:block sticky top-24 h-fit space-y-4">
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
          </aside>
          <section>
            <ConnectorDiscoverGrid
              connectors={connectorState.filtered}
            />
          </section>
        </div>
      </TabsContent>

      <TabsContent value="pipelines" className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-6">
          <aside className="hidden lg:block sticky top-24 h-fit space-y-4">
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
          </aside>
          <section>
            <PipelineDiscoverGrid
              pipelines={pipelineState.filtered}
            />
          </section>
        </div>
      </TabsContent>
    </Tabs>
  );
}
