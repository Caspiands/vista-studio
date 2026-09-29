export interface SectionBase {
  visible: boolean;
  eyebrow: string;
  heading: string;
  intro: string;
}

export type TargetRow =
  | { kind: "group"; label: string }
  | { kind: "row"; measure: string; today: string; month6: string; month12: string };

export interface Content {
  meta: {
    brand: string;
    docTitle: string;
    docCode: string;
    version: string;
    edition: string;
    fiscalYear: string;
    preparedFor: string;
    preparedBy: string;
    issueDate: string;
    confidentiality: string;
  };
  hero: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    subtitle: string;
    metaLine: string;
    primaryCta: string;
    secondaryCta: string;
  };
  tiles: SectionBase & {
    items: { label: string; value: string; note: string }[];
  };
  flow: SectionBase & {
    steps: { tab: string; title: string; stage: string; summary: string; bullets: string[] }[];
    openLabel: string;
  };
  targets: SectionBase & {
    columns: { measure: string; today: string; month6: string; month12: string };
    rows: TargetRow[];
  };
  working: SectionBase & {
    principlesTitle: string;
    principles: string[];
    openTitle: string;
    open: string[];
  };
  guide: SectionBase & {
    columns: { tab: string; covers: string };
    rows: { tab: string; covers: string }[];
  };
  footer: {
    note: string;
    copyright: string;
  };
}

export interface StoredContent {
  content: Content;
  updatedAt: string | null;
  updatedBy: string | null;
}

export const SECTION_ORDER = ["tiles", "flow", "targets", "working", "guide"] as const;
export type SectionKey = (typeof SECTION_ORDER)[number];

export const SECTION_LABELS: Record<SectionKey, string> = {
  tiles: "At a glance",
  flow: "How it fits together",
  targets: "Twelve-month targets",
  working: "Working together",
  guide: "Tab guide",
};

