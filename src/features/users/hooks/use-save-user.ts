"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/features/users/api/user-keys";
import { createUser, updateUser } from "@/features/users/api/users.api";
import type { IApiError } from "@/types/api";
import type { IUser, TSaveUserArgs } from "@/types/user";

export const useSaveUser = () => {
  const queryClient = useQueryClient();

  return useMutation<IUser, IApiError, TSaveUserArgs>({
    mutationFn: (args) =>
      args.mode === "update"
        ? updateUser(args.id, args.payload)
        : createUser(args.payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });
};
