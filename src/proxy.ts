import createMiddleware from "next-intl/middleware";
import { hasLocale } from "next-intl";
import { NextResponse, type NextRequest } from "next/server";
import { AFTER_LOGIN_PATH, AUTH_COOKIES, LOGIN_PATH } from "@/config/auth";
import { routing } from "@/i18n/routing";
import { getFirstSegment, joinPath, stripFirstSegment } from "@/utils/path";

// Next 16 proxy convention — handles locale detection, prefixing and the auth guard
const handleLocale = createMiddleware(routing);

const redirectTo = (request: NextRequest, pathname: string): NextResponse => {
  const url = request.nextUrl.clone();
  url.pathname = pathname;

  return NextResponse.redirect(url);
};

const proxy = (request: NextRequest): NextResponse => {
  const { pathname } = request.nextUrl;
  const locale = getFirstSegment(pathname);

  // No locale prefix yet — let next-intl add one and guard the redirected request
  if (!hasLocale(routing.locales, locale)) return handleLocale(request);

  const isLoginRoute = stripFirstSegment(pathname) === LOGIN_PATH;
  const isSignedIn = request.cookies.has(AUTH_COOKIES.accessToken);

  if (!isSignedIn && !isLoginRoute) {
    return redirectTo(request, joinPath(locale, LOGIN_PATH));
  }

  if (isSignedIn && isLoginRoute) {
    return redirectTo(request, joinPath(locale, AFTER_LOGIN_PATH));
  }

  return handleLocale(request);
};

export default proxy;

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
