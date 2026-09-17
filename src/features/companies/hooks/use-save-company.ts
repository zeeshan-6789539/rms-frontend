"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companyKeys } from "@/features/companies/api/company-keys";
import { createCompany, updateCompany } from "@/features/companies/api/companies.api";
import type { IApiError } from "@/types/api";
import type { ICompany, ISaveCompanyArgs } from "@/types/company";

export const useSaveCompany = () => {
  const queryClient = useQueryClient();

  return useMutation<ICompany, IApiError, ISaveCompanyArgs>({
    mutationFn: ({ id, payload }) =>
      id ? updateCompany(id, payload) : createCompany(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: companyKeys.all }),
  });
};
