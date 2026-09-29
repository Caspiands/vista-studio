"use client";

import { Check, Star } from "lucide-react";
import { useCms } from "@/components/cms/cms-provider";
import { Editable } from "@/components/cms/editable";
import { AddItemButton, ItemControls, ToggleFlag } from "@/components/cms/list-controls";
import { SectionShell } from "@/components/cms/section-shell";
import { cn } from "@/lib/utils";

export function InvestmentSection() {
  const { content } = useCms();
  const tiers = content.investment.tiers;

  return (
    <SectionShell sectionKey="investment" centered>
      <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
        {tiers.map((tier, index) => (
          <article
            key={index}
            className={cn(
              "group relative flex flex-col rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1.5",
              tier.featured
                ? "border-brand bg-brand-deep text-white shadow-2xl shadow-brand-deep/30 lg:scale-[1.03] hover:shadow-brand/30"
                : "bg-card hover:border-brand/40 hover:shadow-xl hover:shadow-slate-900/10",
            )}
          >
            <div className="absolute -top-3 right-4 flex items-center gap-2">
              <ToggleFlag path={`investment.tiers.${index}.featured`} onLabel="Unmark recommended" offLabel="Mark recommended" />
              <ItemControls path="investment.tiers" index={index} count={tiers.length} label="option" />
            </div>
            {tier.featured && (
              <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold">
                <Star className="size-3.5 fill-current" />
                Recommended option
              </span>
            )}
            <Editable path={`investment.tiers.${index}.name`} as="h3" className="text-lg font-semibold tracking-tight" />
            <div className="mt-4 flex items-baseline gap-2">
              <Editable
                path={`investment.tiers.${index}.price`}
                as="p"
                className={cn("text-4xl font-semibold tracking-tight transition-colors duration-300", tier.featured ? "text-brand-light" : "group-hover:text-brand")}
              />
              <Editable path={`investment.tiers.${index}.period`} as="p" className={cn("text-sm", tier.featured ? "text-white/60" : "text-muted-foreground")} />
            </div>
            <Editable
              path={`investment.tiers.${index}.description`}
              as="p"
              multiline
              className={cn("mt-3 text-sm leading-relaxed", tier.featured ? "text-white/75" : "text-muted-foreground")}
            />
            <ul className={cn("mt-6 flex-1 space-y-3 border-t pt-6", tier.featured ? "border-white/15" : "border-border")}>
              {tier.features.map((_, fIndex) => (
                <li key={fIndex} className="group/item flex items-start gap-3 text-sm">
                  <span
                    className={cn(
                      "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full transition-all duration-300",
                      tier.featured ? "bg-brand/40 text-brand-light group-hover/item:bg-brand-light group-hover/item:text-brand-deep" : "bg-brand-soft text-brand group-hover/item:bg-brand group-hover/item:text-white",
                    )}
                  >
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <Editable path={`investment.tiers.${index}.features.${fIndex}`} className="flex-1" />
                  <ItemControls path={`investment.tiers.${index}.features`} index={fIndex} count={tier.features.length} label="feature" />
                </li>
              ))}
            </ul>
            <AddItemButton path={`investment.tiers.${index}.features`} template="New inclusion" label="Add inclusion" className="mt-4 self-start" />
          </article>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <AddItemButton
          path="investment.tiers"
          template={{ name: "New option", price: "$0", period: "FY 2026-27", description: "Describe this option.", featured: false, features: ["First inclusion"] }}
          label="Add option"
        />
      </div>
      <Editable path="investment.note" as="p" multiline className="mx-auto mt-10 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground" />
    </SectionShell>
  );
}
