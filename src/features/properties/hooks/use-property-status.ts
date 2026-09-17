"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { propertyKeys } from "@/features/properties/api/property-keys";
import {
  deactivateProperty,
  restoreProperty,
} from "@/features/properties/api/properties.api";
import { leaseKeys } from "@/features/leases/api/lease-keys";
import type { IApiError } from "@/types/api";
import type { IProperty } from "@/types/property";
import type { IStatusChangeArgs } from "@/types/mutation";

export const usePropertyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<IProperty, IApiError, IStatusChangeArgs>({
    mutationFn: ({ id, nextStatus }) =>
      nextStatus ? restoreProperty(id) : deactivateProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.all });
      // Leases are listed with their property's name, so their lists go stale too
      queryClient.invalidateQueries({ queryKey: leaseKeys.all });
    },
  });
};
