import { MetadataRoute } from "next";
import { getProjectSlugs } from "@/lib/sanity.loader";
import { siteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  try {
    const projectSlugs = await getProjectSlugs();
    if (projectSlugs && projectSlugs.length > 0) {
      const dynamicRoutes = projectSlugs.map((p) => ({
        url: `${baseUrl}/projects/${p.slug}`,
        lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
      return [...staticRoutes, ...dynamicRoutes];
    }
  } catch (error) {
    console.error("Error fetching project slugs for sitemap:", error);
  }

  return staticRoutes;
}
