"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { userKeys } from "@/features/users/api/user-keys";
import { fetchUsers } from "@/features/users/api/users.api";
import type { IApiError, IPaginatedResult } from "@/types/api";
import type { IUser, IUserQueryParams } from "@/types/user";

export const useUsers = (params: IUserQueryParams, isEnabled = true) =>
  useQuery<IPaginatedResult<IUser>, IApiError>({
    queryKey: userKeys.list(params),
    queryFn: () => fetchUsers(params),
    enabled: isEnabled,
    // Keeps the current page on screen while the next one loads
    placeholderData: keepPreviousData,
  });
