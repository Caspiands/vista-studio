"use client";

import { useCms } from "@/components/cms/cms-provider";
import { Editable } from "@/components/cms/editable";
import { AddItemButton, ItemControls } from "@/components/cms/list-controls";
import { SectionShell } from "@/components/cms/section-shell";

const COLUMNS = ["workstream", "deliverable", "owner", "timeline"] as const;

export function ScopeSection() {
  const { content, editing } = useCms();
  const rows = content.scope.rows;

  return (
    <SectionShell sectionKey="scope" tone="muted">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b bg-brand-deep text-white">
                {COLUMNS.map((col) => (
                  <th key={col} scope="col" className="px-5 py-4 text-xs font-semibold tracking-wider uppercase">
                    <Editable path={`scope.columns.${col}`} />
                  </th>
                ))}
                {editing && <th className="w-24 px-3 py-4" aria-label="Row actions" />}
              </tr>
            </thead>
            <tbody>
              {rows.map((_, index) => (
                <tr
                  key={index}
                  className="group border-b last:border-b-0 transition-colors duration-200 hover:bg-brand-soft/70"
                >
                  <td className="px-5 py-4 align-top font-semibold text-foreground">
                    <span className="flex items-center gap-2">
                      <span className="h-5 w-1 rounded-full bg-brand/40 transition-all duration-300 group-hover:bg-brand" />
                      <Editable path={`scope.rows.${index}.workstream`} />
                    </span>
                  </td>
                  <td className="px-5 py-4 align-top text-foreground/85">
                    <Editable path={`scope.rows.${index}.deliverable`} multiline />
                  </td>
                  <td className="px-5 py-4 align-top text-muted-foreground">
                    <Editable path={`scope.rows.${index}.owner`} />
                  </td>
                  <td className="px-5 py-4 align-top">
                    <span className="inline-flex rounded-full border border-brand/20 bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand transition-transform duration-300 group-hover:scale-105">
                      <Editable path={`scope.rows.${index}.timeline`} />
                    </span>
                  </td>
                  {editing && (
                    <td className="px-3 py-3 align-top">
                      <ItemControls path="scope.rows" index={index} count={rows.length} label="row" />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {editing && (
          <div className="border-t bg-muted/40 p-3">
            <AddItemButton
              path="scope.rows"
              template={{ workstream: "New workstream", deliverable: "Key deliverable", owner: "Owner", timeline: "Q1" }}
              label="Add row"
            />
          </div>
        )}
      </div>
    </SectionShell>
  );
}
