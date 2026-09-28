import { cn } from "@/utils/cn";
import type { IFormFieldProps } from "@/types/ui";

export const FormField = ({ id, label, error, hint, className, children }: IFormFieldProps) => (
  <div className={cn("space-y-1.5", className)}>
    <label htmlFor={id} className="block text-sm font-medium">
      {label}
    </label>
    {children}
    {error ? (
      <p id={`${id}-error`} role="alert" className="text-xs text-danger">
        {error}
      </p>
    ) : null}
    {!error && hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
  </div>
);
