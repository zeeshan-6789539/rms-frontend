import { cn } from "@/utils/cn";
import type { HTMLAttributes } from "react";

export const Skeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("animate-pulse rounded-lg bg-muted", className)} {...props} />
);
