import { shrimpService } from "@/services/shrimp";
import type { ShrimpListItem } from "@/types/shrimp";

export interface LandingInitialData {
  initialShrimp: ShrimpListItem[];
  initialIsRareCollection: boolean;
}

function uniqueShrimp(items: ShrimpListItem[]) {
  return items.filter(
    (item, index, list) => list.findIndex((candidate) => candidate.id === item.id) === index,
  );
}

export async function getLandingInitialData(): Promise<LandingInitialData> {
  const [extremelyRare, rare] = await Promise.all([
    shrimpService.listShrimp({ limit: 10, in_stock: true, rarity: "extremely rare" }),
    shrimpService.listShrimp({ limit: 10, in_stock: true, rarity: "rare" }),
  ]);
  const priorityShrimp = uniqueShrimp([...extremelyRare, ...rare]);

  if (priorityShrimp.length > 0) {
    return {
      initialShrimp: priorityShrimp,
      initialIsRareCollection: true,
    };
  }

  return {
    initialShrimp: await shrimpService.listShrimp({ limit: 10, in_stock: true }),
    initialIsRareCollection: false,
  };
}
