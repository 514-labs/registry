import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import ApiSpec from "@/content/docs/specifications/api.mdx";
import SaasSpec from "@/content/docs/specifications/saas.mdx";
import DatabaseSpec from "@/content/docs/specifications/database.mdx";
import BlobSpec from "@/content/docs/specifications/blob.mdx";
import CommonSpec from "@/content/docs/specifications/common.mdx";

export default function ConnectorSpecificationsPage() {
  return (
    <div className="prose dark:prose-invert prose-neutral max-w-none">
      <h1>Connector Specifications</h1>
      <p>
        Choose the specification that matches your connector type. Each
        specification provides detailed guidelines and requirements for building
        robust, production-ready connectors.
      </p>

      <Tabs defaultValue="api" className="mt-6">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4 rounded-lg">
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="saas">SaaS</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="blob">Blob Storage</TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="mt-6">
          <ApiSpec />
        </TabsContent>

        <TabsContent value="saas" className="mt-6">
          <SaasSpec />
        </TabsContent>

        <TabsContent value="database" className="mt-6">
          <DatabaseSpec />
        </TabsContent>

        <TabsContent value="blob" className="mt-6">
          <BlobSpec />
        </TabsContent>
      </Tabs>

      <div className="mt-12">
        <h2>Common Requirements</h2>
        <CommonSpec />
      </div>
    </div>
  );
}
