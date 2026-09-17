"use client";

import { useMemo } from "react";
import { useProperties } from "@/features/properties/hooks/use-properties";
import { MAX_PAGE_SIZE } from "@/config/pagination";

// One page of properties is enough to label and pick a property in the lease form
export const usePropertyOptions = (isEnabled = true) => {
  const { data, isPending } = useProperties(
    { page: 1, limit: MAX_PAGE_SIZE, status: true },
    isEnabled,
  );

  return useMemo(() => {
    const properties = data?.items ?? [];

    return {
      options: properties.map((property) => ({
        value: property.id,
        label: property.name,
      })),
      nameById: new Map(properties.map((property) => [property.id, property.name])),
      isPending,
    };
  }, [data, isPending]);
};
