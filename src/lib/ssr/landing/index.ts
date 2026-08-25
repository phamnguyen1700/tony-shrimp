import { endpoints } from "@/config/endpoints";
import { env } from "@/config/env";
import { highQualityGradeFilter } from "@/lib/shrimp/highQuality";
import type { LandingCollectionKind } from "@/types/landing";
import type { ShrimpListItem, ShrimpListQuery } from "@/types/shrimp";

export interface LandingInitialData {
  initialShrimp: ShrimpListItem[];
  initialCollectionKind: LandingCollectionKind;
}

function uniqueShrimp(items: ShrimpListItem[]) {
  return items.filter(
    (item, index, list) => list.findIndex((candidate) => candidate.id === item.id) === index,
  );
}

async function fetchLandingShrimp(params: ShrimpListQuery) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    searchParams.set(key, String(value));
  }

  const response = await fetch(
    `${env.apiBaseUrl}${endpoints.catalog.shrimp}?${searchParams.toString()}`,
    { next: { revalidate: 60 } },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch landing shrimp: ${response.status}`);
  }

  return response.json() as Promise<ShrimpListItem[]>;
}

export async function getLandingInitialData(): Promise<LandingInitialData> {
  const highQuality = await fetchLandingShrimp({
    limit: 10,
    in_stock: true,
    grade: highQualityGradeFilter,
  });

  if (highQuality.length > 0) {
    return {
      initialShrimp: highQuality,
      initialCollectionKind: "high-quality",
    };
  }

  const [extremelyRare, rare] = await Promise.all([
    fetchLandingShrimp({ limit: 10, in_stock: true, rarity: "extremely rare" }),
    fetchLandingShrimp({ limit: 10, in_stock: true, rarity: "rare" }),
  ]);

  if (extremelyRare.length > 0) {
    return {
      initialShrimp: uniqueShrimp([...extremelyRare, ...rare]),
      initialCollectionKind: "rare",
    };
  }

  return {
    initialShrimp: await fetchLandingShrimp({ limit: 10, in_stock: true }),
    initialCollectionKind: "top",
  };
}
