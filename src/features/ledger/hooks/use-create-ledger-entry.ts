"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ledgerKeys } from "@/features/ledger/api/ledger-keys";
import { createLedgerEntry } from "@/features/ledger/api/ledger.api";
import { leaseKeys } from "@/features/leases/api/lease-keys";
import type { IApiError } from "@/types/api";
import type { ICreateLedgerEntryPayload, ILedgerEntry } from "@/types/ledger";

export const useCreateLedgerEntry = () => {
  const queryClient = useQueryClient();

  return useMutation<ILedgerEntry, IApiError, ICreateLedgerEntryPayload>({
    mutationFn: createLedgerEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ledgerKeys.all });
      // A new charge changes the lease's outstanding balance
      queryClient.invalidateQueries({ queryKey: leaseKeys.all });
    },
  });
};
