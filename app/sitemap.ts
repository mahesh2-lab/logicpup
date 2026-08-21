import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL as string;
  // Using a stable deploy-time date instead of new Date()
  const lastModifiedDate = new Date("2026-08-21T00:00:00Z");

  return [
    {
      url: `${siteUrl}`,
      lastModified: lastModifiedDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/login`,
      lastModified: lastModifiedDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/dashboard/learn`,
      lastModified: lastModifiedDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
