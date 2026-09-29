"use client";

import { useCms } from "@/components/cms/cms-provider";
import { Editable } from "@/components/cms/editable";
import { AddItemButton, ItemControls } from "@/components/cms/list-controls";
import { SectionShell } from "@/components/cms/section-shell";

export function MetricsSection() {
  const { content } = useCms();
  const items = content.metrics.items;

  return (
    <SectionShell sectionKey="metrics" tone="dark">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((_, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-light/40 hover:bg-white/[0.09] hover:shadow-2xl hover:shadow-black/30"
          >
            <ItemControls path="metrics.items" index={index} count={items.length} className="absolute top-3 right-3" label="metric" />
            <span className="absolute -right-8 -bottom-8 size-28 rounded-full bg-brand/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
            <Editable
              path={`metrics.items.${index}.value`}
              as="p"
              className="text-4xl font-semibold tracking-tight text-brand-light transition-transform duration-300 group-hover:scale-[1.03] sm:text-5xl"
            />
            <Editable path={`metrics.items.${index}.label`} as="p" className="mt-3 text-base font-medium text-white" />
            <Editable path={`metrics.items.${index}.detail`} as="p" className="mt-1.5 text-sm text-white/60" />
          </div>
        ))}
        <AddItemButton
          path="metrics.items"
          template={{ value: "0%", label: "New metric", detail: "What this measures" }}
          label="Add metric"
          className="self-center justify-self-start"
        />
      </div>
    </SectionShell>
  );
}
