import { experiences, founders, sessions } from "@/data/site";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://theneobee.club";

  const sessionImages = sessions.map((session) => `
    <image:image>
      <image:loc>${baseUrl}${session.image}</image:loc>
      <image:title>${session.title}</image:title>
      <image:caption>The NeoBee Club Session ${session.number}, recorded in Dublin.</image:caption>
    </image:image>`).join("");

  const experienceImages = experiences.map((experience) => `
    <image:image>
      <image:loc>${baseUrl}${experience.image}</image:loc>
      <image:title>${experience.title.en}</image:title>
      <image:caption>The NeoBee Club experience at ${experience.venue}, Dublin.</image:caption>
    </image:image>`).join("");

  const founderImages = founders.map((founder) => `
    <image:image>
      <image:loc>${baseUrl}${founder.image}</image:loc>
      <image:title>${founder.name} — The NeoBee Club</image:title>
      <image:caption>${founder.role.en} at The NeoBee Club.</image:caption>
    </image:image>`).join("");

  const imageSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}/en</loc>
    <image:image>
      <image:loc>${baseUrl}/logo.webp</image:loc>
      <image:title>The NeoBee Club</image:title>
      <image:caption>Dublin-based creative collective exploring sound, space, and culture.</image:caption>
    </image:image>
    <image:image>
      <image:loc>${baseUrl}/neobee-social-card.png</image:loc>
      <image:title>The NeoBee Club — Sound. Space. Culture.</image:title>
      <image:caption>Editorial social artwork for The NeoBee Club.</image:caption>
    </image:image>
    ${founderImages}
  </url>
  <url>
    <loc>${baseUrl}/en/archive</loc>${sessionImages}
    ${experienceImages}
  </url>
  <url>
    <loc>${baseUrl}/zh/archive</loc>${sessionImages}
    ${experienceImages}
  </url>
</urlset>`;

  return new Response(imageSitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400"
    }
  });
}
