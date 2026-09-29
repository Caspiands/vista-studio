"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SECTION_LABELS, type SectionKey } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useCms } from "./cms-provider";
import { Editable } from "./editable";

interface SectionShellProps {
  sectionKey: SectionKey;
  children: React.ReactNode;
  className?: string;
  /** Visual treatment for the section background. */
  tone?: "light" | "muted" | "dark";
  /** Centre the heading block instead of left-aligning it. */
  centered?: boolean;
  headerExtra?: React.ReactNode;
}

const toneClasses: Record<NonNullable<SectionShellProps["tone"]>, string> = {
  light: "bg-background",
  muted: "bg-muted/60",
  dark: "bg-brand-deep text-white section-dark",
};

export function SectionShell({ sectionKey, children, className, tone = "light", centered = false, headerExtra }: SectionShellProps) {
  const { editing, get, set } = useCms();
  const visible = get<boolean>(`${sectionKey}.visible`) ?? true;
  const intro = get<string>(`${sectionKey}.intro`) ?? "";

  if (!visible) {
    if (!editing) return null;
    return (
      <section id={sectionKey} className="scroll-mt-24 border-y border-dashed border-amber-400 bg-amber-50/70 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-6 sm:flex-row sm:items-center">
          <p className="text-sm text-amber-900">
            <span className="font-semibold">{SECTION_LABELS[sectionKey]}</span> section is hidden from viewers.
          </p>
          <Button size="sm" variant="outline" className="cms-controls border-amber-400 bg-white" onClick={() => set(`${sectionKey}.visible`, true)}>
            <Eye data-icon="inline-start" />
            Show section
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id={sectionKey} className={cn("relative scroll-mt-24 py-20 sm:py-24", toneClasses[tone], className)}>
      <div className="mx-auto max-w-7xl px-6">
        <div className={cn("mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", centered && "sm:flex-col sm:items-center sm:text-center")}>
          <div className={cn("max-w-3xl", centered && "mx-auto")}>
            <Editable
              path={`${sectionKey}.eyebrow`}
              as="p"
              className={cn("eyebrow mb-3", tone === "dark" ? "text-brand-light" : "text-brand")}
            />
            <Editable
              path={`${sectionKey}.heading`}
              as="h2"
              className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
            />
            {(intro || editing) && (
              <Editable
                path={`${sectionKey}.intro`}
                as="p"
                multiline
                placeholder="Add an introduction (optional)"
                className={cn("mt-4 text-base leading-relaxed sm:text-lg", tone === "dark" ? "text-white/70" : "text-muted-foreground")}
              />
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {headerExtra}
            {editing && (
              <Button size="sm" variant="outline" className="cms-controls border-amber-300 bg-white/95 text-amber-900 hover:bg-amber-50" onClick={() => set(`${sectionKey}.visible`, false)}>
                <EyeOff data-icon="inline-start" />
                Hide section
              </Button>
            )}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
