import type { TStatusFilter } from "@/types/query-params";

export const toStatusValue = (filter: TStatusFilter): boolean | undefined => {
  if (filter === "active") return true;
  if (filter === "inactive") return false;

  return undefined;
};
