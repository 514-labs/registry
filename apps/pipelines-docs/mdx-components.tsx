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
  const language = (languageMatch && languageMatch[1]) || "text";

  const rawChildren = codeProps.children;
  const code = Array.isArray(rawChildren)
    ? rawChildren.join("")
    : (rawChildren?.toString?.() ?? "");

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

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: Pre,
  };
}
