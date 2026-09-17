"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leaseKeys } from "@/features/leases/api/lease-keys";
import { updateLeaseStatus } from "@/features/leases/api/leases.api";
import type { IApiError } from "@/types/api";
import type { ILease, TLeaseStatus } from "@/types/lease";

export interface IChangeLeaseStatusArgs {
  id: string;
  status: TLeaseStatus;
}

export const useLeaseStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<ILease, IApiError, IChangeLeaseStatusArgs>({
    mutationFn: ({ id, status }) => updateLeaseStatus(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: leaseKeys.all }),
  });
};
