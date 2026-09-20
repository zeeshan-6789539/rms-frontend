"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentKeys } from "@/features/payments/api/payment-keys";
import { deactivatePayment, restorePayment } from "@/features/payments/api/payments.api";
import { ledgerKeys } from "@/features/ledger/api/ledger-keys";
import { leaseKeys } from "@/features/leases/api/lease-keys";
import type { IApiError } from "@/types/api";
import type { IStatusChangeArgs } from "@/types/mutation";
import type { IPayment } from "@/types/payment";

export const usePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<IPayment, IApiError, IStatusChangeArgs>({
    mutationFn: ({ id, nextStatus }) =>
      nextStatus ? restorePayment(id) : deactivatePayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      // A payment also appears in the ledger, so its lists go stale too
      queryClient.invalidateQueries({ queryKey: ledgerKeys.all });
      // A payment's status affects the lease's outstanding balance
      queryClient.invalidateQueries({ queryKey: leaseKeys.all });
    },
  });
};
