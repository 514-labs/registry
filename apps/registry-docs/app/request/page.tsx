import { Suspense } from "react";
import { RequestConnectorForm } from "./request-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import { Package, Workflow } from "lucide-react";

export default function RequestPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 xl:px-0 py-6 p-5">
      <h1 className="text-2xl font-semibold mb-2">Request a new addition</h1>
      <p className="text-muted-foreground mb-6">
        Tell us what connectors or pipelines you'd like to see. We'll open an
        issue so others can upvote it.
      </p>
      <Tabs defaultValue="connector" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="connector" className="flex gap-2">
            <Package className="h-4 w-4" />
            Connector
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="flex gap-2">
            <Workflow className="h-4 w-4" />
            Pipeline
          </TabsTrigger>
        </TabsList>
        <TabsContent value="connector" className="mt-6">
          <Suspense fallback={null}>
            <RequestConnectorForm type="connector" />
          </Suspense>
        </TabsContent>
        <TabsContent value="pipeline" className="mt-6">
          <Suspense fallback={null}>
            <RequestConnectorForm type="pipeline" />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
