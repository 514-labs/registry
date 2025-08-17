"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  Folder,
  FolderOpen,
  File as FileIcon,
} from "lucide-react";

export type ScaffNode = {
  type: "dir" | "file";
  name: string;
  children?: ScaffNode[];
};

function NodeRow({ node, depth }: { node: ScaffNode; depth: number }) {
  const isDir = node.type === "dir";
  const [open, setOpen] = useState(true);

  return (
    <li>
      <div
        className="flex items-center gap-1 cursor-default select-none"
        onClick={() => isDir && setOpen((v) => !v)}
        role={isDir ? "button" : undefined}
        aria-expanded={isDir ? open : undefined}
        tabIndex={isDir ? 0 : -1}
        onKeyDown={(e) => {
          if (!isDir) return;
          if (e.key === "Enter" || e.key === " ") setOpen((v) => !v);
          if (e.key === "ArrowRight") setOpen(true);
          if (e.key === "ArrowLeft") setOpen(false);
        }}
        style={{ paddingLeft: `${depth * 12}px` }}
      >
        {isDir ? (
          <ChevronRight
            className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-90" : "rotate-0"}`}
          />
        ) : (
          <span className="w-3.5" />
        )}
        {isDir ? (
          open ? (
            <FolderOpen className="h-4 w-4 text-amber-500" />
          ) : (
            <Folder className="h-4 w-4 text-amber-500" />
          )
        ) : (
          <FileIcon className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="font-mono text-sm leading-6">{node.name}</span>
      </div>

      {isDir && open && node.children && node.children.length > 0 && (
        <ul className="mt-1">
          {node.children.map((child, idx) => (
            <NodeRow key={idx} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function ScaffoldTreeView({ nodes }: { nodes: ScaffNode[] }) {
  return (
    <ul className="list-none p-0 m-0">
      {nodes.map((n, i) => (
        <NodeRow key={i} node={n} depth={0} />
      ))}
    </ul>
  );
}
