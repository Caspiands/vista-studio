"use client";

import * as React from "react";
import { useCms } from "@/components/cms/cms-provider";
import { EditorToolbar } from "@/components/cms/toolbar";
import { FlowSection } from "./flow-section";
import { GuideSection } from "./guide-section";
import { Hero } from "./hero";
import { ModuleView } from "./module-view";
import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";
import { TabsProvider, useTabs } from "./tabs-context";
import { TargetsSection } from "./targets-section";
import { TilesSection } from "./tiles-section";
import { WorkingSection } from "./working-section";

function ActiveTab() {
  const { active } = useTabs();
  if (active === "overview") {
    return (
      <>
        <Hero />
        <TilesSection />
        <FlowSection />
        <TargetsSection />
        <WorkingSection />
        <GuideSection />
      </>
    );
  }
  return <ModuleView moduleKey={active} />;
}

export function Showcase() {
  const { editing } = useCms();

  React.useEffect(() => {
    document.documentElement.dataset.editing = editing ? "true" : "false";
    return () => {
      delete document.documentElement.dataset.editing;
    };
  }, [editing]);

  return (
    <TabsProvider>
      <div className="flex min-h-screen flex-col">
        <SiteNav />
        <main className="flex-1">
          <ActiveTab />
        </main>
        <SiteFooter />
        <EditorToolbar />
      </div>
    </TabsProvider>
  );
}
