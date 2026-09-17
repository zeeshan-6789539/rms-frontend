import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import type { IButtonProps, TButtonSize, TButtonVariant } from "@/types/ui";

const variantClasses: Record<TButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-brand hover:bg-primary-hover active:shadow-sm",
  secondary:
    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/90",
  soft: "bg-primary-soft text-primary-soft-foreground hover:bg-primary-soft/70",
  outline:
    "border border-border bg-card text-foreground shadow-sm hover:border-border-strong hover:bg-muted",
  ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  danger: "bg-danger text-danger-foreground shadow-sm hover:bg-danger/90",
};

const sizeClasses: Record<TButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  icon: "h-9 w-9",
};

export const Button = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  className,
  children,
  ...props
}: IButtonProps) => (
  <button
    disabled={disabled || isLoading}
    aria-busy={isLoading || undefined}
    className={cn(
      "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-medium transition-[background-color,border-color,box-shadow,color] duration-150 disabled:pointer-events-none disabled:opacity-50",
      variantClasses[variant],
      sizeClasses[size],
      className,
    )}
    {...props}
  >
    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
    {children}
  </button>
);
