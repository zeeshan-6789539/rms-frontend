"use client";

import { useQuery } from "@tanstack/react-query";
import { authKeys } from "@/features/auth/api/auth-keys";
import { fetchCurrentUser } from "@/features/auth/api/auth.api";
import type { IApiError } from "@/types/api";
import type { IUser } from "@/types/user";

export const useCurrentUser = () =>
  useQuery<IUser, IApiError>({
    queryKey: authKeys.me(),
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60_000,
    retry: false,
  });
