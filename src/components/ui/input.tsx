import { cn } from "@/utils/cn";
import type { IInputProps } from "@/types/ui";

export const Input = ({ hasError, trailing, className, ...props }: IInputProps) => (
  <div className="relative">
    <input
      aria-invalid={hasError || undefined}
      className={cn(
        "h-11 w-full rounded-lg border bg-card px-3 text-sm text-foreground shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground",
        "focus:border-ring focus:ring-2 focus:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-60",
        hasError ? "border-danger focus:border-danger focus:ring-danger/25" : "border-input",
        trailing && "pe-11",
        className,
      )}
      {...props}
    />
    {trailing ? (
      <span className="absolute inset-y-0 end-0 flex items-center pe-1.5">{trailing}</span>
    ) : null}
  </div>
);
