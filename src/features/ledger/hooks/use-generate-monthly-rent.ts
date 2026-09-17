"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ledgerKeys } from "@/features/ledger/api/ledger-keys";
import { generateMonthlyRent } from "@/features/ledger/api/ledger.api";
import { leaseKeys } from "@/features/leases/api/lease-keys";
import type { IApiError } from "@/types/api";
import type { IGenerateMonthlyRentResult } from "@/types/ledger";

export const useGenerateMonthlyRent = () => {
  const queryClient = useQueryClient();

  return useMutation<IGenerateMonthlyRentResult, IApiError, void>({
    mutationFn: generateMonthlyRent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ledgerKeys.all });
      queryClient.invalidateQueries({ queryKey: leaseKeys.all });
    },
  });
};
