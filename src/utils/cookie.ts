import type { ICookieOptions } from "@/types/cookie";

export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const entry = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : null;
};

export const setCookie = (
  name: string,
  value: string,
  options: ICookieOptions = {},
): void => {
  if (typeof document === "undefined") return;

  const isSecure = options.secure ?? window.location.protocol === "https:";

  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    `path=${options.path ?? "/"}`,
    `samesite=${options.sameSite ?? "lax"}`,
  ];

  if (options.maxAge !== undefined) parts.push(`max-age=${options.maxAge}`);
  if (isSecure) parts.push("secure");

  document.cookie = parts.join("; ");
};

export const removeCookie = (name: string, options: ICookieOptions = {}): void =>
  setCookie(name, "", { ...options, maxAge: 0 });
