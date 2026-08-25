import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import { shrimpService } from "@/services/shrimp";
import type { ShrimpCollectionConfig } from "@/lib/shrimp/collectionConfig";
import type { ShrimpListItem, ShrimpListQuery } from "@/types/shrimp";

export {
  getShrimpCollectionConfig,
  getShrimpCollectionStaticParams,
  shrimpCollectionConfigs,
  type ShrimpCollectionConfig,
} from "@/lib/shrimp/collectionConfig";

export const catalogInitialQuery = {
  limit: 24,
} satisfies ShrimpListQuery;

export function createCatalogMetadata(): Metadata {
  return createPageMetadata({
    title: "Aquarium Shrimp Australia | Caridina & Neocaridina",
    description:
      "Shop quality ornamental freshwater shrimp from Tony Shrimp in Victoria, Australia, including Caridina, Neocaridina and limited rare varieties.",
    path: "/aquarium-shrimp",
  });
}

export function createShrimpCollectionMetadata(collection: ShrimpCollectionConfig): Metadata {
  return createPageMetadata({
    title: collection.title,
    description: collection.description,
    path: `/aquarium-shrimp/${collection.slug}`,
  });
}

export async function getCatalogInitialProducts(): Promise<ShrimpListItem[]> {
  return shrimpService.listShrimp(catalogInitialQuery);
}

export async function getShrimpCollectionInitialProducts(
  collection: ShrimpCollectionConfig,
): Promise<ShrimpListItem[]> {
  return shrimpService.listShrimp(collection.query);
}
