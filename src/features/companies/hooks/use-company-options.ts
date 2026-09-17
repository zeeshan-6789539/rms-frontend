"use client";

import { useMemo } from "react";
import { useCompanies } from "@/features/companies/hooks/use-companies";
import { MAX_PAGE_SIZE } from "@/config/pagination";

// One page of companies is enough to label and pick tenants in the users screens
export const useCompanyOptions = (isEnabled = true) => {
  const { data, isPending } = useCompanies(
    { page: 1, limit: MAX_PAGE_SIZE },
    isEnabled,
  );

  return useMemo(() => {
    const companies = data?.items ?? [];

    return {
      options: companies.map((company) => ({
        value: company.id,
        label: company.name,
      })),
      nameById: new Map(companies.map((company) => [company.id, company.name])),
      isPending,
    };
  }, [data, isPending]);
};
