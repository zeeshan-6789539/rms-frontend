"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryKeys } from "@/features/categories/api/category-keys";
import { fetchCategoryTree } from "@/features/categories/api/categories.api";
import type { IApiError } from "@/types/api";
import type { ICategoryTree } from "@/types/category";

export const useCategoryTree = () =>
  useQuery<ICategoryTree[], IApiError>({
    queryKey: categoryKeys.tree(),
    queryFn: fetchCategoryTree,
  });
