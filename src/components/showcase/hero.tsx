"use client";

import { ArrowRight, FileDown, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Editable } from "@/components/cms/editable";
import { useTabs } from "./tabs-context";

export function Hero() {
  const { setActive } = useTabs();

  return (
    <header id="top" className="hero-dark relative isolate overflow-hidden bg-brand-deep text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="float-slow absolute -top-32 right-[-10%] size-[34rem] rounded-full bg-brand/30 blur-3xl" />
        <div className="float-slow absolute -bottom-40 left-[-10%] size-[28rem] rounded-full bg-vista-green/15 blur-3xl [animation-delay:-4s]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-14 pb-16 sm:pt-20 sm:pb-20">
        <div className="fade-up max-w-4xl">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 font-medium backdrop-blur transition-colors duration-300 hover:border-brand-light/60 hover:bg-white/15">
              <Editable path="meta.docCode" /> <Editable path="meta.version" />
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 font-medium backdrop-blur transition-colors duration-300 hover:border-brand-light/60 hover:bg-white/15">
              <Editable path="meta.edition" />
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-vista-green/40 bg-vista-green/15 px-3 py-1 font-medium text-vista-green backdrop-blur transition-colors duration-300 hover:bg-vista-green/25">
              <Editable path="meta.issueDate" />
            </span>
          </div>

          <Editable path="hero.eyebrow" as="p" className="eyebrow mb-4 text-brand-light" />
          <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl xl:text-[3.5rem]">
            <Editable path="hero.titleLead" /> <Editable path="hero.titleAccent" className="text-brand-light" />
          </h1>
          <Editable path="hero.subtitle" as="p" multiline className="mt-6 max-w-3xl text-base leading-relaxed text-white/75 sm:text-lg" />
          <Editable path="hero.metaLine" as="p" className="mt-4 text-sm text-white/55" />

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="btn-shine h-12 rounded-xl bg-brand px-6 text-base text-white shadow-lg shadow-brand/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand hover:shadow-xl hover:shadow-brand/40"
              onClick={() => setActive("analysis")}
            >
              <Editable path="hero.primaryCta" />
              <ArrowRight className="transition-transform duration-300 group-hover/button:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-white/20 bg-white/5 px-6 text-base text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 hover:text-white dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10"
              onClick={() => window.print()}
            >
              <FileDown />
              <Editable path="hero.secondaryCta" />
            </Button>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/10 pt-8 text-sm sm:grid-cols-3">
            <div className="transition-colors duration-300 hover:text-white">
              <dt className="text-white/50">Prepared for</dt>
              <dd className="mt-1 font-medium">
                <Editable path="meta.preparedFor" />
              </dd>
            </div>
            <div className="transition-colors duration-300 hover:text-white">
              <dt className="text-white/50">Prepared by</dt>
              <dd className="mt-1 font-medium">
                <Editable path="meta.preparedBy" />
              </dd>
            </div>
            <div className="transition-colors duration-300 hover:text-white">
              <dt className="text-white/50">Issued</dt>
              <dd className="mt-1 font-medium">
                <Editable path="meta.issueDate" />
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/10">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-6 py-3 text-xs text-white/55">
          <ShieldCheck className="size-3.5 shrink-0 text-brand-light" />
          <Editable path="meta.confidentiality" />
        </div>
      </div>
    </header>
  );
}
