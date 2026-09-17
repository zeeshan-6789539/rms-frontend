"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { paymentKeys } from "@/features/payments/api/payment-keys";
import { fetchPayments } from "@/features/payments/api/payments.api";
import type { IApiError, IPaginatedResult } from "@/types/api";
import type { IPayment, IPaymentQueryParams } from "@/types/payment";

export const usePayments = (params: IPaymentQueryParams, isEnabled = true) =>
  useQuery<IPaginatedResult<IPayment>, IApiError>({
    queryKey: paymentKeys.list(params),
    queryFn: () => fetchPayments(params),
    enabled: isEnabled,
    // Keeps the current page on screen while the next one loads
    placeholderData: keepPreviousData,
  });
