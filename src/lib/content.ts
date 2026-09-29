export type PillarIcon =
  | "cloud"
  | "shield"
  | "sparkles"
  | "database"
  | "users"
  | "workflow"
  | "chart"
  | "rocket";

export const PILLAR_ICONS: PillarIcon[] = [
  "cloud",
  "shield",
  "sparkles",
  "database",
  "users",
  "workflow",
  "chart",
  "rocket",
];

export type PhaseStatus = "complete" | "in-progress" | "planned";
export const PHASE_STATUSES: PhaseStatus[] = ["complete", "in-progress", "planned"];

export type RiskLevel = "low" | "medium" | "high";
export const RISK_LEVELS: RiskLevel[] = ["low", "medium", "high"];

export interface SectionBase {
  visible: boolean;
  eyebrow: string;
  heading: string;
  intro: string;
}

export interface Content {
  meta: {
    brand: string;
    brandTagline: string;
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
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    highlights: { value: string; label: string }[];
  };
  summary: SectionBase & {
    paragraphs: string[];
    callout: { title: string; body: string };
  };
  metrics: SectionBase & {
    items: { value: string; label: string; detail: string }[];
  };
  pillars: SectionBase & {
    items: {
      icon: PillarIcon;
      title: string;
      description: string;
      outcomes: string[];
    }[];
  };
  roadmap: SectionBase & {
    phases: {
      period: string;
      title: string;
      status: PhaseStatus;
      description: string;
      milestones: string[];
    }[];
  };
  scope: SectionBase & {
    columns: { workstream: string; deliverable: string; owner: string; timeline: string };
    rows: { workstream: string; deliverable: string; owner: string; timeline: string }[];
  };
  investment: SectionBase & {
    tiers: {
      name: string;
      price: string;
      period: string;
      description: string;
      featured: boolean;
      features: string[];
    }[];
    note: string;
  };
  team: SectionBase & {
    members: { initials: string; name: string; role: string; focus: string }[];
  };
  risks: SectionBase & {
    items: { risk: string; level: RiskLevel; impact: string; mitigation: string }[];
  };
  contact: SectionBase & {
    body: string;
    email: string;
    phone: string;
    address: string;
    ctaLabel: string;
  };
  footer: {
    copyright: string;
    disclaimer: string;
  };
}

export interface StoredContent {
  content: Content;
  updatedAt: string | null;
  updatedBy: string | null;
}

export const SECTION_ORDER = [
  "summary",
  "metrics",
  "pillars",
  "roadmap",
  "scope",
  "investment",
  "team",
  "risks",
  "contact",
] as const;

export type SectionKey = (typeof SECTION_ORDER)[number];

export const SECTION_LABELS: Record<SectionKey, string> = {
  summary: "Overview",
  metrics: "Impact",
  pillars: "Pillars",
  roadmap: "Roadmap",
  scope: "Scope",
  investment: "Investment",
  team: "Team",
  risks: "Risks",
  contact: "Contact",
};

