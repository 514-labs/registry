import type { MDXComponents } from "mdx/types";
import type { ReactElement, ReactNode } from "react";
import {
  Snippet,
  SnippetHeader,
  SnippetCopyButton,
  SnippetTabsList,
  SnippetTabsTrigger,
  SnippetTabsContent,
} from "@ui/components/shadcn-io/snippet";
import CodeBlockWrapper from "@/components/code-block-wrapper";

function Pre(props: any) {
  const child = props?.children as ReactElement | undefined;

  if (!child || typeof child !== "object") {
    return <pre {...props} />;
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

  const isShell = ["bash", "sh", "zsh", "shell"].includes(language);
  const isSingleLine = !code.replace(/\r?\n$/, "").includes("\n");

  if (isShell && isSingleLine) {
    return (
      <Snippet defaultValue={language} className="not-prose">
        <SnippetHeader>
          <SnippetTabsList>
            <SnippetTabsTrigger value={language}>{language}</SnippetTabsTrigger>
          </SnippetTabsList>
          <SnippetCopyButton aria-label="Copy" value={code} />
        </SnippetHeader>
        <SnippetTabsContent value={language}>{code}</SnippetTabsContent>
      </Snippet>
    );
  }

  return (
    <CodeBlockWrapper code={code} language={language} className="not-prose" />
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: Pre,
  };
}
