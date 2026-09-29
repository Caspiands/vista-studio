"use client";

import { useCms } from "@/components/cms/cms-provider";
import { Editable } from "@/components/cms/editable";
import { AddItemButton, ItemControls } from "@/components/cms/list-controls";
import { SectionShell } from "@/components/cms/section-shell";

const COLUMNS = ["measure", "today", "month6", "month12"] as const;

export function TargetsSection() {
  const { content, editing } = useCms();
  const rows = content.targets.rows;

  return (
    <SectionShell sectionKey="targets">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="bg-brand-deep text-white">
                {COLUMNS.map((col, i) => (
                  <th key={col} scope="col" className={i === 0 ? "w-[34%] px-5 py-4 text-xs font-semibold tracking-wider uppercase" : "px-5 py-4 text-xs font-semibold tracking-wider uppercase"}>
                    <Editable path={`targets.columns.${col}`} />
                  </th>
                ))}
                {editing && <th className="w-24 px-3 py-4" aria-label="Row actions" />}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) =>
                row.kind === "group" ? (
                  <tr key={index} className="group border-y bg-muted/70">
                    <td colSpan={4} className="px-5 py-2.5">
                      <Editable path={`targets.rows.${index}.label`} className="eyebrow text-[11px] text-brand-deep" />
                    </td>
                    {editing && (
                      <td className="px-3 py-2">
                        <ItemControls path="targets.rows" index={index} count={rows.length} label="group" />
                      </td>
                    )}
                  </tr>
                ) : (
                  <tr key={index} className="group border-b last:border-b-0 transition-colors duration-200 hover:bg-brand-soft/70">
                    <td className="px-5 py-3.5 align-top font-medium text-foreground">
                      <span className="flex items-start gap-2">
                        <span className="mt-1 h-4 w-1 shrink-0 rounded-full bg-brand/30 transition-all duration-300 group-hover:bg-brand" />
                        <Editable path={`targets.rows.${index}.measure`} multiline />
                      </span>
                    </td>
                    <td className="px-5 py-3.5 align-top text-muted-foreground">
                      <Editable path={`targets.rows.${index}.today`} multiline />
                    </td>
                    <td className="px-5 py-3.5 align-top text-foreground/85">
                      <Editable path={`targets.rows.${index}.month6`} multiline />
                    </td>
                    <td className="px-5 py-3.5 align-top font-semibold text-brand-deep transition-colors duration-200 group-hover:text-brand">
                      <Editable path={`targets.rows.${index}.month12`} multiline />
                    </td>
                    {editing && (
                      <td className="px-3 py-2.5 align-top">
                        <ItemControls path="targets.rows" index={index} count={rows.length} label="row" />
                      </td>
                    )}
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
        {editing && (
          <div className="flex flex-wrap gap-2 border-t bg-muted/40 p-3">
            <AddItemButton
              path="targets.rows"
              template={{ kind: "row", measure: "New measure", today: "Today", month6: "Month 6", month12: "Month 12" }}
              label="Add measure"
            />
            <AddItemButton path="targets.rows" template={{ kind: "group", label: "New group" }} label="Add group heading" />
          </div>
        )}
      </div>
    </SectionShell>
  );
}
