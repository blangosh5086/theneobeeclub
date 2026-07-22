import { sessions } from "@/data/site";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://theneobee.club";

  const entries = (["en", "zh"] as const).flatMap((locale) =>
    sessions.map((session) => {
      const videoId = new URL(session.youtube).searchParams.get("v");
      const description = session.description[locale];

      return `
  <url>
    <loc>${baseUrl}/${locale}/archive#${session.id}</loc>
    <video:video>
      <video:thumbnail_loc>${baseUrl}${session.image}</video:thumbnail_loc>
      <video:title>${session.title}</video:title>
      <video:description>${description}</video:description>
      <video:content_loc>${session.youtube}</video:content_loc>
      <video:player_loc>https://www.youtube.com/embed/${videoId}</video:player_loc>
      <video:duration>${session.durationSeconds}</video:duration>
      <video:publication_date>${session.uploadDate}T00:00:00Z</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:live>no</video:live>
      <video:category>Music</video:category>
      <video:uploader info="${baseUrl}">The NeoBee Club</video:uploader>
    </video:video>
  </url>`;
    })
  ).join("");

  const videoSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">${entries}
</urlset>`;

  return new Response(videoSitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400"
    }
  });
}
