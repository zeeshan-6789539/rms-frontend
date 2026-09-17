import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import type { ISelectProps } from "@/types/ui";

export const Select = ({ options, hasError, className, ...props }: ISelectProps) => (
  <div className="relative">
    <select
      aria-invalid={hasError || undefined}
      className={cn(
        "h-11 w-full appearance-none rounded-lg border bg-card px-3 pe-9 text-sm text-foreground shadow-sm outline-none transition-[border-color,box-shadow]",
        "focus:border-ring focus:ring-2 focus:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-60",
        hasError ? "border-danger focus:border-danger focus:ring-danger/25" : "border-input",
        className,
      )}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <ChevronDown
      className="pointer-events-none absolute inset-y-0 end-3 my-auto h-4 w-4 text-muted-foreground"
      aria-hidden
    />
  </div>
);
