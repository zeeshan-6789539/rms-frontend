"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import type { ISearchInputProps } from "@/types/ui";

export const SearchInput = ({
  value,
  onChange,
  placeholder,
  label,
  className,
}: ISearchInputProps) => (
  <div className={cn("relative", className)}>
    <Search
      className="pointer-events-none absolute inset-y-0 start-3 my-auto h-4 w-4 text-muted-foreground"
      aria-hidden
    />
    <Input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      aria-label={label}
      className="ps-9 [&::-webkit-search-cancel-button]:hidden"
      trailing={
        value ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange("")}
            aria-label={label}
          >
            <X className="h-4 w-4" aria-hidden />
          </Button>
        ) : undefined
      }
    />
  </div>
);
