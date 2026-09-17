import { AUTH_ENDPOINTS } from "@/config/auth";
import { apiClient } from "@/lib/api-client";
import type { IAuthSession, ILoginPayload } from "@/types/auth";
import type { IUser } from "@/types/user";

export const login = async (payload: ILoginPayload): Promise<IAuthSession> => {
  const { data } = await apiClient.post<IAuthSession>(AUTH_ENDPOINTS.login, payload);
  return data;
};

export const logout = async (refreshToken: string): Promise<void> => {
  await apiClient.post(AUTH_ENDPOINTS.logout, { refreshToken });
};

export const fetchCurrentUser = async (): Promise<IUser> => {
  const { data } = await apiClient.get<IUser>(AUTH_ENDPOINTS.me);
  return data;
};
