import type { ILeaseQueryParams } from "@/types/lease";

export const leaseKeys = {
  all: ["leases"] as const,
  lists: () => [...leaseKeys.all, "list"] as const,
  list: (params: ILeaseQueryParams) => [...leaseKeys.lists(), params] as const,
  details: () => [...leaseKeys.all, "detail"] as const,
  detail: (id: string) => [...leaseKeys.details(), id] as const,
};
