"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useCms } from "./cms-provider";

interface ItemControlsProps {
  path: string;
  index: number;
  count: number;
  /** Show the controls stacked vertically, e.g. inside a table row. */
  vertical?: boolean;
  className?: string;
  label?: string;
}

/** Reorder and remove controls for one entry in an editable list. Renders nothing outside edit mode. */
export function ItemControls({ path, index, count, vertical = false, className, label = "item" }: ItemControlsProps) {
  const { editing, move, removeAt } = useCms();
  if (!editing) return null;

  return (
    <div
      className={cn(
        "cms-controls z-20 flex items-center gap-0.5 rounded-md border border-amber-300 bg-white/95 p-0.5 shadow-sm backdrop-blur",
        vertical && "flex-col",
        className,
      )}
      contentEditable={false}
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              size="icon-xs"
              variant="ghost"
              aria-label={`Move ${label} up`}
              disabled={index === 0}
              onClick={() => move(path, index, index - 1)}
            />
          }
        >
          <ArrowUp />
        </TooltipTrigger>
        <TooltipContent>Move up</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              size="icon-xs"
              variant="ghost"
              aria-label={`Move ${label} down`}
              disabled={index === count - 1}
              onClick={() => move(path, index, index + 1)}
            />
          }
        >
          <ArrowDown />
        </TooltipTrigger>
        <TooltipContent>Move down</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              size="icon-xs"
              variant="ghost"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              aria-label={`Remove ${label}`}
              disabled={count <= 1}
              onClick={() => removeAt(path, index)}
            />
          }
        >
          <Trash2 />
        </TooltipTrigger>
        <TooltipContent>{count <= 1 ? "Lists need at least one entry" : "Remove"}</TooltipContent>
      </Tooltip>
    </div>
  );
}

interface AddItemButtonProps {
  path: string;
  template: unknown;
  label: string;
  className?: string;
}

/** Appends a new entry (cloned from `template`) to an editable list. Renders nothing outside edit mode. */
export function AddItemButton({ path, template, label, className }: AddItemButtonProps) {
  const { editing, get, insertAt } = useCms();
  if (!editing) return null;
  const count = (get<unknown[]>(path) ?? []).length;

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn("cms-controls border-dashed border-amber-400 bg-amber-50 text-amber-900 hover:bg-amber-100", className)}
      onClick={() => insertAt(path, count, structuredClone(template))}
    >
      <Plus data-icon="inline-start" />
      {label}
    </Button>
  );
}

/**
 * Returns a click handler that cycles a value through `options`, and a flag
 * indicating whether the element should present as interactive.
 */
export function useCycleValue<T extends string>(path: string, options: readonly T[]) {
  const { editing, get, set } = useCms();
  const current = get<T>(path);
  const cycle = React.useCallback(() => {
    if (!editing) return;
    const index = options.indexOf(current);
    set(path, options[(index + 1) % options.length]);
  }, [editing, options, current, set, path]);
  return { value: current, cycle, interactive: editing };
}

interface ToggleFlagProps {
  path: string;
  onLabel: string;
  offLabel: string;
  className?: string;
}

/** Small button that flips a boolean in the draft. Renders nothing outside edit mode. */
export function ToggleFlag({ path, onLabel, offLabel, className }: ToggleFlagProps) {
  const { editing, get, set } = useCms();
  if (!editing) return null;
  const value = Boolean(get<boolean>(path));
  return (
    <Button
      type="button"
      size="xs"
      variant="outline"
      className={cn("cms-controls border-amber-300 bg-white/95 text-amber-900 hover:bg-amber-50", className)}
      onClick={() => set(path, !value)}
    >
      {value ? onLabel : offLabel}
    </Button>
  );
}
