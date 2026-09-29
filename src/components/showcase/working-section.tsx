"use client";

import { Handshake, ListChecks } from "lucide-react";
import { useCms } from "@/components/cms/cms-provider";
import { Editable } from "@/components/cms/editable";
import { AddItemButton, ItemControls } from "@/components/cms/list-controls";
import { SectionShell } from "@/components/cms/section-shell";

export function WorkingSection() {
  const { content } = useCms();
  const { principles, open } = content.working;

  return (
    <SectionShell sectionKey="working" tone="dark">
      <div className="grid gap-6 lg:grid-cols-2">
        <article className="group rounded-2xl border border-white/10 bg-white/[0.05] p-7 transition-all duration-300 hover:border-brand-light/40 hover:bg-white/[0.08]">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-brand text-white shadow-md shadow-brand/30 transition-transform duration-300 group-hover:rotate-6">
              <Handshake className="size-5" />
            </span>
            <Editable path="working.principlesTitle" as="h3" className="text-lg font-semibold tracking-tight" />
          </div>
          <ul className="space-y-3.5">
            {principles.map((_, index) => (
              <li key={index} className="group/item flex items-start gap-3 text-sm leading-relaxed">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-white/10 text-[11px] font-bold text-brand-light transition-all duration-300 group-hover/item:bg-brand-light group-hover/item:text-brand-deep">
                  {index + 1}
                </span>
                <Editable path={`working.principles.${index}`} multiline className="flex-1 text-white/80 transition-colors group-hover/item:text-white" />
                <ItemControls path="working.principles" index={index} count={principles.length} label="principle" />
              </li>
            ))}
          </ul>
          <AddItemButton path="working.principles" template="New principle." label="Add principle" className="mt-4" />
        </article>

        <article className="group rounded-2xl border border-white/10 bg-white/[0.05] p-7 transition-all duration-300 hover:border-vista-green/40 hover:bg-white/[0.08]">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-vista-green text-brand-deep shadow-md shadow-vista-green/30 transition-transform duration-300 group-hover:rotate-6">
              <ListChecks className="size-5" />
            </span>
            <Editable path="working.openTitle" as="h3" className="text-lg font-semibold tracking-tight" />
          </div>
          <ol className="space-y-3.5">
            {open.map((_, index) => (
              <li key={index} className="group/item flex items-start gap-3 text-sm leading-relaxed">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-white/10 text-[11px] font-bold text-vista-green transition-all duration-300 group-hover/item:bg-vista-green group-hover/item:text-brand-deep">
                  {index + 1}
                </span>
                <Editable path={`working.open.${index}`} multiline className="flex-1 text-white/80 transition-colors group-hover/item:text-white" />
                <ItemControls path="working.open" index={index} count={open.length} label="item" />
              </li>
            ))}
          </ol>
          <AddItemButton path="working.open" template="New item to agree." label="Add item" className="mt-4" />
        </article>
      </div>
    </SectionShell>
  );
}
