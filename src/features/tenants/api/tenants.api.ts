import { apiClient } from "@/lib/api-client";
import { buildQueryParams } from "@/utils/query-params";
import type { IPaginatedResult } from "@/types/api";
import type {
  ITenant,
  ITenantListItem,
  ITenantPayload,
  ITenantQueryParams,
} from "@/types/tenant";

const TENANTS_PATH = "/tenants";

export const fetchTenants = async (
  params: ITenantQueryParams,
): Promise<IPaginatedResult<ITenantListItem>> => {
  const { data } = await apiClient.get<IPaginatedResult<ITenantListItem>>(TENANTS_PATH, {
    params: buildQueryParams({ ...params }),
  });

  return data;
};

export const fetchTenant = async (id: string): Promise<ITenant> => {
  const { data } = await apiClient.get<ITenant>(`${TENANTS_PATH}/${id}`);
  return data;
};

export const createTenant = async (payload: ITenantPayload): Promise<ITenant> => {
  const { data } = await apiClient.post<ITenant>(TENANTS_PATH, payload);
  return data;
};

export const updateTenant = async (
  id: string,
  payload: ITenantPayload,
): Promise<ITenant> => {
  const { data } = await apiClient.patch<ITenant>(`${TENANTS_PATH}/${id}`, payload);
  return data;
};

// DELETE deactivates — the row is kept so it can be restored
export const deactivateTenant = async (id: string): Promise<ITenant> => {
  const { data } = await apiClient.delete<ITenant>(`${TENANTS_PATH}/${id}`);
  return data;
};

export const restoreTenant = async (id: string): Promise<ITenant> => {
  const { data } = await apiClient.patch<ITenant>(`${TENANTS_PATH}/${id}/restore`);
  return data;
};
