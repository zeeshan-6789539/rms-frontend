"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LOGIN_PATH } from "@/config/auth";
import { logout } from "@/features/auth/api/auth.api";
import { useRouter } from "@/i18n/navigation";
import { clearSession, getRefreshToken } from "@/lib/auth-session";
import type { IApiError } from "@/types/api";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<void, IApiError, void>({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();

      if (refreshToken) await logout(refreshToken);
    },
    // The local session goes either way, so a failed revoke never traps the user
    onSettled: () => {
      clearSession();
      queryClient.clear();
      router.replace(LOGIN_PATH);
      router.refresh();
    },
  });
};
