"use client";

import { ArrowUpRight } from "lucide-react";
import { useCms } from "@/components/cms/cms-provider";
import { Editable } from "@/components/cms/editable";
import { AddItemButton, ItemControls, useCycleValue } from "@/components/cms/list-controls";
import { SectionShell } from "@/components/cms/section-shell";
import { MODULE_KEYS, MODULE_LABELS, isModuleKey, type ModuleKey } from "@/lib/modules-shared";
import { cn } from "@/lib/utils";
import { useTabs } from "./tabs-context";

function TabLink({ path }: { path: string }) {
  const { value, cycle, interactive } = useCycleValue<ModuleKey>(path, MODULE_KEYS);
  const { setActive } = useTabs();
  const label = isModuleKey(value) ? MODULE_LABELS[value] : value;

  if (interactive) {
    return (
      <button
        type="button"
        onClick={cycle}
        title="Click to change the tab"
        className="cms-controls inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-100"
      >
        {label}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => isModuleKey(value) && setActive(value)}
      className={cn("group/link inline-flex items-center gap-1 font-semibold text-brand transition-colors hover:text-brand-deep", "link-underline")}
    >
      {label}
      <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
    </button>
  );
}

export function GuideSection() {
  const { content, editing } = useCms();
  const rows = content.guide.rows;

  return (
    <SectionShell sectionKey="guide" tone="muted">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b bg-muted/60">
              <th scope="col" className="w-44 px-5 py-3.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                <Editable path="guide.columns.tab" />
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                <Editable path="guide.columns.covers" />
              </th>
              {editing && <th className="w-24 px-3 py-3.5" aria-label="Row actions" />}
            </tr>
          </thead>
          <tbody>
            {rows.map((_, index) => (
              <tr key={index} className="group border-b last:border-b-0 transition-colors duration-200 hover:bg-brand-soft/70">
                <td className="px-5 py-4 align-top">
                  <TabLink path={`guide.rows.${index}.tab`} />
                </td>
                <td className="px-5 py-4 align-top leading-relaxed text-foreground/85">
                  <Editable path={`guide.rows.${index}.covers`} multiline />
                </td>
                {editing && (
                  <td className="px-3 py-3 align-top">
                    <ItemControls path="guide.rows" index={index} count={rows.length} label="row" />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {editing && (
          <div className="border-t bg-muted/40 p-3">
            <AddItemButton path="guide.rows" template={{ tab: "analysis", covers: "What this tab covers" }} label="Add row" />
          </div>
        )}
      </div>
    </SectionShell>
  );
}
