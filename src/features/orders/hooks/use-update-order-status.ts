"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderKeys } from "@/features/orders/api/order-keys";
import { updateOrderStatus } from "@/features/orders/api/orders.api";
import type { IApiError } from "@/types/api";
import type { IOrder, IUpdateOrderStatusArgs } from "@/types/order";

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<IOrder, IApiError, IUpdateOrderStatusArgs>({
    mutationFn: ({ id, payload }) => updateOrderStatus(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orderKeys.all }),
  });
};
