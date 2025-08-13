"use client";

import ShikiCodeBlock from "@/components/shiki";
import CopyButton from "@/components/copy-button";

export default function CodeBlock({
  code,
  language,
  languageLabel,
  theme,
  hideHeader = false,
}: {
  code: string;
  language: string;
  languageLabel?: string;
  theme?: string;
  hideHeader?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-md border">
      {!hideHeader && (
        <div className="flex items-center justify-between border-b bg-secondary p-1">
          <div className="px-2 text-xs text-muted-foreground font-mono">{languageLabel || language}</div>
          <CopyButton value={code} variant="ghost" size="icon" showText={false} className="text-muted-foreground" />
        </div>
      )}
      <ShikiCodeBlock code={code} language={language} theme={theme} />
    </div>
  );
}


