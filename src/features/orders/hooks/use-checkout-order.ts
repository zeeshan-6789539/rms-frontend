"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderKeys } from "@/features/orders/api/order-keys";
import { checkoutOrder } from "@/features/orders/api/orders.api";
import { productKeys } from "@/features/products/api/product-keys";
import type { IApiError } from "@/types/api";
import type { ICheckoutPayload, IOrder } from "@/types/order";

export const useCheckoutOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<IOrder, IApiError, ICheckoutPayload>({
    mutationFn: checkoutOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      // Checkout decrements stock, so cached product lists are now stale
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};
