import type { IApiEnvelope, IApiError } from "@/types/api";

export const isApiEnvelope = <TData>(
  payload: unknown,
): payload is IApiEnvelope<TData> =>
  typeof payload === "object" &&
  payload !== null &&
  "success" in payload &&
  "data" in payload;

export const isApiError = (error: unknown): error is IApiError =>
  typeof error === "object" &&
  error !== null &&
  "status" in error &&
  "code" in error &&
  "message" in error;

// Prefers the field-level validation details the backend sends over the summary line
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (!isApiError(error)) return fallback;

  return error.details.length > 0 ? error.details.join(" ") : error.message;
};