export const defaultContent: Content = {
  meta: {
    brand: "Vista Eye Specialist",
    docTitle: "Digital Transformation 2026–27",
    docCode: "DTR",
    version: "v4",
    edition: "Client Edition",
    fiscalYear: "2026–27",
    preparedFor: "Vista Eye Specialist · Qualitas Health Malaysia",
    preparedBy: "Caspian Digital Solutions",
    issueDate: "September 2026",
    confidentiality: "Client edition v4 · Commercial figures are in the separate commercial proposal",
  },
  hero: {
    eyebrow: "Vista Eye Specialist · Digital Transformation RFP QHM/VES/DT/2026/003 · Qualitas Health Malaysia · Caspian Digital Solutions",
    titleLead: "Vista Eye Specialist —",
    titleAccent: "Digital Transformation 2026–27",
    subtitle: "",
    metaLine: "",
    primaryCta: "Start with Vista today",
    secondaryCta: "Download as PDF",
  },
  tiles: {
    visible: true,
    eyebrow: "At a glance",
    heading: "Six numbers that frame the plan",
    intro: "The baseline Vista shared, the first milestone, and the size of the plan that answers it.",
    items: [
      { label: "Cost per booked appointment", value: "RM182", note: "Jan–Aug 2026 baseline; reported CPL is RM10–19" },
      { label: "Booking rate, paid vs unpaid", value: "1.5% / 14.4%", note: "Dec 2025–Aug 2026, Respond.io lifecycle" },
      { label: "\u201cCataract surgery\u201d on Google", value: "Not in top 100", note: "Vista's largest service is not visible for its own keyword" },
      { label: "New website live", value: "Month 3", note: "Before Chinese New Year, Mandarin campaign first; ~12 weeks from start" },
      { label: "Audiences · personas", value: "4 · 10", note: "Four audience groups by age and decision-maker; ten personas inside them" },
      { label: "Pillars · campaigns", value: "6 · 13", note: "One content strategy for social, ads, landing pages and search; 5–8 posts a month in EN, BM and ZH" },
    ],
  },
  flow: {
    visible: true,
    eyebrow: "Reading order",
    heading: "How the plan fits together",
    intro: "",
    openLabel: "Open tab",
    steps: [
      {
        tab: "analysis",
        title: "Where Vista is today",
        stage: "Stage zero — the baseline",
        summary: "What the data Vista shared shows: strong interest, weak conversion. Raw numbers you can sort and filter.",
        bullets: [
          "Paid enquiries book at 1.5%, unpaid at 14.4%",
          "RM182 per booked appointment against RM10–19 per lead",
          "Cataract surgery not in Google's top 100; slow, partly translated site",
        ],
      },
      {
        tab: "personas",
        title: "Who we are speaking to",
        stage: "Audiences, then personas",
        summary: "Four audience groups by age and by who makes the decision, and the ten people inside them.",
        bullets: [
          "Young adults 18–40 · parents of children 5–17 · adults 40+ · seniors",
          "Parents, not children, are the target for myopia",
          "Each persona: journey today vs with the plan",
        ],
      },
      {
        tab: "campaigns",
        title: "Content & campaigns",
        stage: "One content strategy",
        summary: "Six content pillars feeding social, ads, landing pages and search; 13 campaigns with the platform each runs on and why.",
        bullets: ["5–8 posts a month, mix agreed with Vista", "Trend slot from Month 4", "MAB 3/2023 rules built in"],
      },
      {
        tab: "search",
        title: "Search visibility",
        stage: "SEO · AEO · GEO · local",
        summary:
          "How Vista gets found on Google, in answer boxes and in AI assistants, for every service and all 16 centres — with the tools, roadmap and KPIs.",
        bullets: [
          "Cataract surgery back on page 1; 16 centres in the local pack",
          "Answer-box and AI-assistant citations measured monthly",
          "52 medically reviewed articles; every tool Vista-owned",
        ],
      },
      {
        tab: "creative",
        title: "Creative & production",
        stage: "What it looks like",
        summary: "Finished sample posts and ads on Vista's identity, the templates behind them, and the production rhythm.",
        bullets: ["8 sample posts, 6 sample ads with the reason each exists", "12 templates on Vista's CI", "Brief-to-post workflow and approvals"],
      },
      {
        tab: "website",
        title: "Website concepts",
        stage: "Two concepts, one recommendation",
        summary: "Two concept sites against the live site, with measurements, a recommendation and the full sitemap for the new site.",
        bullets: ["Personalised journey: three questions, one skip", "One site, trilingual, under 1.5 s", "≈ 95-page sitemap for the new vista.com.my"],
      },
      {
        tab: "roadmap",
        title: "12-month roadmap",
        stage: "How it all lands",
        summary: "Six phases planned as durations, the Gantt, month by month, the team by role, the technology in plain terms, KPIs and risks.",
        bullets: ["Website live in Month 3, before CNY", "Cost per booked and attended visit", "One monthly meeting that closes actions"],
      },
    ],
  },
  targets: {
    visible: true,
    eyebrow: "Commitments",
    heading: "What the 12 months will bring",
    intro: "",
    columns: { measure: "Measure", today: "Today", month6: "Month 6", month12: "Month 12" },
    rows: [
      { kind: "row", measure: "Paid enquiries that become booked appointments", today: "1.5%", month6: "≥ 4%", month12: "≥ 6%" },
      { kind: "row", measure: "Cost per booked appointment", today: "RM182", month6: "−15% vs post-launch baseline", month12: "−25% vs post-launch baseline" },
      { kind: "row", measure: "Cost per attended visit", today: "Not measured", month6: "Reported monthly by campaign and centre", month12: "Target set at the Month-4 review" },
      { kind: "row", measure: "Website visitors who enquire", today: "Not reliably measured", month6: "+15% vs post-launch baseline", month12: "+25%" },
      { kind: "group", label: "Search visibility — SEO" },
      { kind: "row", measure: "Visitors from Google search (organic sessions)", today: "~121k in 20 months; never reported", month6: "+15% vs post-launch baseline", month12: "+40%" },
      {
        kind: "row",
        measure: "Commercial keywords on page 1 (incl. \u201ccataract surgery\u201d, \u201clasik surgery\u201d)",
        today: "Brand terms only; cataract surgery not in top 100",
        month6: "≥ 50%",
        month12: "≥ 60%",
      },
      { kind: "row", measure: "Enquiries and bookings from organic search", today: "Not attributed", month6: "Reported monthly by centre and language", month12: "Organic share of bookings reported" },
      { kind: "row", measure: "Medically reviewed articles published", today: "0 since May 2026", month6: "24", month12: "52; ≥ 10% in Google's top 10" },
      { kind: "group", label: "Local search — 16 centres" },
      { kind: "row", measure: "Centre × service pairs in the Google local top 3", today: "Not measured", month6: "≥ 8 pairs", month12: "≥ 16 pairs" },
      { kind: "row", measure: "Google Business Profile listings verified and correct", today: "13 of 16, plus a duplicate", month6: "16, reported per centre", month12: "Calls, directions and clicks +25% vs Month 4" },
      { kind: "group", label: "Answer engines — AEO" },
      { kind: "row", measure: "Services with an owned answer box / \u201cPeople also ask\u201d result", today: "None recorded", month6: "Reported per service", month12: "Every core service with ≥ 1 owned answer" },
      { kind: "row", measure: "Medical structured data and doctor profiles", today: "None; 20 doctors on one page", month6: "Full schema set live; 20 profiles", month12: "Validated on every release" },
      { kind: "group", label: "AI assistants — GEO" },
      { kind: "row", measure: "AI assistants citing Vista (60-prompt library, 5 engines)", today: "Baseline at Day 30", month6: "≥ 3 engines", month12: "≥ 5 engines" },
      { kind: "row", measure: "Visits referred by AI assistants", today: "134 a month (Aug 2026)", month6: "Reported monthly with enquiries", month12: "Trend and bookings attributed" },
      { kind: "group", label: "Website" },
      { kind: "row", measure: "Website speed and accessibility", today: "Slower than benchmark; 31 accessibility issues on home", month6: "Core Web Vitals \u201cGood\u201d", month12: "Sustained; WCAG 2.2 AA" },
      { kind: "row", measure: "One lead number everyone agrees on", today: "Five different counts", month6: "Variance < 10%", month12: "< 10%, investigated within 5 days" },
    ],
  },
  working: {
    visible: true,
    eyebrow: "Ways of working",
    heading: "How CDS works with Vista",
    intro: "",
    principlesTitle: "Working principles",
    principles: [
      "We build the strategy together. Vista has run these services for years and knows its patients. CDS brings the digital expertise. The first two weeks should be a proper working session between both teams — not us disappearing and coming back with a finished document.",
      "We build on what Vista already has. Respond.io and Salesforce stay. CDS adds the automation, reporting and customer-service flow around them, but this must be agreed with the Vista team so that what we build is practical, owned by Vista and sustainable after any agency engagement ends.",
      "Our strategy. The same six content pillars should drive social media, campaign creative, landing pages, articles and search. A patient should be hearing one consistent story from the first post they see right through to booking.",
      "It's about patients. Reporting needs to move beyond cost per lead and focus on cost per booked appointment and cost per attended visit.",
      "AI should support the strategy, not lead it. CDS builds the analysis and plans with AI, then applies human judgment and experience to refine them. The work should remain people-led. Automation should be used selectively where it genuinely adds value.",
      "The retainer covers the agreed scope. The targets in the roadmap are to be achieved within the retainer, scope and subscriptions already outlined in the commercial proposal. There will be no constant add-on charges simply to deliver the agreed work.",
      "Compliance is part of the work from the beginning. MAB Guideline 3/2023 must be applied across every persona, campaign and post. This means no free healthcare offers, no price comparisons, testimonials only about the facility, and no promotion of an individual practitioner's skills. We work with Qualitas Health Corp Comms to ensure compliance.",
    ],
    openTitle: "What we agree together in the first weeks",
    open: [
      "Website direction: confirm concept vista3 (Plain Sight) as the base, with vista1's price hero, booking-form fields, consultant directory and three-step explainer carried across.",
      "Go-live rule: if the mid-January acceptance test is not passed, the launch moves one month rather than launching unfinished.",
      "Content rhythm: the monthly pillar mix (spread or single theme), the 5–8 post range, and a named Vista reviewer with same-day turnaround before the trend slot starts in Month 4.",
      "Scope options outside the core plan: Xiaohongshu, Indonesian-language content, a LinkedIn pilot, and whether the Johor Bahru centre targets Singapore visitors.",
      "Data to confirm the personas: GA4 demographics and Vista patient records to validate the age, gender and income assumptions; Vista's current price list and MAB approvals for any price line.",
      "Access and connections: owner-level Respond.io access, the Salesforce tier (connector or scheduled export), and ad-account ownership under Vista's name.",
    ],
  },
  guide: {
    visible: false,
    eyebrow: "Tab guide",
    heading: "What each tab contains",
    intro: "",
    columns: { tab: "Tab", covers: "What it covers" },
    rows: [
      { tab: "analysis", covers: "Every digital asset Vista operates — website, tracking, GA4, Respond.io, paid media, agency reporting, social — as raw numbers with findings and opportunities" },
      { tab: "personas", covers: "Four target audience groups and ten personas: profile, pain points, platforms, journey today and with the plan" },
      { tab: "campaigns", covers: "Six content pillars with their angles, 13 campaigns with platform and rationale, indicative monthly topics, advertising rules" },
      {
        tab: "search",
        covers:
          "Where search stands today, SEO/AEO/GEO in plain terms, keyword and page plan, the 16 centres, answer-engine and AI-assistant implementation, technical foundation, content engine, 12-month search roadmap, tools and technologies, KPIs and reporting",
      },
      { tab: "creative", covers: "Sample posts and ads on Vista's identity, the 12 templates, production workflow, what CDS needs from Vista, first-quarter calendars" },
      { tab: "website", covers: "Two website concepts compared with the live site, measurements, recommendation, what is being tightened, the full sitemap" },
      { tab: "roadmap", covers: "Objectives, six phases as durations, Gantt, month by month, team by role, technology in plain terms, KPI ladder, risks and fallbacks" },
    ],
  },
  footer: {
    note: "",
    copyright: "© 2026 Caspian Digital Solutions · Prepared for Vista Eye Specialist",
  },
};

