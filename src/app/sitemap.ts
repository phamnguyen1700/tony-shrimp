import type { MetadataRoute } from "next";
import { shrimpService } from "@/services/shrimp";
import { routes } from "@/config/routes";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl(routes.shop),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/about"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    const shrimp = await shrimpService.listShrimp({ limit: 500 });

    console.log("[SITEMAP] fetched:", shrimp.length);

    console.log(
      "[SITEMAP] products:",
      shrimp.map((item) => ({
        name: item.name,
        slug: item.slug,
        status: item.catalog_status,
      })),
    );

    const activeShrimp = shrimp.filter(
      (item) => item.catalog_status === "active",
    );

    console.log("[SITEMAP] active:", activeShrimp.length);

    const productRoutes: MetadataRoute.Sitemap = activeShrimp.map((item) => ({
      url: absoluteUrl(routes.product(item.slug)),
      ...(item.updated_at ? { lastModified: new Date(item.updated_at) } : {}),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes];
  } catch (error) {
    console.error("[SITEMAP] FAILED:", error);

    return staticRoutes;
  }
}
