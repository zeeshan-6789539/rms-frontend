import { cn } from "@/utils/cn";
import type { ICardProps } from "@/types/ui";

export const Card = ({ className, children, ...props }: ICardProps) => (
  <div
    className={cn(
      "rounded-card border border-border bg-card p-5 text-card-foreground shadow-md",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
