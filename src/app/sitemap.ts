import type { MetadataRoute } from "next";

import { routes } from "@/config/routes";
import { absoluteUrl } from "@/lib/seo";
import { shrimpCollectionConfigs } from "@/lib/ssr/collection";
import { shrimpService } from "@/services/shrimp";
import type { ShrimpListItem } from "@/types/shrimp";

export const dynamic = "force-dynamic";

const sitemapPageSize = 100;
const weekly = "weekly" satisfies MetadataRoute.Sitemap[number]["changeFrequency"];
const monthly = "monthly" satisfies MetadataRoute.Sitemap[number]["changeFrequency"];
const daily = "daily" satisfies MetadataRoute.Sitemap[number]["changeFrequency"];

const primaryPublicRoutes: MetadataRoute.Sitemap = [
  {
    url: absoluteUrl(routes.home),
    changeFrequency: daily,
    priority: 1,
  },
];

const mainNavigationRoutes: MetadataRoute.Sitemap = [
  {
    url: absoluteUrl(routes.shop),
    changeFrequency: daily,
    priority: 0.9,
  },
  {
    url: absoluteUrl("/about"),
    changeFrequency: monthly,
    priority: 0.5,
  },
];

const collectionRoutes: MetadataRoute.Sitemap = shrimpCollectionConfigs.map(
  (collection) => ({
    url: absoluteUrl(`${routes.shop}/${collection.slug}`),
    changeFrequency: weekly,
    priority: 0.75,
  }),
);

const publicRouteSections = [
  primaryPublicRoutes,
  mainNavigationRoutes,
  collectionRoutes,
] satisfies MetadataRoute.Sitemap[];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publicRoutes = publicRouteSections.flat();

  try {
    const activeShrimp: ShrimpListItem[] = [];
    let offset = 0;

    while (true) {
      const page = await shrimpService.listShrimp({
        limit: sitemapPageSize,
        offset,
      });
      activeShrimp.push(
        ...page.filter((item) => item.catalog_status === "active"),
      );

      if (page.length < sitemapPageSize) break;
      offset += sitemapPageSize;
    }

    const productRoutes: MetadataRoute.Sitemap = activeShrimp.map((item) => ({
      url: absoluteUrl(routes.product(item.slug)),
      ...(item.updated_at
        ? {
            lastModified: new Date(item.updated_at),
          }
        : {}),
      changeFrequency: weekly,
      priority: 0.7,
    }));

    return [...publicRoutes, ...productRoutes];
  } catch {
    return publicRoutes;
  }
}
