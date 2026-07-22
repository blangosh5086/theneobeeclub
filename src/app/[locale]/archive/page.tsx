import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import ExperienceCard from "@/components/site/ExperienceCard";
import PageIntro from "@/components/site/PageIntro";
import SessionCard from "@/components/site/SessionCard";
import SiteShell from "@/components/site/SiteShell";
import { experiences, isSiteLocale, sessions, siteCopy, socialLinks } from "@/data/site";

export default async function ArchivePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isSiteLocale(locale)) notFound();
  setRequestLocale(locale);
  const copy = siteCopy[locale];

  return (
    <SiteShell locale={locale}>
      <PageIntro eyebrow={copy.archive.eyebrow} title={copy.archive.title} intro={copy.archive.intro} />
      <section className="archive-section section-pad">
        <div className="archive-label"><span>01</span><h2>{copy.archive.sessions}</h2></div>
        <div className="session-grid">{sessions.map((session) => <SessionCard key={session.id} session={session} locale={locale} />)}</div>
      </section>
      <section className="archive-section archive-section--experience section-pad">
        <div className="archive-label"><span>02</span><h2>{copy.club.experiencesTitle}</h2></div>
        <ExperienceCard experience={experiences[0]} locale={locale} />
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
