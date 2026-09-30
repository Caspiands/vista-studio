import { NextResponse } from "next/server";
import { authenticate, createPendingToken, PENDING_COOKIE, pendingCookieOptions } from "@/lib/auth";

export async function POST(request: Request) {
  let body: { username?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!username || !password) {
    return NextResponse.json({ error: "Enter both a username and a password." }, { status: 400 });
  }

  const account = authenticate(username, password);
  if (!account) {
    // Small fixed delay blunts brute-force attempts without hurting real users.
    await new Promise((resolve) => setTimeout(resolve, 400));
    const response = NextResponse.json({ error: "Those credentials were not recognised." }, { status: 401 });
    response.cookies.set(PENDING_COOKIE, "", { ...pendingCookieOptions, maxAge: 0 });
    return response;
  }

  const token = await createPendingToken(account.username, account.role);
  const response = NextResponse.json({ otpRequired: true });
  response.cookies.set(PENDING_COOKIE, token, pendingCookieOptions);
  return response;
}
