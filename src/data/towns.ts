export interface TownConfig {
  name: string;
  fullName: string;
  slug: string;
  county: string;
  updated: string;
  source: string;
}

export const towns: Record<string, TownConfig> = {
  ridgewood: {
    name: "Ridgewood",
    fullName: "Village of Ridgewood",
    slug: "ridgewood",
    county: "Bergen",
    updated: "Jan 15, 2026",
    source: "Ridgewood Village Code",
  },
  paramus: {
    name: "Paramus",
    fullName: "Borough of Paramus",
    slug: "paramus",
    county: "Bergen",
    updated: "Jan 10, 2026",
    source: "Paramus Borough Code",
  },
};

export function getTown(slug: string): TownConfig {
  return towns[slug] || towns.ridgewood;
}
