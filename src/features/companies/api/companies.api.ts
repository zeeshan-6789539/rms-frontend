import { apiClient } from "@/lib/api-client";
import { buildQueryParams } from "@/utils/query-params";
import type { IPaginatedResult } from "@/types/api";
import type {
  ICompany,
  ICompanyPayload,
  ICompanyQueryParams,
} from "@/types/company";

const COMPANIES_PATH = "/companies";

export const fetchCompanies = async (
  params: ICompanyQueryParams,
): Promise<IPaginatedResult<ICompany>> => {
  const { data } = await apiClient.get<IPaginatedResult<ICompany>>(COMPANIES_PATH, {
    params: buildQueryParams({ ...params }),
  });

  return data;
};

export const fetchCompany = async (id: string): Promise<ICompany> => {
  const { data } = await apiClient.get<ICompany>(`${COMPANIES_PATH}/${id}`);
  return data;
};

export const createCompany = async (payload: ICompanyPayload): Promise<ICompany> => {
  const { data } = await apiClient.post<ICompany>(COMPANIES_PATH, payload);
  return data;
};

export const updateCompany = async (
  id: string,
  payload: ICompanyPayload,
): Promise<ICompany> => {
  const { data } = await apiClient.patch<ICompany>(`${COMPANIES_PATH}/${id}`, payload);
  return data;
};

// DELETE deactivates — the row is kept so it can be restored
export const deactivateCompany = async (id: string): Promise<ICompany> => {
  const { data } = await apiClient.delete<ICompany>(`${COMPANIES_PATH}/${id}`);
  return data;
};

export const restoreCompany = async (id: string): Promise<ICompany> => {
  const { data } = await apiClient.patch<ICompany>(`${COMPANIES_PATH}/${id}/restore`);
  return data;
};
