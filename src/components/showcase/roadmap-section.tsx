"use client";

import { CheckCircle2, CircleDashed, Loader, type LucideIcon } from "lucide-react";
import { useCms } from "@/components/cms/cms-provider";
import { Editable } from "@/components/cms/editable";
import { AddItemButton, ItemControls, useCycleValue } from "@/components/cms/list-controls";
import { SectionShell } from "@/components/cms/section-shell";
import { PHASE_STATUSES, type PhaseStatus } from "@/lib/content";
import { cn } from "@/lib/utils";

const STATUS: Record<PhaseStatus, { label: string; icon: LucideIcon; badge: string; dot: string }> = {
  complete: {
    label: "Complete",
    icon: CheckCircle2,
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500 shadow-emerald-500/40",
  },
  "in-progress": {
    label: "In progress",
    icon: Loader,
    badge: "bg-brand-soft text-brand border-brand/30",
    dot: "bg-brand shadow-brand/40 animate-pulse",
  },
  planned: {
    label: "Planned",
    icon: CircleDashed,
    badge: "bg-muted text-muted-foreground border-border",
    dot: "bg-slate-300 shadow-slate-300/40",
  },
};

function StatusBadge({ path }: { path: string }) {
  const { value, cycle, interactive } = useCycleValue<PhaseStatus>(path, PHASE_STATUSES);
  const meta = STATUS[value] ?? STATUS.planned;
  const Icon = meta.icon;
  return (
    <button
      type="button"
      onClick={cycle}
      disabled={!interactive}
      title={interactive ? "Click to change status" : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300",
        meta.badge,
        interactive && "cms-controls cursor-pointer ring-2 ring-amber-300 ring-offset-1 hover:scale-105",
      )}
    >
      <Icon className={cn("size-3.5", value === "in-progress" && "animate-[spin_3s_linear_infinite]")} />
      {meta.label}
    </button>
  );
}

export function RoadmapSection() {
  const { content } = useCms();
  const phases = content.roadmap.phases;

  return (
    <SectionShell sectionKey="roadmap">
      <ol className="relative space-y-8 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-6">
        <span aria-hidden className="absolute top-0 bottom-0 left-[1.1rem] w-px bg-gradient-to-b from-brand via-border to-border lg:hidden" />
        <span aria-hidden className="absolute top-[1.1rem] left-0 right-0 hidden h-px bg-gradient-to-r from-brand via-border to-border lg:block" />

        {phases.map((phase, index) => {
          const meta = STATUS[phase.status] ?? STATUS.planned;
          return (
            <li key={index} className="group relative pl-12 lg:pl-0 lg:pt-12">
              <span
                className={cn(
                  "absolute top-1 left-2.5 z-10 grid size-4 place-items-center rounded-full ring-4 ring-white shadow-lg transition-transform duration-300 group-hover:scale-125 lg:top-2.5 lg:left-0",
                  meta.dot,
                )}
              />
              <article className="hover-lift relative flex h-full flex-col rounded-2xl border bg-card p-6 hover:border-brand/40">
                <ItemControls path="roadmap.phases" index={index} count={phases.length} className="absolute -top-3 right-4" label="phase" />
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <Editable path={`roadmap.phases.${index}.period`} as="p" className="text-xs font-semibold tracking-wider text-brand uppercase" />
                  <StatusBadge path={`roadmap.phases.${index}.status`} />
                </div>
                <Editable path={`roadmap.phases.${index}.title`} as="h3" className="text-lg font-semibold tracking-tight" />
                <Editable path={`roadmap.phases.${index}.description`} as="p" multiline className="mt-2 text-sm leading-relaxed text-muted-foreground" />
                <ul className="mt-5 space-y-2 border-t pt-5">
                  {phase.milestones.map((_, mIndex) => (
                    <li key={mIndex} className="group/item flex items-start gap-2.5 text-sm">
                      <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-brand/60 transition-all duration-300 group-hover/item:scale-150 group-hover/item:bg-brand" />
                      <Editable path={`roadmap.phases.${index}.milestones.${mIndex}`} className="flex-1 text-foreground/85" />
                      <ItemControls path={`roadmap.phases.${index}.milestones`} index={mIndex} count={phase.milestones.length} label="milestone" />
                    </li>
                  ))}
                </ul>
                <AddItemButton path={`roadmap.phases.${index}.milestones`} template="New milestone" label="Add milestone" className="mt-4 self-start" />
              </article>
            </li>
          );
        })}
      </ol>
      <AddItemButton
        path="roadmap.phases"
        template={{ period: "Q5 · Period", title: "New phase", status: "planned", description: "What this phase delivers.", milestones: ["First milestone"] }}
        label="Add phase"
        className="mt-8"
      />
    </SectionShell>
  );
}
