"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leaseKeys } from "@/features/leases/api/lease-keys";
import { updateLeaseRent } from "@/features/leases/api/leases.api";
import { ledgerKeys } from "@/features/ledger/api/ledger-keys";
import type { IApiError } from "@/types/api";
import type { ILease, IUpdateLeaseRentPayload } from "@/types/lease";

export interface IChangeLeaseRentArgs {
  id: string;
  payload: IUpdateLeaseRentPayload;
}

export const useLeaseRent = () => {
  const queryClient = useQueryClient();

  return useMutation<ILease, IApiError, IChangeLeaseRentArgs>({
    mutationFn: ({ id, payload }) => updateLeaseRent(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaseKeys.all });
      // A rent change posts a zero-amount entry to the lease's ledger
      queryClient.invalidateQueries({ queryKey: ledgerKeys.all });
    },
  });
};
