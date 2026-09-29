"use client";

import { ArrowRight } from "lucide-react";
import { useCms } from "@/components/cms/cms-provider";
import { Editable } from "@/components/cms/editable";
import { AddItemButton, ItemControls, useCycleValue } from "@/components/cms/list-controls";
import { SectionShell } from "@/components/cms/section-shell";
import { MODULE_KEYS, MODULE_LABELS, isModuleKey, type ModuleKey } from "@/lib/modules-shared";
import { cn } from "@/lib/utils";
import { useTabs } from "./tabs-context";

function TabTarget({ path }: { path: string }) {
  const { value, cycle, interactive } = useCycleValue<ModuleKey>(path, MODULE_KEYS);
  if (!interactive) return null;
  return (
    <button
      type="button"
      onClick={cycle}
      title="Click to change which tab this step opens"
      className="cms-controls inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-900 ring-offset-1 hover:bg-amber-100"
    >
      Opens: {isModuleKey(value) ? MODULE_LABELS[value] : value}
    </button>
  );
}

export function FlowSection() {
  const { content, editing } = useCms();
  const { setActive } = useTabs();
  const steps = content.flow.steps;

  return (
    <SectionShell sectionKey="flow" tone="muted">
      <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, index) => {
          const target = isModuleKey(step.tab) ? step.tab : null;
          const open = () => {
            if (!editing && target) setActive(target);
          };
          return (
            <li key={index} className="group relative flex">
              <ItemControls path="flow.steps" index={index} count={steps.length} className="absolute -top-3 right-4" label="step" />
              <article
                role={!editing && target ? "link" : undefined}
                tabIndex={!editing && target ? 0 : undefined}
                onClick={open}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    open();
                  }
                }}
                className={cn(
                  "hover-lift relative flex w-full flex-col rounded-2xl border bg-card p-6 hover:border-brand/50",
                  !editing && target && "cursor-pointer focus-visible:ring-3 focus-visible:ring-brand/40 focus-visible:outline-none",
                )}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="grid size-8 place-items-center rounded-full bg-brand-deep text-sm font-bold text-white transition-all duration-300 group-hover:bg-brand group-hover:shadow-md group-hover:shadow-brand/30">
                    {index + 1}
                  </span>
                  <TabTarget path={`flow.steps.${index}.tab`} />
                </div>
                <Editable path={`flow.steps.${index}.title`} as="h3" className="text-lg font-semibold tracking-tight" />
                <Editable path={`flow.steps.${index}.stage`} as="p" className="mt-0.5 text-xs font-medium text-brand" />
                <Editable path={`flow.steps.${index}.summary`} as="p" multiline className="mt-3 text-sm leading-relaxed text-muted-foreground" />
                <ul className="mt-4 space-y-1.5 border-t pt-4">
                  {step.bullets.map((_, bIndex) => (
                    <li key={bIndex} className="group/item flex items-start gap-2 text-sm">
                      <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-brand/60 transition-all duration-300 group-hover/item:scale-150 group-hover/item:bg-brand" />
                      <Editable path={`flow.steps.${index}.bullets.${bIndex}`} className="flex-1 text-foreground/85" />
                      <ItemControls path={`flow.steps.${index}.bullets`} index={bIndex} count={step.bullets.length} label="point" />
                    </li>
                  ))}
                </ul>
                <AddItemButton path={`flow.steps.${index}.bullets`} template="New point" label="Add point" className="mt-3 self-start" />
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                  <Editable path="flow.openLabel" />
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </article>
            </li>
          );
        })}
      </ol>
      <AddItemButton
        path="flow.steps"
        template={{ tab: "analysis", title: "New step", stage: "Stage", summary: "What this step covers.", bullets: ["First point"] }}
        label="Add step"
        className="mt-6"
      />
    </SectionShell>
  );
}
