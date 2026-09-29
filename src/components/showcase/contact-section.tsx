"use client";

import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCms } from "@/components/cms/cms-provider";
import { Editable } from "@/components/cms/editable";
import { SectionShell } from "@/components/cms/section-shell";

export function ContactSection() {
  const { content, editing } = useCms();
  const { email, phone } = content.contact;

  return (
    <SectionShell sectionKey="contact" tone="dark">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <Editable path="contact.body" as="p" multiline className="max-w-2xl text-lg leading-relaxed text-white/75" />
          <Button
            size="lg"
            className="btn-shine mt-8 h-12 rounded-xl bg-brand px-6 text-base text-white shadow-lg shadow-brand/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand hover:shadow-xl hover:shadow-brand/40"
            nativeButton={false}
            render={<a href={editing ? undefined : `mailto:${email}`} />}
          >
            <Editable path="contact.ctaLabel" />
            <ArrowUpRight className="transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
          </Button>
        </div>

        <ul className="space-y-3">
          {[
            { icon: Mail, path: "contact.email", href: `mailto:${email}` },
            { icon: Phone, path: "contact.phone", href: `tel:${phone.replace(/[^\d+]/g, "")}` },
            { icon: MapPin, path: "contact.address", href: undefined },
          ].map(({ icon: Icon, path, href }) => {
            const Wrapper: React.ElementType = href && !editing ? "a" : "div";
            return (
              <li key={path}>
                <Wrapper
                  href={href && !editing ? href : undefined}
                  className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-light/50 hover:bg-white/10"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand/30 text-brand-light transition-all duration-300 group-hover:bg-brand-light group-hover:text-brand-deep">
                    <Icon className="size-4" />
                  </span>
                  <Editable path={path} className="text-sm font-medium text-white/85 transition-colors group-hover:text-white" />
                </Wrapper>
              </li>
            );
          })}
        </ul>
      </div>
    </SectionShell>
  );
}
