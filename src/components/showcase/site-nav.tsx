"use client";

import * as React from "react";
import { LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { useCms } from "@/components/cms/cms-provider";
import { MODULE_KEYS, MODULE_LABELS } from "@/lib/modules-shared";
import { cn } from "@/lib/utils";
import { useTabs, type TabKey } from "./tabs-context";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  ...MODULE_KEYS.map((key) => ({ key, label: MODULE_LABELS[key] })),
];

export function SiteNav() {
  const { role, username, logout } = useCms();
  const { active, setActive } = useTabs();
  const [scrolled, setScrolled] = React.useState(false);
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-tab="${active}"]`)?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [active]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const index = TABS.findIndex((t) => t.key === active);
    const next = TABS[(index + (event.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length];
    setActive(next.key);
    listRef.current?.querySelector<HTMLElement>(`[data-tab="${next.key}"]`)?.focus();
  };

  return (
    <nav
      data-site-nav
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur-md transition-all duration-300",
        scrolled ? "border-slate-200/80 shadow-sm" : "border-slate-100",
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2 sm:px-6 lg:flex-nowrap lg:py-0">
        <button type="button" onClick={() => setActive("overview")} className="group flex h-12 shrink-0 items-center" aria-label="Overview">
          <BrandLogo height={36} priority className="transition-transform duration-300 group-hover:scale-[1.04]" />
        </button>

        <div
          ref={listRef}
          role="tablist"
          aria-label="Document tabs"
          onKeyDown={onKeyDown}
          className="order-3 -mx-4 flex w-[calc(100%+2rem)] gap-1 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:w-[calc(100%+3rem)] sm:px-6 lg:order-none lg:mx-0 lg:w-auto lg:flex-1 lg:justify-center lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {TABS.map((tab) => {
            const selected = tab.key === active;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                data-tab={tab.key}
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(tab.key)}
                className={cn(
                  "relative shrink-0 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200",
                  selected ? "bg-brand-deep text-white shadow-md shadow-brand-deep/20" : "text-muted-foreground hover:-translate-y-px hover:bg-brand-soft hover:text-brand-deep",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
          <Badge variant={role === "editor" ? "default" : "outline"} className="hidden sm:inline-flex">
            {role === "editor" ? "Editor" : "View only"} · {username}
          </Badge>
          <Button variant="ghost" size="sm" onClick={() => void logout()}>
            <LogOut data-icon="inline-start" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
