export interface TownConfig {
  name: string;
  fullName: string;
  slug: string;
  county: string;
  updated: string;
  source: string;
}

export const towns: Record<string, TownConfig> = {
  ridgewood: { name: "Ridgewood", fullName: "Village of Ridgewood", slug: "ridgewood", county: "Bergen", updated: "Jan 15, 2026", source: "Ridgewood Village Code" },
  paramus: { name: "Paramus", fullName: "Borough of Paramus", slug: "paramus", county: "Bergen", updated: "Jan 10, 2026", source: "Paramus Borough Code" },
  hackensack: { name: "Hackensack", fullName: "City of Hackensack", slug: "hackensack", county: "Bergen", updated: "Feb 5, 2026", source: "Hackensack City Code" },
  "fort-lee": { name: "Fort Lee", fullName: "Borough of Fort Lee", slug: "fort-lee", county: "Bergen", updated: "Feb 1, 2026", source: "Fort Lee Borough Code" },
  teaneck: { name: "Teaneck", fullName: "Township of Teaneck", slug: "teaneck", county: "Bergen", updated: "Jan 28, 2026", source: "Teaneck Township Code" },
  englewood: { name: "Englewood", fullName: "City of Englewood", slug: "englewood", county: "Bergen", updated: "Jan 20, 2026", source: "Englewood City Code" },
  "glen-rock": { name: "Glen Rock", fullName: "Borough of Glen Rock", slug: "glen-rock", county: "Bergen", updated: "Jan 18, 2026", source: "Glen Rock Borough Code" },
};

export function getTown(slug: string): TownConfig {
  return towns[slug] || towns.ridgewood;
}
