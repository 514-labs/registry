"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/components/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui/components/command";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/avatar";

export type ComboBoxItem = {
  value: string;
  label?: string;
  href: string;
  avatarUrl?: string | null;
  icon?: React.ReactNode;
};

export function ComboBox({
  items,
  value,
  placeholder,
  withAvatars = false,
  buttonClassName,
  size = "default",
  withIcons = false,
  disabled = false,
}: {
  items: ComboBoxItem[];
  value: string;
  placeholder?: string;
  withAvatars?: boolean;
  buttonClassName?: string;
  size?: "sm" | "default" | "lg";
  withIcons?: boolean;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const selected = items.find((i) => i.value === value) ?? items[0];
  const selectedLabel =
    selected?.label ?? selected?.value ?? placeholder ?? "Select";

  const iconSizeClass =
    size === "lg" ? "size-5" : size === "sm" ? "size-3.5" : "size-4";
  const renderIcon = (node?: React.ReactNode) => {
    if (!node) return null;
    if (React.isValidElement<{ className?: string }>(node)) {
      const prev = node.props.className ?? "";
      return React.cloneElement(node, {
        className: `${prev} ${iconSizeClass}`.trim(),
      });
    }
    return <span className={iconSizeClass} />;
  };

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = React.useState<number | undefined>(undefined);
  React.useLayoutEffect(() => {
    const measure = () => {
      if (containerRef.current) setWidth(containerRef.current.offsetWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <Popover
      open={disabled ? false : open}
      onOpenChange={(o) => !disabled && setOpen(o)}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          size={size}
          className={buttonClassName ?? "w-full justify-between"}
          disabled={disabled}
        >
          <span className="flex items-center gap-3">
            {withAvatars && selected?.avatarUrl ? (
              <Avatar
                className={
                  size === "lg"
                    ? "size-5"
                    : size === "sm"
                      ? "size-3.5"
                      : "size-4"
                }
              >
                <AvatarImage src={selected.avatarUrl} alt="" />
                <AvatarFallback
                  className={
                    size === "lg"
                      ? "text-[11px]"
                      : size === "sm"
                        ? "text-[9px]"
                        : "text-[10px]"
                  }
                >
                  {selectedLabel.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : withIcons && selected?.icon ? (
              <span className="text-muted-foreground">
                {renderIcon(selected.icon)}
              </span>
            ) : null}
            {selectedLabel}
          </span>
          <ChevronsUpDown
            className={
              "ml-2 shrink-0 opacity-50 " +
              (size === "lg"
                ? "h-4 w-4"
                : size === "sm"
                  ? "h-3.5 w-3.5"
                  : "h-4 w-4")
            }
          />
        </Button>
      </PopoverTrigger>
      <div ref={containerRef} className="w-full" />
      <PopoverContent className="p-0" style={{ width }}>
        <Command>
          {items.length > 5 ? (
            <CommandInput placeholder={placeholder ?? "Search..."} />
          ) : null}
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label ?? item.value}
                  onSelect={() => {
                    setOpen(false);
                    router.push(item.href);
                  }}
                >
                  {withAvatars ? (
                    <Avatar className="size-4 mr-2">
                      {item.avatarUrl ? (
                        <AvatarImage src={item.avatarUrl} alt="" />
                      ) : null}
                      <AvatarFallback className="text-[10px]">
                        {(item.label ?? item.value).slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : withIcons && item.icon ? (
                    <span
                      className={`mr-2 text-muted-foreground ${iconSizeClass}`}
                    >
                      {renderIcon(item.icon)}
                    </span>
                  ) : null}
                  <span>{item.label ?? item.value}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ComboBox;
