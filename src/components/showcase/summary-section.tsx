"use client";

import { Lightbulb } from "lucide-react";
import { useCms } from "@/components/cms/cms-provider";
import { Editable } from "@/components/cms/editable";
import { AddItemButton, ItemControls } from "@/components/cms/list-controls";
import { SectionShell } from "@/components/cms/section-shell";

export function SummarySection() {
  const { content } = useCms();
  const paragraphs = content.summary.paragraphs;

  return (
    <SectionShell sectionKey="summary">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          {paragraphs.map((_, index) => (
            <div key={index} className="group relative">
              <ItemControls path="summary.paragraphs" index={index} count={paragraphs.length} className="absolute -top-3 right-0" label="paragraph" />
              <Editable
                path={`summary.paragraphs.${index}`}
                as="p"
                multiline
                className="text-base leading-relaxed text-foreground/85 transition-colors duration-300 group-hover:text-foreground sm:text-lg"
              />
            </div>
          ))}
          <AddItemButton path="summary.paragraphs" template="New paragraph. Click to edit." label="Add paragraph" />
        </div>

        <aside className="hover-lift group relative self-start overflow-hidden rounded-2xl border border-brand/20 bg-brand-soft p-7">
          <span className="absolute -top-10 -right-10 size-32 rounded-full bg-brand/10 transition-transform duration-500 group-hover:scale-150" />
          <div className="relative">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-brand text-white shadow-md shadow-brand/30 transition-transform duration-300 group-hover:rotate-6">
              <Lightbulb className="size-5" />
            </div>
            <Editable path="summary.callout.title" as="h3" className="text-lg font-semibold tracking-tight" />
            <Editable path="summary.callout.body" as="p" multiline className="mt-3 text-sm leading-relaxed text-foreground/75" />
          </div>
        </aside>
      </div>
    </SectionShell>
  );
}
