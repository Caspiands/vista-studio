import { NextResponse } from "next/server";
import { PENDING_COOKIE, SESSION_COOKIE } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  response.cookies.set(PENDING_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
