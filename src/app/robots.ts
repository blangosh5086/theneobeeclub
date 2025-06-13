import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://theneobee.club";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/private/", "/_next/", "/api/"]
    },
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/video-sitemap.xml`, `${baseUrl}/image-sitemap.xml`]
  };
}
