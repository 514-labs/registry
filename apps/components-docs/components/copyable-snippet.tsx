"use client";

import { useState } from "react";
import { Button } from "@ui/components/button";
import { cn } from "@/lib/utils";

type CopyableSnippetProps = {
  code: string;
  label?: string;
  className?: string;
};

// TODO: Why can't we use the CodeBlock component from @ui/components/shadcn-io/code-block?
export default function CopyableSnippet({ code, label, className }: CopyableSnippetProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // no-op
    }
  };

  return (
    <div className={cn("overflow-hidden rounded-md border", className)}>
      <div className="flex items-center justify-between border-b bg-secondary p-1">
        <div className="px-2 text-xs text-muted-foreground">{label ?? "bash"}</div>
        <Button size="icon" variant="ghost" onClick={copy} className="shrink-0">
          {copied ? "✓" : "⎘"}
        </Button>
      </div>
      <div className="bg-background py-4">
        <pre className="w-full overflow-x-auto px-4 text-sm">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}


