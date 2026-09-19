"use client";

import { useQuery } from "@tanstack/react-query";
import { productKeys } from "@/features/products/api/product-keys";
import { fetchProduct } from "@/features/products/api/products.api";
import type { IApiError } from "@/types/api";
import type { IProduct } from "@/types/product";

export const useProduct = (id: string) =>
  useQuery<IProduct, IApiError>({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProduct(id),
    enabled: Boolean(id),
  });
