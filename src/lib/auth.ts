export type Role = "editor" | "viewer";

export interface Session {
  username: string;
  role: Role;
  exp: number;
}

export const SESSION_COOKIE = "vista_dtr_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

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

/** True when any account still uses a built-in default credential. */
export function usingDefaultCredentials() {
  const accounts = getAccounts();
  return (
    accounts[0].password === DEFAULTS.editorPassword ||
    accounts[1].password === DEFAULTS.viewerPassword ||
    env("CMS_SESSION_SECRET", DEFAULTS.secret) === DEFAULTS.secret
  );
}

export function demoCredentials() {
  const [editor, viewer] = getAccounts();
  return {
    editor: { username: editor.username, password: editor.password },
    viewer: { username: viewer.username, password: viewer.password },
  };
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

export async function createSessionToken(username: string, role: Role) {
  const payload: Session = { username, role, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS };
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(), encoder.encode(body));
  return `${body}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<Session | null> {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  try {
    const valid = await crypto.subtle.verify("HMAC", await hmacKey(), fromBase64Url(signature), encoder.encode(body));
    if (!valid) return null;
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as Session;
    if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) return null;
    if (payload.role !== "editor" && payload.role !== "viewer") return null;
    return payload;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};
