import { redirect } from "next/navigation";
import { CmsProvider } from "@/components/cms/cms-provider";
import { Showcase } from "@/components/showcase/showcase";
import { readStoredContent } from "@/lib/content-store";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const stored = await readStoredContent();

  return (
    <CmsProvider initial={stored} role={session.role} username={session.username}>
      <Showcase />
    </CmsProvider>
  );
}
