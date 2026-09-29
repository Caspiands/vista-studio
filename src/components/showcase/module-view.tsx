"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { useCms } from "@/components/cms/cms-provider";
import { MODULE_LABELS, type ModuleKey } from "@/lib/modules-shared";
import { cn } from "@/lib/utils";
import { ModuleEditor } from "./module-editor";

interface HubMessage {
  vistaHub?: number;
  frame?: string;
  height?: number;
  scrollTo?: number;
}

/** Body box, not documentElement.scrollHeight. The root element stretches to the iframe, so a shorter module would otherwise keep the previous tab's height and leave a blank page. */
function frameContentHeight(frame: HTMLIFrameElement | null): number {
  const body = frame?.contentDocument?.body;
  if (!body) return 0;
  return Math.ceil(body.scrollHeight);
}

export function ModuleView({ moduleKey }: { moduleKey: ModuleKey }) {
  const { editing } = useCms();
  const frameRef = React.useRef<HTMLIFrameElement>(null);
  const [version, setVersion] = React.useState(0);
  const [height, setHeight] = React.useState(720);
  const frameId = `${moduleKey}-${version}`;
  const [loadedFrame, setLoadedFrame] = React.useState<string | null>(null);
  const loaded = loadedFrame === frameId;
  const [sizedFrame, setSizedFrame] = React.useState(frameId);
  if (sizedFrame !== frameId) {
    setSizedFrame(frameId);
    setHeight(720);
  }

  const applyHeight = React.useCallback(
    (reported: number) => {
      const measured = frameContentHeight(frameRef.current);
      const next = measured > 0 ? measured : reported;
      if (next > 0) {
        setHeight(Math.max(320, next));
        setLoadedFrame(frameId);
      }
    },
    [frameId],
  );

  React.useEffect(() => {
    const onMessage = (event: MessageEvent<HubMessage>) => {
      const data = event.data;
      if (!data || !data.vistaHub || data.frame !== moduleKey) return;
      if (typeof data.height === "number" && data.height > 0) {
        applyHeight(data.height);
      }
      if (typeof data.scrollTo === "number" && frameRef.current) {
        const bar = document.querySelector<HTMLElement>("[data-site-nav]")?.offsetHeight ?? 0;
        const top = frameRef.current.getBoundingClientRect().top + window.scrollY + data.scrollTo - bar - 8;
        window.scrollTo({ top, behavior: "smooth" });
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [moduleKey, frameId, applyHeight]);

  const handleLoad = () => {
    setLoadedFrame(frameId);
    // Modules honour the hub's theme; the showcase is always light.
    frameRef.current?.contentWindow?.postMessage({ vistaTheme: "light" }, "*");
    const measured = frameContentHeight(frameRef.current);
    if (measured > 0) setHeight(Math.max(320, measured));
  };

  return (
    <section aria-label={MODULE_LABELS[moduleKey]} className="bg-[#f5f5f2]">
      {editing && <ModuleEditor key={moduleKey} moduleKey={moduleKey} frameRef={frameRef} onPublished={() => setVersion((v) => v + 1)} />}
      <div className="relative mx-auto max-w-[1400px]">
        {!loaded && (
          <div className="absolute inset-x-0 top-0 flex h-72 items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading {MODULE_LABELS[moduleKey]}…
          </div>
        )}
        <iframe
          key={frameId}
          ref={frameRef}
          name={moduleKey}
          title={MODULE_LABELS[moduleKey]}
          src={`/api/modules/${moduleKey}?v=${version}`}
          onLoad={handleLoad}
          style={{ height }}
          className={cn("block w-full border-0 transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0")}
        />
      </div>
    </section>
  );
}
