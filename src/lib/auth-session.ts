import { AUTH_COOKIES, SESSION_MAX_AGE_SECONDS } from "@/config/auth";
import { getCookie, removeCookie, setCookie } from "@/utils/cookie";
import type { IAuthTokens } from "@/types/auth";

export const getAccessToken = (): string | null =>
  getCookie(AUTH_COOKIES.accessToken);

export const getRefreshToken = (): string | null =>
  getCookie(AUTH_COOKIES.refreshToken);

export const hasSession = (): boolean => getAccessToken() !== null;

export const saveTokens = ({ accessToken, refreshToken }: IAuthTokens): void => {
  setCookie(AUTH_COOKIES.accessToken, accessToken, {
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  setCookie(AUTH_COOKIES.refreshToken, refreshToken, {
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
};

export const clearSession = (): void => {
  removeCookie(AUTH_COOKIES.accessToken);
  removeCookie(AUTH_COOKIES.refreshToken);
};
