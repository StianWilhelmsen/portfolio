import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["en", "no"] as const;
type Locale = typeof LOCALES[number];

function hasLocale(x: string): x is Locale {
  return (LOCALES as readonly string[]).includes(x);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/_next") || pathname.includes(".") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const seg = pathname.split("/")[1]!;
  if (hasLocale(seg)) {
    return NextResponse.next();
  }

  const header = req.headers.get("accept-language")?.toLowerCase() ?? "";
  const detected: Locale = (LOCALES as readonly string[]).find((l) => header.includes(l)) as Locale ?? "en";

  const url = req.nextUrl.clone();
  url.pathname = `/${detected}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|api).*)"],
};
