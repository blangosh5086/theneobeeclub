import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import ExperienceCard from "@/components/site/ExperienceCard";
import PageIntro from "@/components/site/PageIntro";
import PageSeo from "@/components/site/PageSeo";
import SessionCard from "@/components/site/SessionCard";
import SiteShell from "@/components/site/SiteShell";
import { experiences, isSiteLocale, sessions, siteCopy, socialLinks } from "@/data/site";
import { generatePageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return generatePageMetadata(params, "archive");
}

export default async function ArchivePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isSiteLocale(locale)) notFound();
  setRequestLocale(locale);
  const copy = siteCopy[locale];
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://theneobee.club";
  const videoStructuredData = {
    "@context": "https://schema.org",
    "@graph": sessions.map((session) => {
      const videoId = new URL(session.youtube).searchParams.get("v");

      return {
        "@type": "VideoObject",
        "@id": `${baseUrl}/${locale}/archive#${session.id}`,
        name: session.title,
        description: session.description[locale],
        thumbnailUrl: [`${baseUrl}${session.image}`],
        uploadDate: `${session.uploadDate}T00:00:00Z`,
        duration: `PT${Math.floor(session.durationSeconds / 3600)}H${Math.floor((session.durationSeconds % 3600) / 60)}M${session.durationSeconds % 60}S`,
        contentUrl: session.youtube,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        inLanguage: locale,
        ...(session.recordedDate ? { dateCreated: session.recordedDate } : {}),
        ...(session.performer ? { actor: { "@type": "Person", name: session.performer } } : {}),
        ...(session.venue ? {
          locationCreated: {
            "@type": "Place",
            name: session.venue.name,
            url: session.venue.url,
            address: {
              "@type": "PostalAddress",
              addressLocality: "Dublin",
              addressCountry: "IE"
            }
          }
        } : {})
      };
    })
  };

  return (
    <SiteShell locale={locale}>
      <PageSeo locale={locale} page="archive" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoStructuredData) }} />
      <PageIntro eyebrow={copy.archive.eyebrow} title={copy.archive.title} intro={copy.archive.intro} />
      <section className="archive-section section-pad">
        <div className="archive-label"><span>01</span><h2>{copy.archive.sessions}</h2></div>
        <div className="session-grid">
          {sessions.map((session, index) => (
            <SessionCard key={session.id} session={session} locale={locale} priority={index === 0} />
          ))}
        </div>
      </section>
      <section className="archive-section archive-section--experience section-pad">
        <div className="archive-label"><span>02</span><h2>{copy.club.experiencesTitle}</h2></div>
        {experiences.map((experience) => <ExperienceCard key={experience.id} experience={experience} locale={locale} />)}
      </section>
      <section className="archive-section archive-section--dark section-pad">
        <div className="archive-label"><span>03</span><h2>{copy.archive.experiments}</h2></div>
        <a className="archive-experiment" href={`${socialLinks.ghostframe}/?locale=${locale}&source=neobee`} target="_blank" rel="noreferrer">
          <div className="ghostframe-visual" aria-hidden="true"><div className="ghostframe-visual__frame ghostframe-visual__frame--a"></div><div className="ghostframe-visual__frame ghostframe-visual__frame--b"></div><div className="ghostframe-visual__frame ghostframe-visual__frame--c"></div></div>
          <div><p className="eyebrow">{copy.archive.ghostframeMeta}</p><h3>{copy.archive.ghostframeTitle}</h3><p>{copy.archive.ghostframeBody}</p><span className="text-link">{copy.common.explore} ↗</span></div>
        </a>
      </section>
    </SiteShell>
  );
}
