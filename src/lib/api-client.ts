import axios, { type AxiosError, type AxiosResponse } from "axios";
import { hasLocale } from "next-intl";
import { AUTH_ENDPOINTS, LOGIN_PATH, NO_REFRESH_ENDPOINTS } from "@/config/auth";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "@/lib/auth-session";
import { isApiEnvelope } from "@/utils/api";
import { getFirstSegment } from "@/utils/path";
import type { IApiEnvelope, IApiError, IRetryableRequestConfig } from "@/types/api";
import type { IAuthTokens } from "@/types/auth";

const UNAUTHORIZED = 401;

const baseOptions = {
  baseURL: siteConfig.apiBaseUrl,
  headers: { "Content-Type": "application/json" },
  timeout: siteConfig.apiTimeoutMs,
};

export const apiClient = axios.create(baseOptions);

// A bare instance so refreshing never re-enters the interceptors below
const refreshClient = axios.create(baseOptions);

const normalizeError = (error: AxiosError<IApiEnvelope<unknown>>): IApiError => {
  const envelope = error.response?.data;

  return {
    status: error.response?.status ?? 0,
    code: envelope?.error?.code ?? "INTERNAL_ERROR",
    message: envelope?.message ?? error.message,
    details: envelope?.error?.details ?? [],
  };
};

const redirectToLogin = (): void => {
  if (typeof window === "undefined") return;

  const segment = getFirstSegment(window.location.pathname);
  const locale = hasLocale(routing.locales, segment) ? segment : routing.defaultLocale;
  const target = `/${locale}${LOGIN_PATH}`;

  // A hard navigation on purpose — an expired session must drop all client state
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  if (window.location.pathname !== target) window.location.href = target;
};

const endSession = (): void => {
  clearSession();
  redirectToLogin();
};

let refreshRequest: Promise<IAuthTokens> | null = null;

const requestNewTokens = async (): Promise<IAuthTokens> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) throw new Error("Missing refresh token");

  const { data } = await refreshClient.post<IApiEnvelope<IAuthTokens>>(
    AUTH_ENDPOINTS.refresh,
    { refreshToken },
  );

  if (!data.data) throw new Error(data.message);

  saveTokens(data.data);
  return data.data;
};

// Concurrent 401s share one refresh call instead of racing each other
const refreshTokens = (): Promise<IAuthTokens> => {
  refreshRequest ??= requestNewTokens().finally(() => {
    refreshRequest = null;
  });

  return refreshRequest;
};

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) config.headers.set("Authorization", `Bearer ${token}`);

  return config;
});

// Callers receive the payload itself, never the { success, message, data, error } envelope
const unwrapEnvelope = (response: AxiosResponse<unknown>): AxiosResponse<unknown> => {
  if (isApiEnvelope(response.data)) response.data = response.data.data;

  return response;
};

apiClient.interceptors.response.use(
  unwrapEnvelope,
  async (error: AxiosError<IApiEnvelope<unknown>>) => {
    const request = error.config as IRetryableRequestConfig | undefined;
    const url = request?.url ?? "";
    const isAuthExchange = NO_REFRESH_ENDPOINTS.some((endpoint) =>
      url.startsWith(endpoint),
    );

    if (error.response?.status === UNAUTHORIZED && !isAuthExchange) {
      if (request && !request.hasRetried && getRefreshToken()) {
        request.hasRetried = true;

        try {
          await refreshTokens();
          return await apiClient.request(request);
        } catch {
          endSession();
        }
      } else {
        endSession();
      }
    }

    return Promise.reject(normalizeError(error));
  },
);
