"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentKeys } from "@/features/payments/api/payment-keys";
import { createPayment } from "@/features/payments/api/payments.api";
import { leaseKeys } from "@/features/leases/api/lease-keys";
import { ledgerKeys } from "@/features/ledger/api/ledger-keys";
import type { IApiError } from "@/types/api";
import type { ICreatePaymentPayload, IPayment } from "@/types/payment";

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation<IPayment, IApiError, ICreatePaymentPayload>({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      // A payment changes the lease's outstanding balance and its ledger statement
      queryClient.invalidateQueries({ queryKey: leaseKeys.all });
      queryClient.invalidateQueries({ queryKey: ledgerKeys.all });
    },
  });
};
