"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryKeys } from "@/features/categories/api/category-keys";
import {
  createSubcategory,
  updateSubcategory,
} from "@/features/categories/api/categories.api";
import type { IApiError } from "@/types/api";
import type { ISaveSubcategoryArgs, ISubcategory } from "@/types/category";

export const useSaveSubcategory = () => {
  const queryClient = useQueryClient();

  return useMutation<ISubcategory, IApiError, ISaveSubcategoryArgs>({
    mutationFn: ({ id, payload }) =>
      id ? updateSubcategory(id, payload) : createSubcategory(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
  });
};
