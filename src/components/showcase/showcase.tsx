"use client";

import * as React from "react";
import { useCms } from "@/components/cms/cms-provider";
import { EditorToolbar } from "@/components/cms/toolbar";
import { ContactSection } from "./contact-section";
import { Hero } from "./hero";
import { InvestmentSection } from "./investment-section";
import { MetricsSection } from "./metrics-section";
import { PillarsSection } from "./pillars-section";
import { RisksSection } from "./risks-section";
import { RoadmapSection } from "./roadmap-section";
import { ScopeSection } from "./scope-section";
import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";
import { SummarySection } from "./summary-section";
import { TeamSection } from "./team-section";

export function Showcase() {
  const { editing } = useCms();

  React.useEffect(() => {
    document.documentElement.dataset.editing = editing ? "true" : "false";
    return () => {
      delete document.documentElement.dataset.editing;
    };
  }, [editing]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="flex-1">
        <Hero />
        <SummarySection />
        <MetricsSection />
        <PillarsSection />
        <RoadmapSection />
        <ScopeSection />
        <InvestmentSection />
        <TeamSection />
        <RisksSection />
        <ContactSection />
      </main>
      <SiteFooter />
      <EditorToolbar />
    </div>
  );
}
