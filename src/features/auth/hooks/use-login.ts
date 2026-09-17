"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AFTER_LOGIN_PATH } from "@/config/auth";
import { authKeys } from "@/features/auth/api/auth-keys";
import { login } from "@/features/auth/api/auth.api";
import { useRouter } from "@/i18n/navigation";
import { saveTokens } from "@/lib/auth-session";
import type { IApiError } from "@/types/api";
import type { IAuthSession, ILoginPayload } from "@/types/auth";

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<IAuthSession, IApiError, ILoginPayload>({
    mutationFn: login,
    onSuccess: (session) => {
      saveTokens(session);
      queryClient.setQueryData(authKeys.me(), session.user);
      router.replace(AFTER_LOGIN_PATH);
      router.refresh();
    },
  });
};
