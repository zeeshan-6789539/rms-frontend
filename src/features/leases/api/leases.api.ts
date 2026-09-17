import { apiClient } from "@/lib/api-client";
import { buildQueryParams } from "@/utils/query-params";
import type { IPaginatedResult } from "@/types/api";
import type {
  ICreateLeasePayload,
  ILease,
  ILeaseQueryParams,
  IUpdateLeasePayload,
  IUpdateLeaseRentPayload,
  IUpdateLeaseStatusPayload,
} from "@/types/lease";

const LEASES_PATH = "/leases";

export const fetchLeases = async (
  params: ILeaseQueryParams,
): Promise<IPaginatedResult<ILease>> => {
  const { data } = await apiClient.get<IPaginatedResult<ILease>>(LEASES_PATH, {
    params: buildQueryParams({ ...params }),
  });

  return data;
};

export const fetchLease = async (id: string): Promise<ILease> => {
  const { data } = await apiClient.get<ILease>(`${LEASES_PATH}/${id}`);
  return data;
};

export const createLease = async (payload: ICreateLeasePayload): Promise<ILease> => {
  const { data } = await apiClient.post<ILease>(LEASES_PATH, payload);
  return data;
};

export const updateLease = async (
  id: string,
  payload: IUpdateLeasePayload,
): Promise<ILease> => {
  const { data } = await apiClient.patch<ILease>(`${LEASES_PATH}/${id}`, payload);
  return data;
};

export const updateLeaseStatus = async (
  id: string,
  payload: IUpdateLeaseStatusPayload,
): Promise<ILease> => {
  const { data } = await apiClient.patch<ILease>(`${LEASES_PATH}/${id}/status`, payload);
  return data;
};

export const updateLeaseRent = async (
  id: string,
  payload: IUpdateLeaseRentPayload,
): Promise<ILease> => {
  const { data } = await apiClient.patch<ILease>(`${LEASES_PATH}/${id}/rent`, payload);
  return data;
};