export const defaultContent: Content = {
  meta: {
    brand: "Vista",
    brandTagline: "Strategy & Delivery Office",
    docTitle: "Digital Transformation Roadmap",
    docCode: "DTR",
    version: "v4",
    edition: "Client Edition",
    fiscalYear: "FY 2026-27",
    preparedFor: "Client Leadership Team",
    preparedBy: "Vista Strategy & Delivery Office",
    issueDate: "September 2026",
    confidentiality: "Confidential — prepared exclusively for the named client",
  },
  hero: {
    eyebrow: "Digital Transformation Roadmap · FY 2026-27",
    title: "A twelve-month plan to modernise the platform, the data, and the way teams work.",
    subtitle:
      "This Client Edition sets out the strategic pillars, phased roadmap, deliverables, and investment required to move from fragmented legacy systems to a unified, cloud-native operating model by the close of FY 2026-27.",
    primaryCta: "Explore the roadmap",
    secondaryCta: "Download as PDF",
    highlights: [
      { value: "4", label: "Strategic pillars" },
      { value: "12", label: "Months of delivery" },
      { value: "27", label: "Committed milestones" },
      { value: "3.2×", label: "Projected 3-year ROI" },
    ],
  },
  summary: {
    visible: true,
    eyebrow: "Executive summary",
    heading: "Where we are, where we are going, and how we get there",
    intro:
      "Version 4 consolidates the feedback from the steering committee review and confirms the delivery plan for the coming fiscal year.",
    paragraphs: [
      "The current estate runs across eleven loosely connected systems, four of which are past end-of-vendor-support. Manual reconciliation consumes an estimated 1,900 hours per month and limits how quickly the business can launch new services or respond to regulatory change.",
      "The roadmap replaces that estate with a single cloud platform, a governed data layer, and automated workflows that put customer and operational data in one place. Delivery is sequenced in four quarterly phases so that each phase releases measurable value before the next begins.",
      "By the end of FY 2026-27 the organisation will be operating on a modern, secure, and observable platform with the foundations in place for AI-assisted operations in the following fiscal year.",
    ],
    callout: {
      title: "What changed in v4",
      body: "Phase 2 now front-loads identity and access management following the security review; the analytics workstream has been rescoped to deliver the executive dashboard one quarter earlier; and the commercial summary reflects the revised licence pricing agreed in August.",
    },
  },
  metrics: {
    visible: true,
    eyebrow: "Projected impact",
    heading: "Outcomes we are committing to",
    intro:
      "Targets are measured against the FY 2025-26 baseline and reviewed at each quarterly steering checkpoint.",
    items: [
      { value: "42%", label: "Reduction in operating cost", detail: "Infrastructure, licences, and manual effort" },
      { value: "6×", label: "Faster release cadence", detail: "From quarterly to fortnightly production releases" },
      { value: "99.95%", label: "Platform availability", detail: "Backed by a formal SLA and 24×7 monitoring" },
      { value: "< 15 min", label: "Time to insight", detail: "Executive KPIs refreshed near real time" },
      { value: "100%", label: "Systems under single sign-on", detail: "Zero shared credentials by end of Phase 2" },
      { value: "1,900 h", label: "Manual hours removed monthly", detail: "Reconciliation and reporting automated" },
    ],
  },
  pillars: {
    visible: true,
    eyebrow: "Strategic pillars",
    heading: "Four pillars that hold the programme together",
    intro:
      "Every workstream, milestone, and investment line in this document maps back to one of these pillars.",
    items: [
      {
        icon: "cloud",
        title: "Cloud-native platform",
        description:
          "Migrate core workloads to a managed cloud landing zone with infrastructure-as-code, automated scaling, and environment parity from development to production.",
        outcomes: [
          "Legacy data-centre exit completed",
          "Zero-downtime deployment pipeline",
          "Cost visibility per product line",
        ],
      },
      {
        icon: "shield",
        title: "Security & compliance by design",
        description:
          "Embed identity, encryption, and audit controls into the platform so compliance evidence is generated automatically rather than assembled by hand.",
        outcomes: [
          "Single sign-on and MFA for every system",
          "Continuous compliance dashboard",
          "Quarterly penetration testing cadence",
        ],
      },
      {
        icon: "database",
        title: "Trusted data foundation",
        description:
          "Establish a governed data platform with agreed definitions, lineage, and quality rules so that every report reads from the same source of truth.",
        outcomes: [
          "Unified customer and operations data model",
          "Self-service analytics for business teams",
          "Executive dashboard live in Phase 3",
        ],
      },
      {
        icon: "workflow",
        title: "Automated ways of working",
        description:
          "Redesign the highest-volume processes around automation and a shared workflow engine, freeing teams to focus on exceptions and customers.",
        outcomes: [
          "Twelve priority processes automated",
          "Straight-through processing above 80%",
          "Change adoption programme for 600 staff",
        ],
      },
    ],
  },
  roadmap: {
    visible: true,
    eyebrow: "Phased roadmap",
    heading: "Four quarters, four releases of value",
    intro:
      "Each phase closes with a steering-committee gate. Milestones marked complete were delivered during the mobilisation period ahead of FY 2026-27.",
    phases: [
      {
        period: "Q1 · Apr – Jun 2026",
        title: "Mobilise & foundations",
        status: "complete",
        description:
          "Stand up the programme, the cloud landing zone, and the governance model that every later phase depends on.",
        milestones: [
          "Programme charter and steering committee approved",
          "Cloud landing zone live with network, identity, and logging baseline",
          "Target architecture and data model signed off",
          "First two workloads migrated as pilots",
        ],
      },
      {
        period: "Q2 · Jul – Sep 2026",
        title: "Secure & migrate",
        status: "in-progress",
        description:
          "Bring the core systems onto the platform behind a single identity layer while decommissioning the first legacy servers.",
        milestones: [
          "Single sign-on rolled out to all staff",
          "Core operations platform migrated",
          "Legacy data-centre footprint reduced by 50%",
          "Continuous compliance dashboard in production",
        ],
      },
      {
        period: "Q3 · Oct – Dec 2026",
        title: "Data & insight",
        status: "planned",
        description:
          "Activate the governed data platform and put trusted, near-real-time KPIs in front of leadership and operational teams.",
        milestones: [
          "Unified data platform ingesting all core systems",
          "Executive dashboard launched",
          "Self-service analytics enabled for 120 analysts",
          "Six priority processes automated end to end",
        ],
      },
      {
        period: "Q4 · Jan – Mar 2027",
        title: "Scale & optimise",
        status: "planned",
        description:
          "Complete the legacy exit, embed the new ways of working, and prepare the platform for AI-assisted operations in FY 2027-28.",
        milestones: [
          "Legacy data-centre exit completed",
          "Remaining six priority processes automated",
          "Change adoption programme completed for 600 staff",
          "FY 2027-28 AI readiness assessment delivered",
        ],
      },
    ],
  },
  scope: {
    visible: true,
    eyebrow: "Scope & deliverables",
    heading: "What will be delivered, by whom, and when",
    intro:
      "The table summarises the committed deliverables by workstream. Detailed acceptance criteria are held in the delivery plan appendix.",
    columns: {
      workstream: "Workstream",
      deliverable: "Key deliverable",
      owner: "Accountable owner",
      timeline: "Timeline",
    },
    rows: [
      { workstream: "Platform", deliverable: "Cloud landing zone, IaC library, CI/CD pipeline", owner: "Head of Platform Engineering", timeline: "Q1 – Q2" },
      { workstream: "Migration", deliverable: "Eleven workloads migrated; legacy data centre exited", owner: "Migration Lead", timeline: "Q1 – Q4" },
      { workstream: "Security", deliverable: "SSO, MFA, privileged access, continuous compliance", owner: "Chief Information Security Officer", timeline: "Q1 – Q2" },
      { workstream: "Data", deliverable: "Governed data platform and executive dashboard", owner: "Head of Data", timeline: "Q2 – Q3" },
      { workstream: "Automation", deliverable: "Twelve priority processes automated", owner: "Operations Director", timeline: "Q3 – Q4" },
      { workstream: "Change & adoption", deliverable: "Training, champions network, adoption metrics", owner: "Chief People Officer", timeline: "Q2 – Q4" },
    ],
  },
  investment: {
    visible: true,
    eyebrow: "Commercial summary",
    heading: "Investment options for FY 2026-27",
    intro:
      "All figures are indicative, exclusive of taxes, and reflect the licence pricing agreed in August 2026. The recommended option is highlighted.",
    tiers: [
      {
        name: "Foundation",
        price: "$1.4M",
        period: "FY 2026-27",
        description: "Platform, security, and migration workstreams only.",
        featured: false,
        features: [
          "Cloud landing zone and CI/CD",
          "Single sign-on and MFA",
          "Migration of eleven workloads",
          "Quarterly steering reviews",
        ],
      },
      {
        name: "Recommended",
        price: "$2.1M",
        period: "FY 2026-27",
        description: "The full roadmap as described in this document.",
        featured: true,
        features: [
          "Everything in Foundation",
          "Governed data platform and executive dashboard",
          "Twelve automated priority processes",
          "Change and adoption programme for 600 staff",
          "Dedicated delivery director",
        ],
      },
      {
        name: "Accelerated",
        price: "$2.6M",
        period: "FY 2026-27",
        description: "Compresses Phases 3 and 4 into a single quarter.",
        featured: false,
        features: [
          "Everything in Recommended",
          "Parallel data and automation squads",
          "Legacy exit completed one quarter early",
          "AI readiness pilot in Q4",
        ],
      },
    ],
    note:
      "Payment is scheduled quarterly against phase gates. A 10% contingency is held centrally and released only with steering-committee approval.",
  },
  team: {
    visible: true,
    eyebrow: "Governance & team",
    heading: "The people accountable for delivery",
    intro:
      "A joint leadership team meets fortnightly; the steering committee meets at each phase gate and monthly in between.",
    members: [
      { initials: "AR", name: "Anita Rao", role: "Programme Director", focus: "Overall delivery, commercials, and steering committee" },
      { initials: "DM", name: "Daniel Mensah", role: "Chief Architect", focus: "Target architecture, platform, and integration" },
      { initials: "SK", name: "Sofia Klein", role: "Head of Data", focus: "Data platform, governance, and analytics" },
      { initials: "JO", name: "James Okafor", role: "Security Lead", focus: "Identity, compliance, and assurance" },
      { initials: "PL", name: "Priya Lal", role: "Change & Adoption Lead", focus: "Training, communications, and adoption metrics" },
      { initials: "MT", name: "Marcus Thorne", role: "Client Sponsor", focus: "Business priorities and benefits realisation" },
    ],
  },
  risks: {
    visible: true,
    eyebrow: "Risks & mitigations",
    heading: "What could slow us down, and how we will respond",
    intro:
      "The register below lists the top programme-level risks. The full register is reviewed fortnightly by the joint leadership team.",
    items: [
      {
        risk: "Legacy data quality delays the unified data model",
        level: "high",
        impact: "Executive dashboard slips beyond Q3",
        mitigation: "Data profiling started in Q1; dedicated remediation squad; dashboard scoped to release incrementally.",
      },
      {
        risk: "Key-person dependency in legacy systems",
        level: "medium",
        impact: "Migration knowledge lost mid-programme",
        mitigation: "Knowledge-capture sessions recorded in Q1; retention arrangements agreed with named individuals.",
      },
      {
        risk: "Change fatigue across operations teams",
        level: "medium",
        impact: "Adoption targets missed; benefits delayed",
        mitigation: "Champions network, phased rollout, and adoption metrics reviewed monthly by the sponsor.",
      },
      {
        risk: "Cloud cost overrun during dual running",
        level: "low",
        impact: "Contingency consumed early",
        mitigation: "FinOps tagging from day one; weekly cost reviews; decommissioning tied to each migration wave.",
      },
    ],
  },
  contact: {
    visible: true,
    eyebrow: "Next steps",
    heading: "Ready to confirm the plan for FY 2026-27",
    intro: "",
    body:
      "We are seeking approval of the Recommended option at the October steering committee so that Phase 3 mobilises on schedule. The delivery team is available for a walkthrough of any section of this roadmap.",
    email: "dtr@vista.example",
    phone: "+1 (555) 014-2027",
    address: "Vista Strategy & Delivery Office · 400 Harbour Street, Level 12",
    ctaLabel: "Book a walkthrough",
  },
  footer: {
    copyright: "© 2026 Vista. All rights reserved.",
    disclaimer:
      "This document is confidential and intended solely for the named client. Figures are indicative and subject to the terms of the master services agreement.",
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
