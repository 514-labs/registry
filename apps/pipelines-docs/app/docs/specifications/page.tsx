import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import APISpecification from "@/content/docs/specifications/api.mdx";
import BlobStorageSpecification from "@/content/docs/specifications/blob.mdx";
import DatabaseSpecification from "@/content/docs/specifications/database.mdx";
import SaaSSpecification from "@/content/docs/specifications/saas.mdx";
import AnalyticalConnectorsSpecification from "@/content/docs/specifications/common.mdx";
// Lineage is a general docs page, not a spec tab
import CopySpecDropdown from "@/components/copy-spec-dropdown";

export default function SpecificationsPage() {
  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto">
      <div className="prose dark:prose-invert prose-neutral">
        <h1 className="text-4xl flex items-center justify-between">
          Specifications <CopySpecDropdown />
        </h1>
        <p>
          We provide extensive specifications for each type of connector which
          you can feed into the LLM of your choice to get a connector built for
          you.
        </p>
      </div>

      <div id="spec-common" className="prose dark:prose-invert prose-neutral">
        <AnalyticalConnectorsSpecification />
      </div>

      <Tabs defaultValue="apis" className="gap-8 mt-4">
        <TabsList>
          <TabsTrigger value="apis">APIs</TabsTrigger>
          <TabsTrigger value="blob-storage">Blob Storage</TabsTrigger>
          <TabsTrigger value="databases">Databases</TabsTrigger>
          <TabsTrigger value="saas">SaaS</TabsTrigger>
          {/* Lineage moved to docs/lineage, not part of specs */}
        </TabsList>

        <TabsContent value="apis" forceMount>
          <div
            id="spec-apis"
            className="prose dark:prose-invert prose-neutral max-w-none"
          >
            <APISpecification />
          </div>
        </TabsContent>

        <TabsContent value="blob-storage" forceMount>
          <div
            id="spec-blob-storage"
            className="prose dark:prose-invert prose-neutral"
          >
            <BlobStorageSpecification />
          </div>
        </TabsContent>

        <TabsContent value="databases" forceMount>
          <div
            id="spec-databases"
            className="prose dark:prose-invert prose-neutral"
          >
            <DatabaseSpecification />
          </div>
        </TabsContent>

        <TabsContent value="saas" forceMount>
          <div id="spec-saas" className="prose dark:prose-invert prose-neutral">
            <SaaSSpecification />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
