import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

// Instance NextAuth dédiée à l'Edge : construite uniquement à partir de la
// config légère (sans Mongoose), pour rester compatible avec le runtime du
// middleware. Ne vérifie que la validité de la session (JWT), jamais les
// identifiants eux-mêmes.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  if (req.nextUrl.pathname.startsWith("/admin") && !isLoginPage && !isLoggedIn) {
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
