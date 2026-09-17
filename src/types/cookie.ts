export type TCookieSameSite = "lax" | "strict" | "none";

export interface ICookieOptions {
  path?: string;
  maxAge?: number;
  sameSite?: TCookieSameSite;
  secure?: boolean;
}
