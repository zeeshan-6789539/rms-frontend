"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productKeys } from "@/features/products/api/product-keys";
import {
  deactivateProduct,
  restoreProduct,
} from "@/features/products/api/products.api";
import type { IApiError } from "@/types/api";
import type { IStatusChangeArgs } from "@/types/mutation";
import type { IProduct } from "@/types/product";

export const useProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<IProduct, IApiError, IStatusChangeArgs>({
    mutationFn: ({ id, nextStatus }) =>
      nextStatus ? restoreProduct(id) : deactivateProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  });
};
