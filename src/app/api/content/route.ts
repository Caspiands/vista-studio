import { NextResponse } from "next/server";
import { looksLikeContent } from "@/lib/content";
import { readStoredContent, resetStoredContent, writeStoredContent } from "@/lib/content-store";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  return NextResponse.json(await readStoredContent());
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  if (session.role !== "editor") {
    return NextResponse.json({ error: "Your account has view-only access." }, { status: 403 });
  }

  let body: { content?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!looksLikeContent(body.content)) {
    return NextResponse.json({ error: "Content is missing one or more required sections." }, { status: 422 });
  }

  const stored = await writeStoredContent(body.content, session.username);
  return NextResponse.json(stored);
}

export async function DELETE() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  if (session.role !== "editor") {
    return NextResponse.json({ error: "Your account has view-only access." }, { status: 403 });
  }
  const stored = await resetStoredContent(session.username);
  return NextResponse.json(stored);
}
