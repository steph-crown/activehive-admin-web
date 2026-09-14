import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type MultiSelectOption = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
  disabled,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const toggle = (optionValue: string) => {
    const next = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(next);
  };

  const remove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  const selectedLabels = value
    .map((v) => options.find((o) => o.value === v)?.label)
    .filter(Boolean) as string[];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "border-input bg-background ring-offset-background flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50",
            "focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            className,
          )}
        >
          {selectedLabels.length === 0 ? (
            <span className="text-muted-foreground flex-1 text-left">
              {placeholder}
            </span>
          ) : (
            <div className="flex flex-1 flex-wrap gap-1">
              {selectedLabels.map((label, i) => (
                <Badge
                  key={value[i]}
                  variant="secondary"
                  className="gap-1 pr-1 text-xs font-normal"
                >
                  {label}
                  <button
                    type="button"
                    aria-label={`Remove ${label}`}
                    onClick={(e) => remove(value[i], e)}
                    className="hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <ChevronDown
            className={cn(
              "text-muted-foreground ml-auto size-4 shrink-0 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-1"
        align="start"
        portalled
      >
        {options.length === 0 ? (
          <p className="text-muted-foreground px-2 py-4 text-center text-sm">
            No options available.
          </p>
        ) : (
          <ul className="max-h-56 overflow-y-auto">
            {options.map((option) => {
              const selected = value.includes(option.value);
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => toggle(option.value)}
                    className="hover:bg-accent flex w-full items-center gap-2.5 rounded-sm px-2 py-2 text-sm"
                  >
                    <Checkbox
                      checked={selected}
                      tabIndex={-1}
                      className="pointer-events-none"
                    />
                    <span className="flex-1 text-left">{option.label}</span>
                    {selected && (
                      <Check className="text-primary size-4 shrink-0" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
