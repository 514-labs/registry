"use client";

import { Card } from "@ui/components/card";
import { Alert, AlertDescription, AlertTitle } from "@ui/components/alert";
import {
  Snippet,
  SnippetHeader,
  SnippetCopyButton,
  SnippetTabsList,
  SnippetTabsTrigger,
  SnippetTabsContent,
} from "@ui/components/shadcn-io/snippet";
import { Hourglass } from "lucide-react";

type ConnectorDetailsInstallationProps = {
  connectorId: string;
  versionId: string;
  authorId: string;
  language: string;
  implementation: string;
};

const LANGUAGE_LABELS: Record<string, string> = {
  typescript: "TS",
  python: "Py",
};

export default function ConnectorDetailsInstallation({
  connectorId,
  versionId,
  authorId,
  language,
  implementation,
}: ConnectorDetailsInstallationProps) {
  const isIncomplete = [connectorId, versionId, authorId, language, implementation].some(
    (v) => !v || v.trim() === ""
  );

  const command = `bash -i <(curl https://registry.514.ai/install.sh) --type connector ${connectorId} ${versionId} ${authorId} ${language} ${implementation}`;
  const langLabel =
    LANGUAGE_LABELS[language.toLowerCase()] ??
    language.slice(0, 3).toUpperCase();

  return (
    <div className="flex flex-col gap-4">
      <div className="prose dark:prose-invert">
        <h2>Installation</h2>
      </div>
      {isIncomplete ? (
        <Alert>
          <Hourglass className="h-4 w-4" />
          <AlertTitle>Coming soon</AlertTitle>
          <AlertDescription>
            Installation command will be available once this connector is
            published.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <p className="!mt-2 text-sm text-muted-foreground">
            Run this inside your project source directory, then follow the
            instructions from the script
          </p>
          <Card className="p-0 bg-transparent border-none shadow-none">
            <Snippet defaultValue="bash">
              <SnippetHeader>
                <SnippetTabsList>
                  <SnippetTabsTrigger value="bash">bash</SnippetTabsTrigger>
                </SnippetTabsList>
                <SnippetCopyButton aria-label="Copy" value={command} />
              </SnippetHeader>
              <SnippetTabsContent value="bash">{command}</SnippetTabsContent>
            </Snippet>
          </Card>
        </>
      )}
    </div>
  );
}
