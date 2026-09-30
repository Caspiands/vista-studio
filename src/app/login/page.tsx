import { redirect } from "next/navigation";
import { readStoredContent } from "@/lib/content-store";
import { getSession } from "@/lib/session";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getSession();
  if (session) redirect("/");

  const params = await searchParams;
  const nextParam = typeof params.next === "string" && params.next.startsWith("/") ? params.next : "/";
  const { content } = await readStoredContent();

  return <LoginForm next={nextParam} meta={content.meta} />;
}
