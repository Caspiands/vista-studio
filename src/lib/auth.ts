export type Role = "editor" | "viewer";

export interface Session {
  username: string;
  role: Role;
  exp: number;
}

export const SESSION_COOKIE = "vista_dtr_session";
export const PENDING_COOKIE = "vista_dtr_pending";
const SESSION_TTL_SECONDS = 60 * 60 * 12;
const PENDING_TTL_SECONDS = 60 * 5;

interface Account {
  username: string;
  password: string;
  role: Role;
}

const DEFAULTS = {
  editorUser: "admin",
  editorPassword: "vista-admin-2027",
  viewerUser: "client",
  viewerPassword: "vista-client-2027",
  secret: "change-me-in-production-vista-dtr",
  accessCode: "345126",
};

function env(name: string, fallback: string) {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value : fallback;
}

export function getAccounts(): Account[] {
  return [
    {
      username: env("CMS_EDITOR_USERNAME", DEFAULTS.editorUser),
      password: env("CMS_EDITOR_PASSWORD", DEFAULTS.editorPassword),
      role: "editor",
    },
    {
      username: env("CMS_VIEWER_USERNAME", DEFAULTS.viewerUser),
      password: env("CMS_VIEWER_PASSWORD", DEFAULTS.viewerPassword),
      role: "viewer",
    },
  ];
}

function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function authenticate(username: string, password: string): Account | null {
  const match = getAccounts().find(
    (account) => constantTimeEqual(account.username, username) && constantTimeEqual(account.password, password),
  );
  return match ?? null;
}

/** Fixed showcase access code. Checked only after a password has been accepted. */
export function accessCodeMatches(code: string) {
  return constantTimeEqual(code, DEFAULTS.accessCode);
}

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function hmacKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(env("CMS_SESSION_SECRET", DEFAULTS.secret)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function signToken(payload: object) {
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(), encoder.encode(body));
  return `${body}.${toBase64Url(new Uint8Array(signature))}`;
}

async function readSignedPayload(token: string | undefined | null): Promise<Record<string, unknown> | null> {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  try {
    const valid = await crypto.subtle.verify("HMAC", await hmacKey(), fromBase64Url(signature), encoder.encode(body));
    if (!valid) return null;
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as Record<string, unknown>;
    if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function createSessionToken(username: string, role: Role) {
  const payload: Session = { username, role, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS };
  return signToken(payload);
}

export async function verifySessionToken(token: string | undefined | null): Promise<Session | null> {
  const payload = await readSignedPayload(token);
  if (!payload) return null;
  // Pending OTP tokens share the signing key but must never open the app.
  if (payload.purpose !== undefined) return null;
  if (payload.role !== "editor" && payload.role !== "viewer") return null;
  if (typeof payload.username !== "string" || payload.username.length === 0) return null;
  return { username: payload.username, role: payload.role, exp: payload.exp as number };
}

interface PendingAuth {
  username: string;
  role: Role;
  exp: number;
  purpose: "otp";
}

export async function createPendingToken(username: string, role: Role) {
  const payload: PendingAuth = {
    username,
    role,
    exp: Math.floor(Date.now() / 1000) + PENDING_TTL_SECONDS,
    purpose: "otp",
  };
  return signToken(payload);
}

export async function verifyPendingToken(
  token: string | undefined | null,
): Promise<Pick<PendingAuth, "username" | "role"> | null> {
  const payload = await readSignedPayload(token);
  if (!payload) return null;
  if (payload.purpose !== "otp") return null;
  if (payload.role !== "editor" && payload.role !== "viewer") return null;
  if (typeof payload.username !== "string" || payload.username.length === 0) return null;
  return { username: payload.username, role: payload.role };
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};

export const pendingCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: PENDING_TTL_SECONDS,
};
