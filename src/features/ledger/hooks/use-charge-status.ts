"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deactivateCharge, restoreCharge } from "@/features/ledger/api/ledger.api";
import { ledgerKeys } from "@/features/ledger/api/ledger-keys";
import { leaseKeys } from "@/features/leases/api/lease-keys";
import type { IApiError } from "@/types/api";
import type { IStatusChangeArgs } from "@/types/mutation";
import type { ILedgerEntry } from "@/types/ledger";

export const useChargeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<ILedgerEntry, IApiError, IStatusChangeArgs>({
    mutationFn: ({ id, nextStatus }) =>
      nextStatus ? restoreCharge(id) : deactivateCharge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ledgerKeys.all });
      // A charge's status affects the lease's outstanding balance
      queryClient.invalidateQueries({ queryKey: leaseKeys.all });
    },
  });
};
