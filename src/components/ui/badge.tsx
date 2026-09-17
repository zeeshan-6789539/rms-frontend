import { cn } from "@/utils/cn";
import type { IBadgeProps, TBadgeVariant } from "@/types/ui";

const variantClasses: Record<TBadgeVariant, string> = {
  success: "bg-success-soft text-success-soft-foreground",
  danger: "bg-danger-soft text-danger-soft-foreground",
  info: "bg-info-soft text-info-soft-foreground",
  warning: "bg-warning-soft text-warning-soft-foreground",
  muted: "bg-muted text-muted-foreground",
};

export const Badge = ({ variant = "muted", children, className }: IBadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
      variantClasses[variant],
      className,
    )}
  >
    {children}
  </span>
);
