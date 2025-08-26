"use client";

import React, { type ReactElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  Snippet,
  SnippetHeader,
  SnippetCopyButton,
  SnippetTabsList,
  SnippetTabsTrigger,
  SnippetTabsContent,
} from "./shadcn-io/snippet";
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockBody,
  CodeBlockItem,
  CodeBlockContent,
  CodeBlockCopyButton,
} from "./shadcn-io/code-block";
import { cn } from "../lib/utils";

export type MarkdownContentProps = {
  content: string;
  className?: string;
};

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div className={cn("prose dark:prose-invert max-w-none", className)}>
      <ReactMarkdown
        // Allow GitHub-flavored markdown and raw HTML blocks
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Render fenced code blocks via the 'pre' element to avoid invalid nesting inside <p>
          pre(preProps: any) {
            const child = preProps?.children as ReactElement | undefined;

            if (!child || typeof child !== "object") {
              return <pre {...preProps} />;
            }

            const codeProps = ((child as ReactElement)?.props ?? {}) as {
              className?: string;
              children?: ReactNode;
            };
            const className: string = codeProps.className ?? "";
            const languageMatch = /(?:^|\s)language-([^\s]+)/.exec(className);
            const language = (
              (languageMatch && languageMatch[1]) ||
              "text"
            ).toLowerCase();

            const rawChildren = codeProps.children;
            const code = Array.isArray(rawChildren)
              ? rawChildren.join("")
              : (rawChildren?.toString?.() ?? "");

            const isShell = ["sh", "bash", "shell", "zsh"].includes(language);

            if (isShell) {
              return (
                <Snippet defaultValue={language} className="not-prose">
                  <SnippetHeader>
                    <SnippetTabsList>
                      <SnippetTabsTrigger value={language}>
                        {language}
                      </SnippetTabsTrigger>
                    </SnippetTabsList>
                    <SnippetCopyButton aria-label="Copy" value={code} />
                  </SnippetHeader>
                  <SnippetTabsContent value={language}>
                    {code}
                  </SnippetTabsContent>
                </Snippet>
              );
            }

            return (
              <CodeBlock
                defaultValue={language}
                data={[{ language, filename: "", code }]}
                className="not-prose"
              >
                <CodeBlockHeader className="flex justify-between">
                  <div className="px-4 py-1.5 text-muted-foreground text-xs">
                    {language}
                  </div>
                  <CodeBlockCopyButton aria-label="Copy" />
                </CodeBlockHeader>
                <CodeBlockBody>
                  {(item) => (
                    <CodeBlockItem key={item.language} value={item.language}>
                      <CodeBlockContent language={item.language}>
                        {item.code}
                      </CodeBlockContent>
                    </CodeBlockItem>
                  )}
                </CodeBlockBody>
              </CodeBlock>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