export function getAtPath(obj: unknown, path: string): unknown {
  return path
    .split(".")
    .filter(Boolean)
    .reduce<unknown>((acc, key) => {
      if (acc === null || acc === undefined) return undefined;
      return (acc as Record<string, unknown>)[key];
    }, obj);
}

/** Returns a new object with `value` set at the dotted `path`; never mutates the input. */
export function setAtPath<T>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".").filter(Boolean);
  if (keys.length === 0) return value as T;

  const recurse = (node: unknown, index: number): unknown => {
    const key = keys[index];
    if (index === keys.length - 1) {
      if (Array.isArray(node)) {
        const copy = [...node];
        copy[Number(key)] = value;
        return copy;
      }
      return { ...(node as Record<string, unknown>), [key]: value };
    }
    const child = node ? (node as Record<string, unknown>)[key] : undefined;
    const nextChild = recurse(child ?? {}, index + 1);
    if (Array.isArray(node)) {
      const copy = [...node];
      copy[Number(key)] = nextChild;
      return copy;
    }
    return { ...(node as Record<string, unknown>), [key]: nextChild };
  };

  return recurse(obj, 0) as T;
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Structural check that a submitted document has the same top-level shape as the
 * default content. Editors can change any value, but not remove whole sections.
 */
export function looksLikeContent(value: unknown): value is Content {
  if (!isPlainObject(value)) return false;
  return Object.keys(defaultContent).every((key) => isPlainObject(value[key]));
}
