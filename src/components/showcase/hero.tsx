"use client";

import { ArrowRight, FileDown, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCms } from "@/components/cms/cms-provider";
import { Editable } from "@/components/cms/editable";
import { AddItemButton, ItemControls } from "@/components/cms/list-controls";

export function Hero() {
  const { content } = useCms();
  const highlights = content.hero.highlights;

  return (
    <header id="top" className="hero-dark relative isolate overflow-hidden bg-brand-deep text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="float-slow absolute -top-32 right-[-10%] size-[34rem] rounded-full bg-brand/30 blur-3xl" />
        <div className="float-slow absolute -bottom-40 left-[-10%] size-[28rem] rounded-full bg-vista-green/15 blur-3xl [animation-delay:-4s]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-14 px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="fade-up">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 font-medium backdrop-blur transition-colors duration-300 hover:border-brand-light/60 hover:bg-white/15">
              <Editable path="meta.docCode" /> <Editable path="meta.version" />
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 font-medium backdrop-blur transition-colors duration-300 hover:border-brand-light/60 hover:bg-white/15">
              <Editable path="meta.edition" />
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-vista-green/40 bg-vista-green/15 px-3 py-1 font-medium text-vista-green backdrop-blur transition-colors duration-300 hover:bg-vista-green/25">
              <Editable path="meta.fiscalYear" />
            </span>
          </div>

          <Editable path="hero.eyebrow" as="p" className="eyebrow mb-4 text-brand-light" />
          <Editable
            path="hero.title"
            as="h1"
            multiline
            className="text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl xl:text-[3.5rem]"
          />
          <Editable path="hero.subtitle" as="p" multiline className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75" />

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="btn-shine h-12 rounded-xl bg-brand px-6 text-base text-white shadow-lg shadow-brand/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand hover:shadow-xl hover:shadow-brand/40"
              nativeButton={false}
              render={<a href="#roadmap" />}
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

        <div className="fade-up grid grid-cols-2 gap-4 [animation-delay:150ms]">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-brand-light/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-brand/20"
            >
              <ItemControls path="hero.highlights" index={index} count={highlights.length} className="absolute -top-3 right-3" label="highlight" />
              <Editable
                path={`hero.highlights.${index}.value`}
                as="p"
                className="text-4xl font-semibold tracking-tight text-white transition-colors duration-300 group-hover:text-brand-light sm:text-5xl"
              />
              <Editable path={`hero.highlights.${index}.label`} as="p" className="mt-2 text-sm text-white/65" />
              <span className="absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-brand-light to-transparent transition-transform duration-500 group-hover:scale-x-100" />
            </div>
          ))}
          <AddItemButton path="hero.highlights" template={{ value: "0", label: "New highlight" }} label="Add highlight" className="col-span-2 justify-self-start" />
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/10">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-6 py-3 text-xs text-white/55">
          <ShieldCheck className="size-3.5 shrink-0 text-brand-light" />
          <Editable path="meta.confidentiality" />
        </div>
      </div>
    </header>
  );
}
