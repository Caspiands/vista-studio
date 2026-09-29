"use client";

import * as React from "react";
import { ChevronRight, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface TreeEditorProps {
  value: unknown;
  onChange: (next: unknown) => void;
  label?: string;
  depth?: number;
  defaultOpen?: boolean;
}

function describe(value: unknown): string {
  if (Array.isArray(value)) return `${value.length} item${value.length === 1 ? "" : "s"}`;
  if (value && typeof value === "object") return `${Object.keys(value).length} field${Object.keys(value).length === 1 ? "" : "s"}`;
  return "";
}

function preview(value: unknown): string {
  if (Array.isArray(value)) {
    const first = value.find((v) => typeof v === "string") ?? value.find((v) => v && typeof v === "object" && "name" in (v as object));
    if (typeof first === "string") return first;
    if (first && typeof first === "object") return String((first as Record<string, unknown>).name ?? "");
    return "";
  }
  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>;
    const hint = o.title ?? o.name ?? o.label ?? o.t ?? o.n ?? o.id;
    return typeof hint === "string" ? hint : "";
  }
  return "";
}

/**
 * Generic editor for JSON-like data. Objects and arrays fold; strings, numbers
 * and booleans edit inline. Used for the data constants that drive each tab.
 */
export function TreeEditor({ value, onChange, label, depth = 0, defaultOpen = false }: TreeEditorProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  if (Array.isArray(value)) {
    return (
      <Branch label={label} open={open} setOpen={setOpen} meta={describe(value)} hint={preview(value)} depth={depth}>
        <div className="space-y-1.5">
          {value.map((item, index) => (
            <div key={index} className="group/row flex items-start gap-1">
              <div className="min-w-0 flex-1">
                <TreeEditor
                  value={item}
                  label={`${index + 1}`}
                  depth={depth + 1}
                  onChange={(next) => onChange(value.map((v, i) => (i === index ? next : v)))}
                />
              </div>
              <Button
                size="icon-xs"
                variant="ghost"
                aria-label={`Remove item ${index + 1}`}
                className="mt-1 shrink-0 text-destructive opacity-40 hover:bg-destructive/10 hover:text-destructive group-hover/row:opacity-100"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
              >
                <Trash2 />
              </Button>
            </div>
          ))}
          <Button
            size="xs"
            variant="outline"
            className="border-dashed border-amber-400 bg-amber-50 text-amber-900 hover:bg-amber-100"
            onClick={() => {
              const last = value[value.length - 1];
              onChange([...value, last === undefined ? "" : blankLike(last)]);
            }}
          >
            <Plus data-icon="inline-start" />
            Add item
          </Button>
        </div>
      </Branch>
    );
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return (
      <Branch label={label} open={open} setOpen={setOpen} meta={describe(value)} hint={preview(value)} depth={depth}>
        <div className="space-y-1.5">
          {Object.entries(record).map(([key, child]) => (
            <TreeEditor key={key} value={child} label={key} depth={depth + 1} onChange={(next) => onChange({ ...record, [key]: next })} />
          ))}
        </div>
      </Branch>
    );
  }

  return <Leaf label={label} value={value} onChange={onChange} />;
}

/** Produces an empty value with the same shape as `sample`, so new list items have the right fields. */
function blankLike(sample: unknown): unknown {
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === "object") {
    return Object.fromEntries(Object.entries(sample as Record<string, unknown>).map(([k, v]) => [k, blankLike(v)]));
  }
  if (typeof sample === "number") return 0;
  if (typeof sample === "boolean") return false;
  return "";
}

function Branch({
  label,
  meta,
  hint,
  open,
  setOpen,
  depth,
  children,
}: {
  label?: string;
  meta: string;
  hint: string;
  open: boolean;
  setOpen: (v: boolean) => void;
  depth: number;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-lg", depth > 0 && "border border-slate-200/80 bg-white/60")}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-brand-soft"
      >
        <ChevronRight className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-90")} />
        {label !== undefined && <span className="font-mono text-xs font-semibold text-brand-deep">{label}</span>}
        {hint && <span className="truncate text-xs text-foreground/70">{hint}</span>}
        <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">{meta}</span>
      </button>
      {open && <div className="border-t border-slate-200/70 px-2 py-2 pl-4">{children}</div>}
    </div>
  );
}

function Leaf({ label, value, onChange }: { label?: string; value: unknown; onChange: (next: unknown) => void }) {
  const id = React.useId();

  let control: React.ReactNode;
  if (typeof value === "boolean") {
    control = (
      <label className="flex h-8 items-center gap-2 text-sm">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-brand" />
        {value ? "true" : "false"}
      </label>
    );
  } else if (typeof value === "number") {
    control = <Input id={id} type="number" value={value} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} className="h-8 font-mono text-xs" />;
  } else if (value === null || value === undefined) {
    control = <span className="text-xs text-muted-foreground italic">empty</span>;
  } else {
    const text = String(value);
    control =
      text.length > 70 || text.includes("\n") ? (
        <Textarea id={id} value={text} onChange={(e) => onChange(e.target.value)} rows={Math.min(8, Math.max(2, Math.ceil(text.length / 80)))} className="min-h-0 text-sm leading-snug" />
      ) : (
        <Input id={id} value={text} onChange={(e) => onChange(e.target.value)} className="h-8 text-sm" />
      );
  }

  return (
    <div className="grid grid-cols-[minmax(3rem,8rem)_1fr] items-start gap-2 px-2 py-1">
      {label !== undefined ? (
        <label htmlFor={id} className="pt-2 truncate font-mono text-[11px] text-muted-foreground" title={label}>
          {label}
        </label>
      ) : (
        <span />
      )}
      <div className="min-w-0">{control}</div>
    </div>
  );
}
