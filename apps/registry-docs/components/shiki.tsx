"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  className?: string;
  theme?: string;
}

let highlighterInstance: any = null;

const LIGHT_THEME = "github-light";
const DARK_THEME = "github-dark";

async function getHighlighter() {
  if (!highlighterInstance) {
    const { createHighlighter } = await import("shiki");

    highlighterInstance = await createHighlighter({
      themes: [LIGHT_THEME, DARK_THEME],
      langs: [
        "bash",
        "typescript",
        "javascript",
        "python",
        "json",
        "yaml",
        "rust",
      ],
    });
  }
  return highlighterInstance;
}

export default function ShikiCodeBlock({ code, language, filename, className, theme }: CodeBlockProps) {
  const [highlighted, setHighlighted] = useState<string>("");
  const { theme: currentTheme } = useTheme();

  const shikiTheme = theme || (currentTheme === "light" ? LIGHT_THEME : DARK_THEME);

  useEffect(() => {
    async function highlight() {
      try {
        const highlighter = await getHighlighter();
        const result = highlighter.codeToHtml(code, {
          lang: language,
          theme: shikiTheme,
        });
        setHighlighted(result);
      } catch (error) {
        console.error("Failed to highlight code:", error);
        setHighlighted(`<pre><code>${code}</code></pre>`);
      }
    }

    highlight();
  }, [code, language, shikiTheme]);

  return (
    <div className={cn("bg-background", className)}>
      <div
        className="overflow-x-auto font-mono text-sm py-4 [&_.shiki]:!bg-transparent [&_.shiki]:px-4"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </div>
  );
}


