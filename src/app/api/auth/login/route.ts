import { NextResponse } from "next/server";
import { authenticate, createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

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
    return NextResponse.json({ error: "Those credentials were not recognised." }, { status: 401 });
  }

  const token = await createSessionToken(account.username, account.role);
  const response = NextResponse.json({ username: account.username, role: account.role });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return response;
}
