import { cn } from "@/utils/cn";
import type { IAlertProps, TAlertVariant } from "@/types/ui";

const variantClasses: Record<TAlertVariant, string> = {
  danger: "bg-danger-soft text-danger-soft-foreground",
  info: "bg-info-soft text-info-soft-foreground",
  success: "bg-success-soft text-success-soft-foreground",
};

export const Alert = ({
  variant = "danger",
  title,
  children,
  className,
}: IAlertProps) => (
  <div
    role="alert"
    className={cn("rounded-lg px-4 py-3 text-sm", variantClasses[variant], className)}
  >
    {title ? <p className="font-medium">{title}</p> : null}
    <div className={cn(title && "mt-0.5 opacity-90")}>{children}</div>
  </div>
);
