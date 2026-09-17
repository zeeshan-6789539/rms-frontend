import type { TQueryParamValue } from "@/types/query-params";

// Drops empty values so an unset filter never reaches the API as an empty string
export const buildQueryParams = (
  params: Record<string, TQueryParamValue>,
): Record<string, string> => {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== "",
  );

  return Object.fromEntries(entries.map(([key, value]) => [key, String(value)]));
};
