"use client";

import { useQuery } from "@tanstack/react-query";
import { productKeys } from "@/features/products/api/product-keys";
import { fetchProductPriceHistory } from "@/features/products/api/products.api";
import type { IApiError } from "@/types/api";
import type { IProductPriceHistory } from "@/types/product";

export const useProductPriceHistory = (id: string) =>
  useQuery<IProductPriceHistory[], IApiError>({
    queryKey: productKeys.priceHistory(id),
    queryFn: () => fetchProductPriceHistory(id),
    enabled: Boolean(id),
  });
