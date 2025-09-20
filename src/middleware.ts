import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["en", "no"] as const;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip static assets & API
  if (pathname.startsWith("/_next") || pathname.includes(".") || pathname.startsWith("/api")) {
    return;
  }

  // Already has /{lng}?
  const seg = pathname.split("/")[1];
  if ((LOCALES as readonly string[]).includes(seg as any)) return;

  // Detect from headers; default en
  const header = req.headers.get("accept-language")?.toLowerCase() || "";
  const detected = (LOCALES as readonly string[]).find((l) => header.includes(l)) || "en";

  const url = req.nextUrl.clone();
  url.pathname = `/${detected}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|api).*)"],
};
