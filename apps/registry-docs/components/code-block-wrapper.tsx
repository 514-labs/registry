"use client";

import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockBody,
  CodeBlockItem,
  CodeBlockContent,
  CodeBlockCopyButton,
} from "@ui/components/shadcn-io/code-block";

interface CodeBlockWrapperProps {
  code: string;
  language: string;
  className?: string;
}

export default function CodeBlockWrapper({
  code,
  language,
  className,
}: CodeBlockWrapperProps) {
  return (
    <CodeBlock
      defaultValue={language}
      data={[{ language, filename: "", code }]}
      className={className}
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
}
