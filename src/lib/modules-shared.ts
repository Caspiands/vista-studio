export const MODULE_KEYS = ["analysis", "personas", "campaigns", "search", "creatives", "website", "roadmap"] as const;
export type ModuleKey = (typeof MODULE_KEYS)[number];

export const MODULE_LABELS: Record<ModuleKey, string> = {
  analysis: "Vista Today",
  personas: "Audiences",
  campaigns: "Content",
  search: "SEO · AEO · GEO",
  creatives: "Creatives",
  website: "Technical",
  roadmap: "Roadmap",
};

export function isModuleKey(value: string): value is ModuleKey {
  return (MODULE_KEYS as readonly string[]).includes(value);
}

export type ModuleData = Record<string, unknown>;

export interface ModuleDocument {
  key: ModuleKey;
  template: string;
  data: ModuleData;
  /** True when the published version differs from the imported original. */
  customised: boolean;
  updatedAt: string | null;
  updatedBy: string | null;
}
