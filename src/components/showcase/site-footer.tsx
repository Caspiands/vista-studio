"use client";

import { Editable } from "@/components/cms/editable";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-muted-foreground md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-md bg-brand-deep text-xs font-bold text-white">
            <Editable path="meta.docCode" />
          </span>
          <div className="leading-tight">
            <p className="font-medium text-foreground">
              <Editable path="meta.brand" /> · <Editable path="meta.docTitle" />
            </p>
            <p className="text-xs">
              <Editable path="meta.version" /> · <Editable path="meta.edition" /> · <Editable path="meta.fiscalYear" />
            </p>
          </div>
        </div>
        <div className="max-w-xl space-y-2 text-xs leading-relaxed md:text-right">
          <Editable path="footer.disclaimer" as="p" multiline />
          <Editable path="footer.copyright" as="p" className="font-medium text-foreground/70" />
        </div>
      </div>
    </footer>
  );
}
