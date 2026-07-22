import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import PageIntro from "@/components/site/PageIntro";
import SiteShell from "@/components/site/SiteShell";
import { founders, isSiteLocale, siteCopy } from "@/data/site";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isSiteLocale(locale)) notFound();
  setRequestLocale(locale);
  const copy = siteCopy[locale];

  return (
    <SiteShell locale={locale}>
      <PageIntro eyebrow={copy.about.eyebrow} title={copy.about.title} intro={copy.about.intro} />
      <section className="about-narrative section-pad">
        <article><span>01</span><h2>{copy.about.originTitle}</h2><p>{copy.about.originBody}</p></article>
        <article><span>02</span><h2>{copy.about.visionTitle}</h2><p>{copy.about.visionBody}</p></article>
      </section>
      <section className="founders-section section-pad">
        <div className="section-heading">
          <p className="eyebrow">{copy.about.peopleEyebrow}</p>
          <h2>{copy.about.peopleTitle}</h2>
        </div>
        <div className="founder-grid">
          {founders.map((founder) => (
            <article className="founder-card" key={founder.id}>
              <div className="founder-card__image">
                <Image src={founder.image} alt={`${founder.name} — The NeoBee Club`} fill sizes="(max-width: 760px) 100vw, 50vw" />
              </div>
              <div className="founder-card__copy">
                <p className="eyebrow">{founder.role[locale]}</p>
                <h3>{founder.name}</h3>
                <p>{founder.bio[locale]}</p>
                <div className="founder-card__socials" aria-label={`${founder.name} social links`}>
                  {founder.socials.map((social) => (
                    <a href={social.href} key={social.label} target="_blank" rel="noreferrer">
                      {social.label} <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
