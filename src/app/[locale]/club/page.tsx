import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import ExperienceCard from "@/components/site/ExperienceCard";
import PageIntro from "@/components/site/PageIntro";
import SessionCard from "@/components/site/SessionCard";
import SiteShell from "@/components/site/SiteShell";
import { experiences, isSiteLocale, sessions, siteCopy } from "@/data/site";

export default async function ClubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isSiteLocale(locale)) notFound();
  setRequestLocale(locale);
  const copy = siteCopy[locale];

  const practices = [
    ["01", copy.club.sessionsTitle, copy.club.sessionsBody],
    ["02", copy.club.experiencesTitle, copy.club.experiencesBody],
    ["03", copy.club.collaborationTitle, copy.club.collaborationBody],
    ["04", copy.club.experimentTitle, copy.club.experimentBody]
  ];

  return (
    <SiteShell locale={locale}>
      <PageIntro eyebrow={copy.club.eyebrow} title={copy.club.title} intro={copy.club.intro} />
      <section className="manifesto section-pad"><p>{copy.club.statement}</p></section>
      <section className="page-sessions section-pad">
        <div className="section-heading"><p className="eyebrow">{copy.club.sessionsTitle}</p><h2>{copy.home.sessionsTitle}</h2></div>
        <div className="session-grid">{sessions.map((session) => <SessionCard key={session.id} session={session} locale={locale} />)}</div>
      </section>
      <section className="club-experience section-pad">
        <div className="section-heading"><p className="eyebrow">{copy.club.experiencesTitle}</p><h2>{copy.home.experienceTitle}</h2></div>
        <ExperienceCard experience={experiences[0]} locale={locale} />
      </section>
      <section className="practice-list section-pad">
        {practices.map(([number, title, body]) => (
          <article key={number}><span>{number}</span><h2>{title}</h2><p>{body}</p></article>
        ))}
      </section>
      <section className="final-cta section-pad">
        <p className="eyebrow">{copy.nav.contact}</p><h2>{copy.club.contactTitle}</h2>
        <Link className="button button--solid" href={`/${locale}/contact`}>{copy.nav.contact} <span>→</span></Link>
      </section>
    </SiteShell>
  );
}
