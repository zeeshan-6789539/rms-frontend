import type { InternalAxiosRequestConfig } from "axios";

export type TApiErrorCode =
  | "VALIDATION_ERROR"
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "PAYLOAD_TOO_LARGE"
  | "RATE_LIMIT_EXCEEDED"
  | "REQUEST_TIMEOUT"
  | "DATABASE_ERROR"
  | "SERVICE_UNAVAILABLE"
  | "INTERNAL_ERROR";

export interface IApiEnvelopeError {
  code: TApiErrorCode;
  details: string[];
}

// The single envelope every backend route returns, success or failure
export interface IApiEnvelope<TData> {
  success: boolean;
  message: string;
  data: TData | null;
  error: IApiEnvelopeError | null;
}

export interface IApiError {
  status: number;
  code: TApiErrorCode;
  message: string;
  details: string[];
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface IPaginatedResult<TItem> {
  items: TItem[];
  meta: IPaginationMeta;
}

export interface IRetryableRequestConfig extends InternalAxiosRequestConfig {
  hasRetried?: boolean;
}
