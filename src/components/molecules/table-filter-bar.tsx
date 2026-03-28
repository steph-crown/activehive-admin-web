import type { ReactNode } from "react";
import { IconCalendar, IconFilter, IconSearch } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type TableFilterOption = {
  value: string;
  label: string;
};

type TableFilterBarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  dateValue: string;
  onDateChange: (value: string) => void;
  /** Renders between search and date (status, role, etc.) */
  extraFilters?: ReactNode;
  /** Renders after the date field (e.g. primary actions) */
  trailing?: ReactNode;
  className?: string;
};

export function TableFilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  dateValue,
  onDateChange,
  extraFilters,
  trailing,
  className,
}: Readonly<TableFilterBarProps>) {
  return (
    <div
      className={cn(
        "mb-4 flex flex-wrap items-center gap-2.5",
        className,
      )}
    >
      <div className="relative min-w-[260px] flex-1">
        <IconSearch className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="h-10 border-[#F4F4F4] bg-white pl-9"
        />
      </div>

      {extraFilters}

      <div className="relative">
        <Input
          type="date"
          value={dateValue}
          onChange={(event) => onDateChange(event.target.value)}
          className="h-10 w-[145px] border-[#F4F4F4] bg-white pr-9"
        />
        <IconCalendar className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
      </div>

      {trailing}
    </div>
  );
}

type TableFilterSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: TableFilterOption[];
  className?: string;
  "aria-label"?: string;
};

/** Styled select for use inside `extraFilters` (or standalone). */
export function TableFilterSelect({
  value,
  onValueChange,
  placeholder,
  options,
  className,
  "aria-label": ariaLabel,
}: Readonly<TableFilterSelectProps>) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          "h-10 w-[180px] border-[#F4F4F4] bg-white",
          className,
        )}
        aria-label={ariaLabel}
      >
        <div className="flex min-w-0 items-center gap-2">
          <IconFilter className="size-4 shrink-0" />
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
