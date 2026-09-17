"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companyKeys } from "@/features/companies/api/company-keys";
import {
  deactivateCompany,
  restoreCompany,
} from "@/features/companies/api/companies.api";
import { userKeys } from "@/features/users/api/user-keys";
import type { IApiError } from "@/types/api";
import type { ICompany } from "@/types/company";
import type { IStatusChangeArgs } from "@/types/mutation";

export const useCompanyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<ICompany, IApiError, IStatusChangeArgs>({
    mutationFn: ({ id, nextStatus }) =>
      nextStatus ? restoreCompany(id) : deactivateCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
      // A company's users are listed with its name, so their lists go stale too
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};
