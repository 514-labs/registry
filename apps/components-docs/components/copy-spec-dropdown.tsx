"use client";

import { useCallback } from "react";
import { Button } from "@ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { Clipboard, ChevronDown } from "lucide-react";

type SpecOption = {
  id: string;
  label: string;
};

const SPEC_OPTIONS: SpecOption[] = [
  { id: "spec-apis", label: "APIs" },
  { id: "spec-blob-storage", label: "Blob Storage" },
  { id: "spec-databases", label: "Databases" },
  { id: "spec-saas", label: "SaaS" },
];

export default function CopySpecDropdown() {
  const copyFromElementId = useCallback(async (elementId: string) => {
    try {
      const commonElement = document.getElementById("spec-common");
      const targetElement = document.getElementById(elementId);
      if (!targetElement) return;

      const { default: TurndownService } = await import("turndown");
      const turndown = new TurndownService();

      const targetHtml = targetElement.innerHTML ?? "";
      if (!targetHtml) return;

      let finalMarkdown = turndown.turndown(targetHtml).trim();

      // Include common spec for all non-common selections
      if (elementId !== "spec-common" && commonElement) {
        const commonHtml = commonElement.innerHTML ?? "";
        if (commonHtml) {
          const commonMarkdown = turndown.turndown(commonHtml).trim();
          finalMarkdown = `${commonMarkdown}\n\n${finalMarkdown}`.trim();
        }
      }

      await navigator.clipboard.writeText(finalMarkdown);
    } catch {
      // no-op fallback; we intentionally avoid alerts/toasts here
    }
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Clipboard className="size-4" />
          Copy Spec
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {SPEC_OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt.id}
            onSelect={() => copyFromElementId(opt.id)}
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
