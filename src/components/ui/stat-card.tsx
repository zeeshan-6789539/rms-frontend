import { Card } from "@/components/ui/card";
import type { IStatCardProps } from "@/types/ui";

export const StatCard = ({ label, value, hint, icon }: IStatCardProps) => (
  <Card className="flex items-start justify-between gap-4 transition-shadow hover:shadow-lg">
    <div className="space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
    {icon ? (
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
        {icon}
      </span>
    ) : null}
  </Card>
);
