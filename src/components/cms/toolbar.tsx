"use client";

import * as React from "react";
import { CheckCircle2, History, Loader2, LogOut, PencilLine, RotateCcw, Save, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useCms } from "./cms-provider";

function formatTimestamp(iso: string | null) {
  if (!iso) return "Original template";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}

export function EditorToolbar() {
  const { canEdit, editing, setEditing, dirty, saving, save, discard, reset, updatedAt, updatedBy, logout } = useCms();
  const [resetOpen, setResetOpen] = React.useState(false);

  React.useEffect(() => {
    if (!canEdit) return;
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (dirty && !saving) void save();
      }
      if (event.key === "Escape" && editing && document.activeElement === document.body) {
        setEditing(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canEdit, dirty, saving, save, editing, setEditing]);

  if (!canEdit) return null;

  return (
    <div className="cms-controls pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 print:hidden">
      <div
        className={cn(
          "pointer-events-auto flex max-w-full flex-wrap items-center gap-2 rounded-2xl border bg-white/90 px-3 py-2 shadow-xl shadow-slate-900/10 backdrop-blur-md transition-all duration-300",
          editing ? "border-amber-400 ring-4 ring-amber-300/30" : "border-slate-200",
        )}
      >
        <div className="flex items-center gap-2 pr-2">
          <Switch id="edit-mode" checked={editing} onCheckedChange={(checked) => setEditing(checked)} />
          <Label htmlFor="edit-mode" className="flex cursor-pointer items-center gap-1.5 text-sm font-medium">
            <PencilLine className="size-4 text-amber-600" />
            Edit mode
          </Label>
        </div>

        <span className="hidden h-6 w-px bg-slate-200 sm:block" />

        <div className="flex items-center gap-1.5">
          <Button size="sm" onClick={() => void save()} disabled={!dirty || saving} className="bg-brand text-white hover:bg-brand/90">
            {saving ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <Save data-icon="inline-start" />}
            {saving ? "Publishing…" : "Publish"}
          </Button>
          <Button size="sm" variant="outline" onClick={discard} disabled={!dirty || saving}>
            <Undo2 data-icon="inline-start" />
            Discard
          </Button>
          <Dialog open={resetOpen} onOpenChange={setResetOpen}>
            <Tooltip>
              <TooltipTrigger
                render={<DialogTrigger render={<Button size="icon-sm" variant="ghost" aria-label="Reset to template" disabled={saving} />} />}
              >
                <RotateCcw />
              </TooltipTrigger>
              <TooltipContent>Reset to original template</TooltipContent>
            </Tooltip>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reset all content?</DialogTitle>
                <DialogDescription>
                  This replaces every published edit with the original template and cannot be undone. Viewers will see the template immediately.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setResetOpen(false)}>
                  Keep my edits
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    await reset();
                    setResetOpen(false);
                  }}
                >
                  Reset content
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <span className="hidden h-6 w-px bg-slate-200 sm:block" />

        <div className="hidden items-center gap-1.5 text-xs text-muted-foreground md:flex">
          {dirty ? (
            <>
              <span className="size-2 animate-pulse rounded-full bg-amber-500" />
              Unpublished changes
            </>
          ) : (
            <>
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              <History className="size-3.5" />
              {formatTimestamp(updatedAt)}
              {updatedBy ? ` · ${updatedBy}` : ""}
            </>
          )}
        </div>

        <Tooltip>
          <TooltipTrigger render={<Button size="icon-sm" variant="ghost" aria-label="Sign out" onClick={() => void logout()} />}>
            <LogOut />
          </TooltipTrigger>
          <TooltipContent>Sign out</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
