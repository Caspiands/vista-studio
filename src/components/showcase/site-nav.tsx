"use client";

import * as React from "react";
import { LogOut, Menu, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { useCms } from "@/components/cms/cms-provider";
import { SECTION_LABELS, SECTION_ORDER, type SectionKey } from "@/lib/content";
import { cn } from "@/lib/utils";

export function SiteNav() {
  const { content, role, username, logout, editing } = useCms();
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<string>("");
  const [scrolled, setScrolled] = React.useState(false);

  const sections = SECTION_ORDER.filter((key) => content[key].visible || editing);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.2, 0.5] },
    );
    sections.forEach((key) => {
      const el = document.getElementById(key);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      data-site-nav
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur-md transition-all duration-300",
        scrolled ? "border-slate-200/80 shadow-sm" : "border-slate-100",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        <a href="#top" className="group flex shrink-0 items-center" aria-label="Back to top">
          <BrandLogo height={38} priority className="transition-transform duration-300 group-hover:scale-[1.04]" />
        </a>

        <ul className="hidden items-center gap-5 lg:flex xl:gap-6">
          {sections.map((key: SectionKey) => (
            <li key={key}>
              <a
                href={`#${key}`}
                aria-current={active === key ? "true" : undefined}
                className={cn(
                  "link-underline text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground",
                  active === key && "text-foreground",
                )}
              >
                {SECTION_LABELS[key]}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Badge variant={role === "editor" ? "default" : "outline"} className="capitalize">
            {role === "editor" ? "Editor" : "View only"} · {username}
          </Badge>
          <Button variant="ghost" size="sm" onClick={() => void logout()}>
            <LogOut data-icon="inline-start" />
            Sign out
          </Button>
        </div>

        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Toggle navigation" onClick={() => setOpen((v) => !v)}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      <div
        className={cn(
          "grid overflow-hidden border-t border-slate-200 bg-white/95 backdrop-blur-md transition-all duration-300 lg:hidden",
          open ? "max-h-[32rem] opacity-100" : "max-h-0 border-t-0 opacity-0",
        )}
      >
        <ul className="flex flex-col gap-1 px-6 py-4">
          {sections.map((key) => (
            <li key={key}>
              <a
                href={`#${key}`}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {SECTION_LABELS[key]}
              </a>
            </li>
          ))}
          <li className="mt-2 flex items-center justify-between border-t pt-3">
            <Badge variant={role === "editor" ? "default" : "outline"}>
              {role === "editor" ? "Editor" : "View only"} · {username}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => void logout()}>
              <LogOut data-icon="inline-start" />
              Sign out
            </Button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
