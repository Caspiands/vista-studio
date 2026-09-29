"use client";

import { BarChart3, Check, Cloud, Database, Rocket, ShieldCheck, Sparkles, Users, Workflow, type LucideIcon } from "lucide-react";
import { useCms } from "@/components/cms/cms-provider";
import { Editable } from "@/components/cms/editable";
import { AddItemButton, ItemControls, useCycleValue } from "@/components/cms/list-controls";
import { SectionShell } from "@/components/cms/section-shell";
import { PILLAR_ICONS, type PillarIcon } from "@/lib/content";
import { cn } from "@/lib/utils";

const ICONS: Record<PillarIcon, LucideIcon> = {
  cloud: Cloud,
  shield: ShieldCheck,
  sparkles: Sparkles,
  database: Database,
  users: Users,
  workflow: Workflow,
  chart: BarChart3,
  rocket: Rocket,
};

function PillarIconButton({ path }: { path: string }) {
  const { value, cycle, interactive } = useCycleValue<PillarIcon>(path, PILLAR_ICONS);
  const Icon = ICONS[value] ?? Sparkles;
  return (
    <button
      type="button"
      onClick={cycle}
      disabled={!interactive}
      title={interactive ? "Click to change icon" : undefined}
      className={cn(
        "grid size-12 place-items-center rounded-xl bg-brand-deep text-white shadow-md shadow-brand-deep/20 transition-all duration-300 group-hover:rotate-[-6deg] group-hover:bg-brand group-hover:shadow-brand/30",
        interactive && "cms-controls cursor-pointer ring-2 ring-amber-300 ring-offset-2 hover:scale-105",
      )}
    >
      <Icon className="size-5" />
    </button>
  );
}

export function PillarsSection() {
  const { content } = useCms();
  const items = content.pillars.items;

  return (
    <SectionShell sectionKey="pillars" tone="muted">
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((pillar, index) => (
          <article
            key={index}
            className="hover-lift group relative flex flex-col rounded-2xl border bg-card p-8 hover:border-brand/40"
          >
            <ItemControls path="pillars.items" index={index} count={items.length} className="absolute top-4 right-4" label="pillar" />
            <div className="mb-6 flex items-center gap-4">
              <PillarIconButton path={`pillars.items.${index}.icon`} />
              <span className="text-xs font-semibold tracking-widest text-muted-foreground">0{index + 1}</span>
            </div>
            <Editable path={`pillars.items.${index}.title`} as="h3" className="text-xl font-semibold tracking-tight" />
            <Editable path={`pillars.items.${index}.description`} as="p" multiline className="mt-3 text-sm leading-relaxed text-muted-foreground" />
            <ul className="mt-6 space-y-2.5 border-t pt-6">
              {pillar.outcomes.map((_, oIndex) => (
                <li key={oIndex} className="group/item relative flex items-start gap-3 text-sm">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-soft text-brand transition-all duration-300 group-hover/item:bg-brand group-hover/item:text-white">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <Editable path={`pillars.items.${index}.outcomes.${oIndex}`} className="flex-1" />
                  <ItemControls
                    path={`pillars.items.${index}.outcomes`}
                    index={oIndex}
                    count={pillar.outcomes.length}
                    className="shrink-0"
                    label="outcome"
                  />
                </li>
              ))}
            </ul>
            <AddItemButton path={`pillars.items.${index}.outcomes`} template="New outcome" label="Add outcome" className="mt-4 self-start" />
          </article>
        ))}
      </div>
      <AddItemButton
        path="pillars.items"
        template={{ icon: "sparkles", title: "New pillar", description: "Describe what this pillar covers.", outcomes: ["First outcome"] }}
        label="Add pillar"
        className="mt-6"
      />
    </SectionShell>
  );
}
