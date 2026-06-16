import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't need login
  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/supplier") ||
    pathname === "/";

  if (isPublic) return NextResponse.next();

  // Check for Supabase auth token in cookies
  const hasToken =
    request.cookies.getAll().some(c =>
      c.name.includes("supabase") && c.name.includes("auth")
    );

  if (!hasToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
