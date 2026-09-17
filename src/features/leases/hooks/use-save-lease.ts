"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leaseKeys } from "@/features/leases/api/lease-keys";
import { createLease, updateLease } from "@/features/leases/api/leases.api";
import type { IApiError } from "@/types/api";
import type { ICreateLeasePayload, ILease, IUpdateLeasePayload } from "@/types/lease";

export type TSaveLeaseArgs =
  | { mode: "create"; payload: ICreateLeasePayload }
  | { mode: "update"; id: string; payload: IUpdateLeasePayload };

export const useSaveLease = () => {
  const queryClient = useQueryClient();

  return useMutation<ILease, IApiError, TSaveLeaseArgs>({
    mutationFn: (args) =>
      args.mode === "update" ? updateLease(args.id, args.payload) : createLease(args.payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: leaseKeys.all }),
  });
};
