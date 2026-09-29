"use client";

import { useCms } from "@/components/cms/cms-provider";
import { Editable } from "@/components/cms/editable";
import { AddItemButton, ItemControls } from "@/components/cms/list-controls";
import { SectionShell } from "@/components/cms/section-shell";

const AVATAR_TONES = [
  "from-brand to-brand-deep",
  "from-gold to-amber-700",
  "from-emerald-400 to-emerald-700",
  "from-violet-400 to-violet-700",
  "from-rose-400 to-rose-700",
  "from-sky-400 to-sky-700",
];

export function TeamSection() {
  const { content } = useCms();
  const members = content.team.members;

  return (
    <SectionShell sectionKey="team" tone="muted">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((_, index) => (
          <article
            key={index}
            className="hover-lift group relative flex items-start gap-4 rounded-2xl border bg-card p-6 hover:border-brand/40"
          >
            <ItemControls path="team.members" index={index} count={members.length} className="absolute -top-3 right-4" label="member" />
            <div
              className={`grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${AVATAR_TONES[index % AVATAR_TONES.length]} text-base font-semibold text-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:rotate-3`}
            >
              <Editable path={`team.members.${index}.initials`} />
            </div>
            <div className="min-w-0 flex-1">
              <Editable path={`team.members.${index}.name`} as="h3" className="text-base font-semibold tracking-tight" />
              <Editable path={`team.members.${index}.role`} as="p" className="text-sm font-medium text-brand" />
              <Editable path={`team.members.${index}.focus`} as="p" multiline className="mt-2 text-sm leading-relaxed text-muted-foreground" />
            </div>
          </article>
        ))}
      </div>
      <AddItemButton
        path="team.members"
        template={{ initials: "NN", name: "New member", role: "Role", focus: "Area of responsibility" }}
        label="Add team member"
        className="mt-6"
      />
    </SectionShell>
  );
}
