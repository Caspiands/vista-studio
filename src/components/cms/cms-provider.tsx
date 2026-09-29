"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Role } from "@/lib/auth";
import { getAtPath, setAtPath, type Content, type StoredContent } from "@/lib/content";

interface CmsContextValue {
  content: Content;
  role: Role;
  username: string;
  canEdit: boolean;
  editing: boolean;
  dirty: boolean;
  saving: boolean;
  revision: number;
  updatedAt: string | null;
  updatedBy: string | null;
  setEditing: (value: boolean) => void;
  get: <T = unknown>(path: string) => T;
  set: (path: string, value: unknown) => void;
  insertAt: (path: string, index: number, item: unknown) => void;
  removeAt: (path: string, index: number) => void;
  move: (path: string, from: number, to: number) => void;
  save: () => Promise<void>;
  discard: () => void;
  reset: () => Promise<void>;
  logout: () => Promise<void>;
}

const CmsContext = React.createContext<CmsContextValue | null>(null);

export function useCms() {
  const ctx = React.useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used inside <CmsProvider>");
  return ctx;
}

interface CmsProviderProps {
  initial: StoredContent;
  role: Role;
  username: string;
  children: React.ReactNode;
}

export function CmsProvider({ initial, role, username, children }: CmsProviderProps) {
  const router = useRouter();
  const [published, setPublished] = React.useState<StoredContent>(initial);
  const [draft, setDraft] = React.useState<Content>(initial.content);
  const [editing, setEditingState] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [revision, setRevision] = React.useState(0);

  const canEdit = role === "editor";
  const dirty = draft !== published.content;

  React.useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const setEditing = React.useCallback(
    (value: boolean) => {
      if (!canEdit) return;
      setEditingState(value);
    },
    [canEdit],
  );

  const get = React.useCallback(
    <T,>(path: string) => getAtPath(draft, path) as T,
    [draft],
  );

  const set = React.useCallback((path: string, value: unknown) => {
    setDraft((current) => {
      if (getAtPath(current, path) === value) return current;
      return setAtPath(current, path, value);
    });
  }, []);

  const insertAt = React.useCallback((path: string, index: number, item: unknown) => {
    setDraft((current) => {
      const list = getAtPath(current, path);
      if (!Array.isArray(list)) return current;
      const copy = [...list];
      copy.splice(index, 0, item);
      return setAtPath(current, path, copy);
    });
  }, []);

  const removeAt = React.useCallback((path: string, index: number) => {
    setDraft((current) => {
      const list = getAtPath(current, path);
      if (!Array.isArray(list)) return current;
      return setAtPath(current, path, list.filter((_, i) => i !== index));
    });
    setRevision((r) => r + 1);
  }, []);

  const move = React.useCallback((path: string, from: number, to: number) => {
    setDraft((current) => {
      const list = getAtPath(current, path);
      if (!Array.isArray(list) || to < 0 || to >= list.length) return current;
      const copy = [...list];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return setAtPath(current, path, copy);
    });
    setRevision((r) => r + 1);
  }, []);

  const save = React.useCallback(async () => {
    if (!canEdit || saving) return;
    setSaving(true);
    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: draft }),
      });
      if (response.status === 401) {
        toast.error("Your session has expired. Please sign in again.");
        router.push("/login");
        return;
      }
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `Save failed (${response.status})`);
      }
      const stored = (await response.json()) as StoredContent;
      setPublished(stored);
      setDraft(stored.content);
      toast.success("Changes published", { description: "Viewers will see the updated content immediately." });
    } catch (error) {
      toast.error("Could not publish changes", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setSaving(false);
    }
  }, [canEdit, saving, draft, router]);

  const discard = React.useCallback(() => {
    setDraft(published.content);
    setRevision((r) => r + 1);
    toast("Draft discarded", { description: "Reverted to the last published version." });
  }, [published]);

  const reset = React.useCallback(async () => {
    if (!canEdit) return;
    setSaving(true);
    try {
      const response = await fetch("/api/content", { method: "DELETE" });
      if (!response.ok) throw new Error(`Reset failed (${response.status})`);
      const stored = (await response.json()) as StoredContent;
      setPublished(stored);
      setDraft(stored.content);
      setRevision((r) => r + 1);
      toast.success("Content restored to the original template");
    } catch (error) {
      toast.error("Could not reset content", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setSaving(false);
    }
  }, [canEdit]);

  const logout = React.useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }, [router]);

  const value = React.useMemo<CmsContextValue>(
    () => ({
      content: draft,
      role,
      username,
      canEdit,
      editing: canEdit && editing,
      dirty,
      saving,
      revision,
      updatedAt: published.updatedAt,
      updatedBy: published.updatedBy,
      setEditing,
      get,
      set,
      insertAt,
      removeAt,
      move,
      save,
      discard,
      reset,
      logout,
    }),
    [draft, role, username, canEdit, editing, dirty, saving, revision, published, setEditing, get, set, insertAt, removeAt, move, save, discard, reset, logout],
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}
