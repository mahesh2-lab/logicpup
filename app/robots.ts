import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = "https://logicpup.heymahesh.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/login/"],
      },
      {
        userAgent: ["GPTBot", "CCBot", "Google-Extended", "PerplexityBot"],
        disallow: ["/"],
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
