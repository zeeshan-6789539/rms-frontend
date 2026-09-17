"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { companyKeys } from "@/features/companies/api/company-keys";
import { fetchCompanies } from "@/features/companies/api/companies.api";
import type { IApiError, IPaginatedResult } from "@/types/api";
import type { ICompany, ICompanyQueryParams } from "@/types/company";

export const useCompanies = (params: ICompanyQueryParams, isEnabled = true) =>
  useQuery<IPaginatedResult<ICompany>, IApiError>({
    queryKey: companyKeys.list(params),
    queryFn: () => fetchCompanies(params),
    enabled: isEnabled,
    // Keeps the current page on screen while the next one loads
    placeholderData: keepPreviousData,
  });
