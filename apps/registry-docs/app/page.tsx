import Link from "next/link";
import { Button } from "@ui/components/button";
import { Badge } from "@ui/components/badge";
import { PagefindMeta } from "@/components/pagefind-meta";
import {
  buildDiscoverConnectors,
  buildDiscoverPipelines,
} from "@/lib/discover";
import {
  Wrench,
  BadgeCheck,
  Activity,
  ScrollText,
  Package,
  Workflow,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import ConnectorDiscoverGrid from "@/app/discover/ConnectorDiscoverGrid";
import PipelineDiscoverGrid from "@/app/discover/PipelineDiscoverGrid";

const valueProps = [
  {
    text: "Easy to tweak for your use case",
    icon: <Wrench />,
  },
  {
    text: "Best practices backed in",
    icon: <BadgeCheck />,
  },
  {
    text: "Easy to monitor, debug and scale",
    icon: <Activity />,
  },
  {
    text: "Own it. MIT License Forever",
    icon: <ScrollText />,
  },
];

function Hero() {
  return (
    <div className="grid grid-cols-2 container max-w-6xl mx-auto gap-5 py-16">
      <div className="flex flex-col gap-10">
        <Badge variant="outline">
          This Project is a WIP. Join our{" "}
          <Link
            href="https://join.slack.com/t/moose-community/shared_invite/zt-2fjh5n3wz-cnOmM9Xe9DYAgQrNu8xKxg"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            slack
          </Link>{" "}
          to get involved
        </Badge>
        <h1 className="text-6xl mb-0">
          Data Infrastructure{" "}
          <span className="text-muted-foreground">as copyable code</span>
        </h1>
        <div className="flex flex-row gap-5">
          <Button asChild>
            <Link href="/discover">Discover all</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/docs">Learn More</Link>
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <h2 className="text-lg text-muted-foreground">
          A starter kit for building, testing and sharing analytical connectors
          and pipelines for extracting data and metadata from any analytical
          data system. Heavily inspired by Shadcn/ui.
        </h2>
        <div className="flex flex-col gap-5 text-lg">
          {valueProps.map((prop) => (
            <div key={prop.text} className="flex flex-row gap-5 items-center">
              {prop.icon}
              {prop.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  const [connectors, pipelines] = await Promise.all([
    buildDiscoverConnectors(),
    buildDiscoverPipelines(),
  ]);

  return (
    <div className="font-sans items-center justify-items-center min-h-screen space-y-4">
      <PagefindMeta type="docs" />
      <main className="flex flex-col items-center sm:items-start">
        <Hero />
        <div className="mx-auto w-full max-w-6xl px-4 xl:px-0 py-6">
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
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Connectors</h2>
                  <p className="text-muted-foreground">
                    Extract data and metadata from any analytical data system
                  </p>
                </div>
                <ConnectorDiscoverGrid connectors={connectors} />
              </div>
            </TabsContent>
            <TabsContent value="pipelines" className="mt-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Pipelines</h2>
                  <p className="text-muted-foreground">
                    End-to-end data pipelines from source to destination
                  </p>
                </div>
                <PipelineDiscoverGrid pipelines={pipelines} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="flex flex-wrap items-center justify-center py-20">
        <span>
          Inspired by
          <Link
            className="pl-1 underline"
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            shadcn/ui
          </Link>
        </span>
        <span>
          , Created with ❤️ by the folks at
          <Link
            className="pl-1 underline"
            href="https://www.fiveonefour.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            514 Labs
          </Link>
        </span>
      </footer>
    </div>
  );
}
