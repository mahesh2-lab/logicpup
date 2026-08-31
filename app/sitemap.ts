import type { MetadataRoute } from "next";

export async function generateSitemaps() {
  // Currently we only have one sitemap bucket for static routes.
  // As content grows (e.g., > 50,000 URLs), expand this array to [{ id: 0 }, { id: 1 }, ...].
  return [{ id: 0 }];
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  // Use environment variable in production, fallback for safety
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://logicpup.heymahesh.in";
  
  // Use a consistent, cacheable date for static pages when they haven't changed, 
  // or default to now if not available.
  const lastModifiedDate = new Date();

  // Bucket 0: Static Marketing Pages
  if (id === 0) {
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

  // Bucket 1+: Dynamic Pages (e.g., public tutorials, blog posts, public projects)
  // Example for future scale:
  // if (id === 1) {
  //   const posts = await getPostsForSitemap(id); // Fetch posts with offset/limit
  //   return posts.map(post => ({ url: `${siteUrl}/blog/${post.slug}`, lastModified: post.updatedAt, ... }));
  // }

  return [];
}
