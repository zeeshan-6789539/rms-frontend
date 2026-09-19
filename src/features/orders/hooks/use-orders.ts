"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { orderKeys } from "@/features/orders/api/order-keys";
import { fetchOrders } from "@/features/orders/api/orders.api";
import type { IApiError, IPaginatedResult } from "@/types/api";
import type { IOrder, IOrderQueryParams } from "@/types/order";

export const useOrders = (params: IOrderQueryParams, isEnabled = true) =>
  useQuery<IPaginatedResult<IOrder>, IApiError>({
    queryKey: orderKeys.list(params),
    queryFn: () => fetchOrders(params),
    enabled: isEnabled,
    // Keeps the current page on screen while the next one loads
    placeholderData: keepPreviousData,
  });
