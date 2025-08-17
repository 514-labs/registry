"use client";

import { useState } from "react";
import { Clipboard, Check } from "lucide-react";
import { Button } from "@ui/components/button";
import { cn } from "@/lib/utils";

export interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
  successText?: string;
  successDuration?: number;
  onCopied?: (value: string) => void;
}

export default function CopyButton({
  value,
  variant = "outline",
  size = "default",
  className,
  showText = true,
  successText = "Copied!",
  successDuration = 2000,
  onCopied,
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setHasCopied(true);
      onCopied?.(value);
      setTimeout(() => setHasCopied(false), successDuration);
    } catch (error) {
      console.error("Failed to copy text to clipboard:", error);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={handleCopy}
      {...props}
    >
      {hasCopied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
      {showText && <span className="ml-2">{hasCopied ? successText : "Copy"}</span>}
    </Button>
  );
}


