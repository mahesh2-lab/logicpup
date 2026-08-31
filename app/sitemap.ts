import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use environment variable in production, fallback for safety
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://logicpup.heymahesh.in";
  
  // Use a consistent, cacheable date for static pages when they haven't changed, 
  // or default to now if not available.
  const lastModifiedDate = new Date();

  return [
    {
      url: `${siteUrl}`,
      lastModified: lastModifiedDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: lastModifiedDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: lastModifiedDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/security`,
      lastModified: lastModifiedDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
