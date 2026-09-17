export const AUTH_COOKIES = {
  accessToken: "rms_access_token",
  refreshToken: "rms_refresh_token",
} as const;

// Both cookies live as long as the backend refresh token, so an expired access
// token is renewed instead of bouncing the user back to the login page
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export const AUTH_ENDPOINTS = {
  login: "/auth/login",
  logout: "/auth/logout",
  refresh: "/auth/refresh",
  me: "/auth/me",
} as const;

// Endpoints that must never trigger the refresh-and-retry interceptor
export const NO_REFRESH_ENDPOINTS: readonly string[] = [
  AUTH_ENDPOINTS.login,
  AUTH_ENDPOINTS.logout,
  AUTH_ENDPOINTS.refresh,
];

export const LOGIN_PATH = "/login";

export const AFTER_LOGIN_PATH = "/";
