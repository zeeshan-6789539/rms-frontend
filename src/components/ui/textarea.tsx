import { cn } from "@/utils/cn";
import type { ITextareaProps } from "@/types/ui";

export const Textarea = ({ hasError, className, ...props }: ITextareaProps) => (
  <textarea
    aria-invalid={hasError || undefined}
    className={cn(
      "min-h-20 w-full rounded-lg border bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground",
      "focus:border-ring focus:ring-2 focus:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-60",
      hasError ? "border-danger focus:border-danger focus:ring-danger/25" : "border-input",
      className,
    )}
    {...props}
  />
);
