import type { IEmptyStateProps } from "@/types/ui";

export const EmptyState = ({ title, description, icon, action }: IEmptyStateProps) => (
  <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
    {icon ? (
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
        {icon}
      </span>
    ) : null}
    <div className="space-y-1">
      <p className="font-medium">{title}</p>
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
    {action}
  </div>
);
