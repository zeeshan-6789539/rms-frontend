"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productKeys } from "@/features/products/api/product-keys";
import {
  createProduct,
  updateProduct,
} from "@/features/products/api/products.api";
import type { IApiError } from "@/types/api";
import type { IProduct, ISaveProductArgs } from "@/types/product";

export const useSaveProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<IProduct, IApiError, ISaveProductArgs>({
    mutationFn: ({ id, payload }) =>
      id ? updateProduct(id, payload) : createProduct(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  });
};
