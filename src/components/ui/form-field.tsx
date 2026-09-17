import type { IFormFieldProps } from "@/types/ui";

export const FormField = ({ id, label, error, hint, children }: IFormFieldProps) => (
  <div className="space-y-1.5">
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
