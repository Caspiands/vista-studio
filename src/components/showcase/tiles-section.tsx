"use client";

import { useCms } from "@/components/cms/cms-provider";
import { Editable } from "@/components/cms/editable";
import { AddItemButton, ItemControls } from "@/components/cms/list-controls";
import { SectionShell } from "@/components/cms/section-shell";

export function TilesSection() {
  const { content } = useCms();
  const items = content.tiles.items;

  return (
    <SectionShell sectionKey="tiles" className="!py-14 sm:!py-16">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {items.map((_, index) => (
          <div
            key={index}
            className="hover-lift group relative flex flex-col rounded-2xl border bg-card p-5 hover:border-brand/40"
          >
            <ItemControls path="tiles.items" index={index} count={items.length} className="absolute -top-3 right-3" label="tile" />
            <Editable path={`tiles.items.${index}.label`} as="p" className="eyebrow text-[10.5px] text-muted-foreground" />
            <Editable
              path={`tiles.items.${index}.value`}
              as="p"
              className="mt-2 text-2xl font-semibold tracking-tight tabular-nums text-brand-deep transition-colors duration-300 group-hover:text-brand"
            />
            <Editable path={`tiles.items.${index}.note`} as="p" multiline className="mt-2 text-xs leading-relaxed text-muted-foreground" />
            <span className="absolute inset-x-5 bottom-0 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-brand to-vista-green transition-transform duration-500 group-hover:scale-x-100" />
          </div>
        ))}
        <AddItemButton
          path="tiles.items"
          template={{ label: "New measure", value: "0", note: "Where this number comes from" }}
          label="Add tile"
          className="self-center justify-self-start"
        />
      </div>
    </SectionShell>
  );
}
