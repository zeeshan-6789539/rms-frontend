"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/features/users/api/user-keys";
import { deactivateUser, restoreUser } from "@/features/users/api/users.api";
import type { IApiError } from "@/types/api";
import type { IStatusChangeArgs } from "@/types/mutation";
import type { IUser } from "@/types/user";

export const useUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<IUser, IApiError, IStatusChangeArgs>({
    mutationFn: ({ id, nextStatus }) =>
      nextStatus ? restoreUser(id) : deactivateUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });
};
