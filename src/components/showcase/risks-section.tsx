"use client";

import { AlertTriangle, ShieldCheck } from "lucide-react";
import { useCms } from "@/components/cms/cms-provider";
import { Editable } from "@/components/cms/editable";
import { AddItemButton, ItemControls, useCycleValue } from "@/components/cms/list-controls";
import { SectionShell } from "@/components/cms/section-shell";
import { RISK_LEVELS, type RiskLevel } from "@/lib/content";
import { cn } from "@/lib/utils";

const LEVEL: Record<RiskLevel, { label: string; badge: string; bar: string }> = {
  high: { label: "High", badge: "bg-rose-50 text-rose-700 border-rose-200", bar: "bg-rose-500" },
  medium: { label: "Medium", badge: "bg-amber-50 text-amber-700 border-amber-200", bar: "bg-amber-500" },
  low: { label: "Low", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", bar: "bg-emerald-500" },
};

function LevelBadge({ path }: { path: string }) {
  const { value, cycle, interactive } = useCycleValue<RiskLevel>(path, RISK_LEVELS);
  const meta = LEVEL[value] ?? LEVEL.medium;
  return (
    <button
      type="button"
      onClick={cycle}
      disabled={!interactive}
      title={interactive ? "Click to change level" : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300",
        meta.badge,
        interactive && "cms-controls cursor-pointer ring-2 ring-amber-300 ring-offset-1 hover:scale-105",
      )}
    >
      <AlertTriangle className="size-3.5" />
      {meta.label}
    </button>
  );
}

export function RisksSection() {
  const { content } = useCms();
  const items = content.risks.items;

  return (
    <SectionShell sectionKey="risks">
      <div className="space-y-4">
        {items.map((item, index) => {
          const meta = LEVEL[item.level] ?? LEVEL.medium;
          return (
            <article
              key={index}
              className="group relative grid gap-5 overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300 hover:border-brand/40 hover:shadow-xl hover:shadow-slate-900/10 md:grid-cols-[1fr_1fr_1.3fr] md:gap-8"
            >
              <span className={cn("absolute inset-y-0 left-0 w-1 transition-all duration-300 group-hover:w-1.5", meta.bar)} />
              <ItemControls path="risks.items" index={index} count={items.length} className="absolute top-4 right-4" label="risk" />
              <div className="pl-3">
                <div className="mb-2 flex items-center gap-3">
                  <LevelBadge path={`risks.items.${index}.level`} />
                </div>
                <Editable path={`risks.items.${index}.risk`} as="h3" multiline className="text-base font-semibold tracking-tight" />
              </div>
              <div>
                <p className="eyebrow mb-2 text-muted-foreground">Impact if unmanaged</p>
                <Editable path={`risks.items.${index}.impact`} as="p" multiline className="text-sm leading-relaxed text-foreground/85" />
              </div>
              <div className="flex gap-3">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand transition-all duration-300 group-hover:bg-brand group-hover:text-white">
                  <ShieldCheck className="size-4" />
                </span>
                <div>
                  <p className="eyebrow mb-2 text-muted-foreground">Mitigation</p>
                  <Editable path={`risks.items.${index}.mitigation`} as="p" multiline className="text-sm leading-relaxed text-foreground/85" />
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <AddItemButton
        path="risks.items"
        template={{ risk: "New risk", level: "medium", impact: "What happens if this is not managed.", mitigation: "How the programme will respond." }}
        label="Add risk"
        className="mt-6"
      />
    </SectionShell>
  );
}
