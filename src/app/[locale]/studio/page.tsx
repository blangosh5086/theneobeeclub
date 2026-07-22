import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import PageIntro from "@/components/site/PageIntro";
import SiteShell from "@/components/site/SiteShell";
import { isSiteLocale, sessions, siteCopy } from "@/data/site";

export default async function StudioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isSiteLocale(locale)) notFound();
  setRequestLocale(locale);
  const copy = siteCopy[locale];
  const services = [
    ["01", copy.studio.servicePhoto, copy.studio.servicePhotoBody],
    ["02", copy.studio.serviceFilm, copy.studio.serviceFilmBody],
    ["03", copy.studio.serviceDirection, copy.studio.serviceDirectionBody]
  ];

  return (
    <SiteShell locale={locale}>
      <PageIntro eyebrow={copy.studio.eyebrow} title={copy.studio.title} intro={copy.studio.intro} />
      <section className="studio-lead section-pad">
        <div className="studio-lead__image"><Image src="/session-funky-house.jpg" alt="NeoBee live session documentation" fill priority sizes="(max-width: 760px) 100vw, 48vw" /></div>
        <div className="studio-lead__note"><p className="eyebrow">Studio / Dublin</p><p>{copy.studio.note}</p></div>
      </section>
      <section className="services-section section-pad">
        <div className="section-heading"><p className="eyebrow">{copy.studio.servicesEyebrow}</p><h2>{copy.studio.servicesTitle}</h2></div>
        <div className="services-grid">
          {services.map(([number, title, body]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}
        </div>
      </section>
      <section className="portfolio-direction section-pad">
        <div className="portfolio-direction__copy">
          <p className="eyebrow">{copy.studio.selectedEyebrow}</p><h2>{copy.studio.selectedTitle}</h2><p>{copy.studio.selectedBody}</p>
        </div>
        <div className="portfolio-grid">
          {sessions.map((session) => (
            <a href={session.youtube} target="_blank" rel="noreferrer" key={session.id} className="portfolio-image">
              <Image src={session.image} alt={`${session.title} film still`} fill sizes="(max-width: 760px) 100vw, 50vw" />
              <span>{session.title} ↗</span>
            </a>
          ))}
        </div>
      </section>
      <section className="final-cta section-pad">
        <p className="eyebrow">NeoBee Studio</p><h2>{copy.studio.contactTitle}</h2>
        <Link className="button button--solid" href={`/${locale}/contact`}>{copy.nav.contact} <span>→</span></Link>
      </section>
    </SiteShell>
  );
}
