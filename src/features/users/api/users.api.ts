import { apiClient } from "@/lib/api-client";
import { buildQueryParams } from "@/utils/query-params";
import type { IPaginatedResult } from "@/types/api";
import type {
  ICreateUserPayload,
  IUpdateUserPayload,
  IUser,
  IUserQueryParams,
} from "@/types/user";

const USERS_PATH = "/users";

export const fetchUsers = async (
  params: IUserQueryParams,
): Promise<IPaginatedResult<IUser>> => {
  const { data } = await apiClient.get<IPaginatedResult<IUser>>(USERS_PATH, {
    params: buildQueryParams({ ...params }),
  });

  return data;
};

export const fetchUser = async (id: string): Promise<IUser> => {
  const { data } = await apiClient.get<IUser>(`${USERS_PATH}/${id}`);
  return data;
};

export const createUser = async (payload: ICreateUserPayload): Promise<IUser> => {
  const { data } = await apiClient.post<IUser>(USERS_PATH, payload);
  return data;
};

export const updateUser = async (
  id: string,
  payload: IUpdateUserPayload,
): Promise<IUser> => {
  const { data } = await apiClient.patch<IUser>(`${USERS_PATH}/${id}`, payload);
  return data;
};

// DELETE deactivates — the row is kept for audit purposes
export const deactivateUser = async (id: string): Promise<IUser> => {
  const { data } = await apiClient.delete<IUser>(`${USERS_PATH}/${id}`);
  return data;
};

export const restoreUser = async (id: string): Promise<IUser> => {
  const { data } = await apiClient.patch<IUser>(`${USERS_PATH}/${id}/restore`);
  return data;
};
