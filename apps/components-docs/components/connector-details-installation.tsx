"use client";

import { Card } from "@ui/components/card";
import { Alert, AlertDescription, AlertTitle } from "@ui/components/alert";
import { Hourglass } from "lucide-react";
import CopyableSnippet from "@/components/copyable-snippet";

type ConnectorDetailsInstallationProps = {
  connectorId: string;
  versionId: string;
  authorId: string;
  language: string;
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
}: ConnectorDetailsInstallationProps) {
  const isIncomplete = [connectorId, versionId, authorId, language].some(
    (v) => !v || v.trim() === "",
  );

  const command = `bash -i <(curl https://connectors.514.ai/install.sh) ${connectorId} ${versionId} ${authorId} ${language}`;
  const langLabel = LANGUAGE_LABELS[language.toLowerCase()] ?? language.slice(0, 3).toUpperCase();

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
            Installation command will be available once this connector is published.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <p className="!mt-2 text-sm text-muted-foreground">Run this inside your project source directory</p>
          <Card className="p-4">
            <CopyableSnippet code={command} label={langLabel} />
          </Card>
        </>
      )}
    </div>
  );
}


