import { NextResponse, type NextRequest } from "next/server";
import {
  accessCodeMatches,
  createSessionToken,
  PENDING_COOKIE,
  pendingCookieOptions,
  SESSION_COOKIE,
  sessionCookieOptions,
  verifyPendingToken,
} from "@/lib/auth";

function clearPending(response: NextResponse) {
  response.cookies.set(PENDING_COOKIE, "", { ...pendingCookieOptions, maxAge: 0 });
}

export async function POST(request: NextRequest) {
  let body: { code?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const pending = await verifyPendingToken(request.cookies.get(PENDING_COOKIE)?.value);
  if (!pending) {
    return NextResponse.json(
      { error: "Sign in with your username and password before entering an access code." },
      { status: 401 },
    );
  }

  const code = typeof body.code === "string" ? body.code.trim() : "";
  if (!code) {
    return NextResponse.json({ error: "Enter the 6-digit access code." }, { status: 400 });
  }

  if (!accessCodeMatches(code)) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return NextResponse.json({ error: "That access code was not recognised." }, { status: 401 });
  }

  const token = await createSessionToken(pending.username, pending.role);
  const response = NextResponse.json({ username: pending.username, role: pending.role });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  clearPending(response);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  clearPending(response);
  return response;
}
