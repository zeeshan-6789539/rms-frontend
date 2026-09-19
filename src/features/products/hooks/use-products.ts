"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { productKeys } from "@/features/products/api/product-keys";
import { fetchProducts } from "@/features/products/api/products.api";
import type { IApiError, IPaginatedResult } from "@/types/api";
import type { IProduct, IProductQueryParams } from "@/types/product";

export const useProducts = (params: IProductQueryParams, isEnabled = true) =>
  useQuery<IPaginatedResult<IProduct>, IApiError>({
    queryKey: productKeys.list(params),
    queryFn: () => fetchProducts(params),
    enabled: isEnabled,
    // Keeps the current page on screen while the next one loads
    placeholderData: keepPreviousData,
  });
