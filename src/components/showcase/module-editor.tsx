"use client";

import * as React from "react";
import { Braces, Code2, Loader2, PencilLine, RotateCcw, Save, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { TreeEditor } from "@/components/cms/tree-editor";
import { MODULE_LABELS, type ModuleData, type ModuleDocument, type ModuleKey } from "@/lib/modules-shared";
import { cn } from "@/lib/utils";

type Mode = "data" | "text" | "source";

interface ModuleEditorProps {
  moduleKey: ModuleKey;
  frameRef: React.RefObject<HTMLIFrameElement | null>;
  onPublished: () => void;
}

const INPLACE_STYLE_ID = "cms-inplace-style";

async function fetchModuleDocument(moduleKey: ModuleKey): Promise<ModuleDocument | null> {
  const response = await fetch(`/api/modules/${moduleKey}?format=json`);
  if (!response.ok) {
    toast.error("Could not load module for editing");
    return null;
  }
  return (await response.json()) as ModuleDocument;
}

function snapshotTemplate(frame: HTMLIFrameElement | null): string | null {
  const doc = frame?.contentDocument;
  if (!doc) return null;
  const clone = doc.documentElement.cloneNode(true) as HTMLElement;
  clone.querySelector(`#${INPLACE_STYLE_ID}`)?.remove();
  return `<!doctype html>${clone.outerHTML}`;
}

export function ModuleEditor({ moduleKey, frameRef, onPublished }: ModuleEditorProps) {
  const [doc, setDoc] = React.useState<ModuleDocument | null>(null);
  const [draftData, setDraftData] = React.useState<ModuleData>({});
  const [draftTemplate, setDraftTemplate] = React.useState("");
  const [mode, setMode] = React.useState<Mode>("data");
  const [inPlaceActive, setInPlaceActive] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [resetOpen, setResetOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);

  const applyDocument = React.useCallback((next: ModuleDocument) => {
    setDoc(next);
    setDraftData(next.data);
    setDraftTemplate(next.template);
    setMode(Object.keys(next.data).length > 0 ? "data" : "text");
  }, []);

  const load = React.useCallback(async () => {
    const next = await fetchModuleDocument(moduleKey);
    if (next) applyDocument(next);
  }, [moduleKey, applyDocument]);

  React.useEffect(() => {
    let cancelled = false;
    fetchModuleDocument(moduleKey).then((next) => {
      if (next && !cancelled) applyDocument(next);
    });
    return () => {
      cancelled = true;
    };
  }, [moduleKey, applyDocument]);

  const hasData = doc ? Object.keys(doc.data).length > 0 : false;

  // In-place text editing: turn the iframe document into an editable surface.
  React.useEffect(() => {
    const frame = frameRef.current;
    const frameDoc = frame?.contentDocument;
    if (mode !== "text" || !frameDoc) return;

    const apply = () => {
      const d = frame?.contentDocument;
      if (!d) return;
      d.designMode = "on";
      if (!d.getElementById(INPLACE_STYLE_ID)) {
        const style = d.createElement("style");
        style.id = INPLACE_STYLE_ID;
        style.textContent = `
          body{caret-color:#d97706}
          h1:hover,h2:hover,h3:hover,h4:hover,p:hover,li:hover,td:hover,th:hover,span:hover,figcaption:hover,dd:hover,dt:hover{outline:1px dashed #f59e0b;outline-offset:2px;border-radius:3px}
        `;
        d.head.appendChild(style);
      }
      setInPlaceActive(true);
    };

    if (frameDoc.readyState === "complete") apply();
    frame?.addEventListener("load", apply);
    return () => {
      frame?.removeEventListener("load", apply);
      const d = frame?.contentDocument;
      if (d) {
        d.designMode = "off";
        d.getElementById(INPLACE_STYLE_ID)?.remove();
      }
    };
  }, [mode, frameRef, doc]);

  const dirtyData = doc ? draftData !== doc.data : false;
  const dirtyTemplate = doc ? draftTemplate !== doc.template : false;
  const dirty = dirtyData || dirtyTemplate || (mode === "text" && inPlaceActive);

  const save = async () => {
    if (!doc || saving) return;
    setSaving(true);
    try {
      const body: { data?: ModuleData; template?: string } = {};
      if (dirtyData) body.data = draftData;
      if (mode === "text" && inPlaceActive) {
        const snapshot = snapshotTemplate(frameRef.current);
        if (snapshot) body.template = snapshot;
      } else if (dirtyTemplate) {
        body.template = draftTemplate;
      }
      if (!body.data && !body.template) {
        toast("Nothing to publish");
        return;
      }
      const response = await fetch(`/api/modules/${moduleKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const err = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error ?? `Save failed (${response.status})`);
      }
      const next = (await response.json()) as ModuleDocument;
      setDoc(next);
      setDraftData(next.data);
      setDraftTemplate(next.template);
      setInPlaceActive(false);
      onPublished();
      toast.success(`${MODULE_LABELS[moduleKey]} published`);
    } catch (error) {
      toast.error("Could not publish module", { description: error instanceof Error ? error.message : "Unknown error" });
    } finally {
      setSaving(false);
    }
  };

  const discard = () => {
    if (!doc) return;
    setDraftData(doc.data);
    setDraftTemplate(doc.template);
    setInPlaceActive(false);
    onPublished();
    toast("Module draft discarded");
  };

  const reset = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/modules/${moduleKey}`, { method: "DELETE" });
      if (!response.ok) throw new Error(`Reset failed (${response.status})`);
      await load();
      onPublished();
      toast.success(`${MODULE_LABELS[moduleKey]} restored to the imported original`);
    } catch (error) {
      toast.error("Could not reset module", { description: error instanceof Error ? error.message : "Unknown error" });
    } finally {
      setSaving(false);
      setResetOpen(false);
    }
  };

  const modes: { key: Mode; label: string; icon: React.ElementType; available: boolean }[] = [
    { key: "data", label: "Data & text", icon: Braces, available: hasData },
    { key: "text", label: "Edit text in page", icon: PencilLine, available: !hasData },
    { key: "source", label: "HTML source", icon: Code2, available: true },
  ];

  return (
    <div className="cms-controls border-b border-amber-300 bg-amber-50/80 backdrop-blur">
      <div className="mx-auto max-w-[1400px] px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="mr-auto flex items-center gap-2">
            <span className="rounded-full bg-amber-200 px-2.5 py-0.5 text-xs font-semibold text-amber-900">Editing tab</span>
            <span className="text-sm font-semibold text-amber-950">{MODULE_LABELS[moduleKey]}</span>
            {doc?.customised && <span className="text-xs text-amber-800">· customised {doc.updatedAt ? new Date(doc.updatedAt).toLocaleString() : ""}</span>}
          </div>
          <div className="flex rounded-lg border border-amber-300 bg-white p-0.5">
            {modes
              .filter((m) => m.available)
              .map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMode(m.key)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                    mode === m.key ? "bg-brand-deep text-white" : "text-amber-950 hover:bg-amber-100",
                  )}
                >
                  <m.icon className="size-3.5" />
                  {m.label}
                </button>
              ))}
          </div>
          <Button size="sm" onClick={() => void save()} disabled={!dirty || saving || !doc} className="bg-brand text-white hover:bg-brand/90">
            {saving ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <Save data-icon="inline-start" />}
            Publish tab
          </Button>
          <Button size="sm" variant="outline" onClick={discard} disabled={!dirty || saving}>
            <Undo2 data-icon="inline-start" />
            Discard
          </Button>
          <Dialog open={resetOpen} onOpenChange={setResetOpen}>
            <DialogTrigger render={<Button size="sm" variant="ghost" disabled={saving || !doc?.customised} />}>
              <RotateCcw data-icon="inline-start" />
              Restore original
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Restore the imported original?</DialogTitle>
                <DialogDescription>All published edits to the {MODULE_LABELS[moduleKey]} tab will be replaced by the version imported from the client edition file.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setResetOpen(false)}>
                  Keep edits
                </Button>
                <Button variant="destructive" onClick={() => void reset()}>
                  Restore original
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button size="sm" variant="ghost" onClick={() => setCollapsed((c) => !c)}>
            {collapsed ? "Show editor" : "Hide editor"}
          </Button>
        </div>

        {!collapsed && (
          <div className="mt-3">
            {!doc ? (
              <div className="flex items-center gap-2 py-6 text-sm text-amber-900">
                <Loader2 className="size-4 animate-spin" /> Loading module…
              </div>
            ) : mode === "data" ? (
              <div className="rounded-xl border border-amber-200 bg-white/80 p-3">
                <p className="mb-2 text-xs text-amber-900">
                  Every figure, label and paragraph this tab renders lives in the data below. Expand a group, change a value, then publish — the tab redraws with your edits.
                </p>
                <div className="max-h-[28rem] space-y-1.5 overflow-y-auto pr-1">
                  {Object.entries(draftData).map(([name, value]) => (
                    <TreeEditor key={name} label={name} value={value} defaultOpen={Object.keys(draftData).length === 1} onChange={(next) => setDraftData({ ...draftData, [name]: next })} />
                  ))}
                </div>
              </div>
            ) : mode === "text" ? (
              <p className="rounded-xl border border-amber-200 bg-white/80 p-3 text-xs text-amber-900">
                Click any text in the page below and type. Images and layout stay as they are. Publish when you are done; discard reloads the tab.
              </p>
            ) : (
              <div className="rounded-xl border border-amber-200 bg-white/80 p-3">
                <p className="mb-2 text-xs text-amber-900">
                  Advanced: the full HTML of this tab. Markers like <code className="rounded bg-amber-100 px-1">{"/*__VISTA_DATA__:NAME*/"}</code> are replaced with the data above when the page renders.
                </p>
                <Textarea value={draftTemplate} onChange={(e) => setDraftTemplate(e.target.value)} spellCheck={false} className="min-h-[24rem] font-mono text-[11px] leading-snug" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
