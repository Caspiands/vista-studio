import { NextResponse } from "next/server";
import { isModuleKey, readModule, renderModule, resetModule, writeModule, type ModuleData } from "@/lib/modules";
import { getSession } from "@/lib/session";

type Params = { params: Promise<{ key: string }> };

const HTML_HEADERS = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Frame-Options": "SAMEORIGIN",
};

/**
 * GET ?format=html  → rendered module page for the iframe (default)
 * GET ?format=json  → template + data for the editor
 */
export async function GET(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const { key } = await params;
  if (!isModuleKey(key)) return NextResponse.json({ error: "Unknown module" }, { status: 404 });

  const doc = await readModule(key);
  const format = new URL(request.url).searchParams.get("format");
  if (format === "json") return NextResponse.json(doc);
  return new NextResponse(renderModule(doc), { headers: HTML_HEADERS });
}

export async function PUT(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  if (session.role !== "editor") return NextResponse.json({ error: "Your account has view-only access." }, { status: 403 });
  const { key } = await params;
  if (!isModuleKey(key)) return NextResponse.json({ error: "Unknown module" }, { status: 404 });

  let body: { template?: unknown; data?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const patch: { template?: string; data?: ModuleData } = {};
  if (typeof body.template === "string") {
    if (body.template.trim().length < 20) return NextResponse.json({ error: "Template is too short to be a page." }, { status: 422 });
    patch.template = body.template;
  }
  if (body.data !== undefined) {
    if (typeof body.data !== "object" || body.data === null || Array.isArray(body.data)) {
      return NextResponse.json({ error: "Data must be an object keyed by constant name." }, { status: 422 });
    }
    patch.data = body.data as ModuleData;
  }
  if (!patch.template && !patch.data) return NextResponse.json({ error: "Nothing to update" }, { status: 400 });

  return NextResponse.json(await writeModule(key, patch, session.username));
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  if (session.role !== "editor") return NextResponse.json({ error: "Your account has view-only access." }, { status: 403 });
  const { key } = await params;
  if (!isModuleKey(key)) return NextResponse.json({ error: "Unknown module" }, { status: 404 });
  return NextResponse.json(await resetModule(key));
}
