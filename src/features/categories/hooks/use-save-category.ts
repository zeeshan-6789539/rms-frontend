"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryKeys } from "@/features/categories/api/category-keys";
import {
  createCategory,
  updateCategory,
} from "@/features/categories/api/categories.api";
import type { IApiError } from "@/types/api";
import type { ICategory, ISaveCategoryArgs } from "@/types/category";

export const useSaveCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<ICategory, IApiError, ISaveCategoryArgs>({
    mutationFn: ({ id, payload }) =>
      id ? updateCategory(id, payload) : createCategory(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
  });
};
