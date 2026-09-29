"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, KeyRound, Loader2, LockKeyhole, PencilLine, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Content } from "@/lib/content";
import { cn } from "@/lib/utils";

interface DemoAccounts {
  editor: { username: string; password: string };
  viewer: { username: string; password: string };
}

interface LoginFormProps {
  next: string;
  meta: Content["meta"];
  demo: DemoAccounts | null;
}

export function LoginForm({ next, meta, demo }: LoginFormProps) {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Sign in failed. Please try again.");
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("We could not reach the server. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  function fill(account: { username: string; password: string }) {
    setUsername(account.username);
    setPassword(account.password);
    setError(null);
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <aside className="relative hidden overflow-hidden bg-brand-deep text-white lg:flex lg:flex-col lg:justify-between lg:p-14">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="float-slow absolute -top-24 -right-24 size-[30rem] rounded-full bg-brand/30 blur-3xl" />
          <div className="float-slow absolute -bottom-32 -left-20 size-[26rem] rounded-full bg-vista-green/15 blur-3xl [animation-delay:-5s]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        </div>

        <div className="relative flex items-center gap-4">
          <span className="inline-flex rounded-xl bg-white px-4 py-2.5 shadow-lg shadow-black/20 transition-transform duration-300 hover:scale-[1.03]">
            <BrandLogo height={40} priority />
          </span>
          <div className="border-l border-white/15 pl-4 leading-tight">
            <p className="font-semibold">
              {meta.docCode} {meta.version}
            </p>
            <p className="text-xs text-white/60">{meta.preparedBy}</p>
          </div>
        </div>

        <div className="relative fade-up">
          <p className="eyebrow mb-4 text-brand-light">
            {meta.docCode} {meta.version} · {meta.edition}
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-balance xl:text-5xl">{meta.docTitle}</h1>
          <p className="mt-4 text-lg text-white/70">Prepared by {meta.preparedBy} · {meta.issueDate}</p>
          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 text-sm">
            <div>
              <dt className="text-white/50">Prepared for</dt>
              <dd className="mt-1 font-medium">{meta.preparedFor}</dd>
            </div>
            <div>
              <dt className="text-white/50">Issued</dt>
              <dd className="mt-1 font-medium">{meta.issueDate}</dd>
            </div>
          </dl>
        </div>

        <p className="relative flex items-center gap-2 text-xs text-white/55">
          <ShieldCheck className="size-3.5 text-brand-light" />
          {meta.confidentiality}
        </p>
      </aside>

      <main className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md fade-up">
          <div className="mb-8 flex flex-col gap-3 lg:hidden">
            <BrandLogo height={44} priority />
            <p className="text-xs text-muted-foreground">
              {meta.docCode} {meta.version} · {meta.docTitle} · {meta.issueDate}
            </p>
          </div>

          <div className="mb-8">
            <span className="mb-4 inline-grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand">
              <LockKeyhole className="size-5" />
            </span>
            <h2 className="text-2xl font-semibold tracking-tight">Sign in to continue</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Access to this roadmap is restricted. Editors can update content in place; client accounts have read-only access.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                autoComplete="username"
                autoFocus
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your.username"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="h-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={pending}
              className="btn-shine h-11 w-full rounded-xl bg-brand-deep text-base text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-deep hover:shadow-lg hover:shadow-brand-deep/25"
            >
              {pending ? <Loader2 className="animate-spin" /> : <KeyRound />}
              {pending ? "Signing in…" : "Sign in"}
              {!pending && <ArrowRight className="transition-transform duration-300 group-hover/button:translate-x-1" />}
            </Button>
          </form>

          {demo && (
            <div className="mt-8 rounded-2xl border border-dashed border-amber-300 bg-amber-50/60 p-4">
              <p className="text-xs font-semibold tracking-wide text-amber-900 uppercase">Demo access</p>
              <p className="mt-1 text-xs text-amber-900/80">
                Default credentials are active. Set <code className="rounded bg-amber-100 px-1">CMS_*</code> environment variables before sharing this with a client.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <DemoAccountButton icon={PencilLine} title="Editor" subtitle="Can edit & publish" account={demo.editor} onSelect={fill} />
                <DemoAccountButton icon={Eye} title="Client" subtitle="View only" account={demo.viewer} onSelect={fill} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function DemoAccountButton({
  icon: Icon,
  title,
  subtitle,
  account,
  onSelect,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  account: { username: string; password: string };
  onSelect: (account: { username: string; password: string }) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(account)}
      className={cn(
        "group flex items-start gap-3 rounded-xl border border-amber-200 bg-white p-3 text-left transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md hover:shadow-amber-900/10",
      )}
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800 transition-colors group-hover:bg-amber-500 group-hover:text-white">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs text-muted-foreground">{subtitle}</span>
        <span className="mt-1 block truncate font-mono text-[11px] text-foreground/70">
          {account.username} / {account.password}
        </span>
      </span>
    </button>
  );
}
