import { routes } from "@/config/routes";
import { emptyShopFilters } from "@/lib/shrimpFilters";
import type { ShopFilters, ShrimpListQuery } from "@/types/shrimp";

export interface ShrimpCollectionConfig {
  slug: string;
  navLabel: string;
  title: string;
  heading: string;
  description: string;
  query: ShrimpListQuery;
  filters: ShopFilters;
}

export interface ShrimpCollectionLink {
  slug: string;
  label: string;
  href: string;
}

const collectionBaseFilters = emptyShopFilters;

export const shrimpCollectionConfigs = [
  {
    slug: "rare-shrimp",
    navLabel: "Rare Shrimp",
    title: "Rare Aquarium Shrimp Australia",
    heading: "Rare Shrimp Collection",
    description:
      "Shop rare and extremely rare Caridina and Neocaridina aquarium shrimp from Tony Shrimp in Victoria, Australia. Premium ornamental shrimp for collectors and aquascapers.",
    query: { limit: 24, rarity: "rare,extremely rare" },
    filters: collectionBaseFilters,
  },
  {
    slug: "caridina-shrimp",
    navLabel: "Caridina Shrimp",
    title: "Caridina Shrimp Australia",
    heading: "Caridina Shrimp",
    description:
      "Browse Caridina shrimp for sale in Australia from Tony Shrimp in Victoria, including premium and rare ornamental aquarium shrimp.",
    query: { limit: 24, species: "Caridina" },
    filters: collectionBaseFilters,
  },
  {
    slug: "neocaridina-shrimp",
    navLabel: "Neocaridina Shrimp",
    title: "Neocaridina Shrimp Australia",
    heading: "Neocaridina Shrimp",
    description:
      "Browse Neocaridina shrimp for sale in Australia from Tony Shrimp in Victoria, including colourful ornamental shrimp for planted aquariums.",
    query: { limit: 24, species: "Neocaridina" },
    filters: collectionBaseFilters,
  },
] satisfies ShrimpCollectionConfig[];

export const shrimpCollectionLinks: ShrimpCollectionLink[] = [
  { slug: "", label: "All Shrimp", href: routes.shop },
  ...shrimpCollectionConfigs.map((collection) => ({
    slug: collection.slug,
    label: collection.navLabel,
    href: `${routes.shop}/${collection.slug}`,
  })),
];

export function getShrimpCollectionConfig(slug: string) {
  return shrimpCollectionConfigs.find((collection) => collection.slug === slug);
}

export function getShrimpCollectionStaticParams() {
  return shrimpCollectionConfigs.map((collection) => ({ slug: collection.slug }));
}
