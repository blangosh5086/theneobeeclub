import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import ExperienceCard from "@/components/site/ExperienceCard";
import HomeHeroMotion from "@/components/site/HomeHeroMotion";
import SessionCard from "@/components/site/SessionCard";
import SiteShell from "@/components/site/SiteShell";
import { experiences, founders, isSiteLocale, sessions, siteCopy, socialLinks } from "@/data/site";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isSiteLocale(locale)) notFound();
  setRequestLocale(locale);
  const copy = siteCopy[locale];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The NeoBee Club",
    description: copy.home.aboutBody,
    foundingLocation: { "@type": "Place", name: "Dublin", addressCountry: "IE" },
    url: `https://theneobee.club/${locale}`,
    logo: "https://theneobee.club/logo.webp",
    email: "theneobeeclub@gmail.com",
    founder: founders.map((founder) => ({
      "@type": "Person",
      name: founder.name,
      sameAs: founder.socials.map((social) => social.href)
    })),
    sameAs: [socialLinks.instagram, socialLinks.youtube]
  };
  const featuredExperience = experiences[0];
  const eventStructuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: featuredExperience.title[locale],
    description: featuredExperience.description[locale],
    startDate: "2026-06-28T18:00:00+01:00",
    endDate: "2026-06-28T19:00:00+01:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: `https://theneobee.club${featuredExperience.image}`,
    location: {
      "@type": "Place",
      name: featuredExperience.venue,
      address: featuredExperience.address
    },
    url: featuredExperience.href
  };

  return (
    <SiteShell locale={locale}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventStructuredData) }} />

      <section className="home-hero section-pad">
        <p className="home-hero__eyebrow eyebrow">{copy.home.eyebrow}</p>
        <div className="home-hero__motion">
          <HomeHeroMotion locale={locale} title={copy.home.title} />
        </div>
        <div className="home-hero__copy">
          <p className="home-hero__intro">{copy.home.intro}</p>
          <div className="button-row">
            <Link className="button button--solid" href={`/${locale}/club`}>{copy.home.clubCta} <span>→</span></Link>
            <Link className="button button--line" href={`/${locale}/studio`}>{copy.home.studioCta} <span>→</span></Link>
          </div>
        </div>
        <div className="home-hero__art" aria-hidden="true">
          <div className="home-hero__disc"></div>
          <Image src="/logo.webp" fill priority alt="" sizes="(max-width: 820px) 84vw, 42vw" />
          <span className="art-note art-note--top">NEOBEE / DUBLIN</span>
          <span className="art-note art-note--bottom">INDEPENDENT SINCE 2024</span>
        </div>
        <div className="home-hero__index" aria-hidden="true">NB—01</div>
      </section>

      <section className="feature-section section-pad">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">{copy.home.featureEyebrow}</p>
            <h2>{copy.home.featureTitle}</h2>
          </div>
          <p>{copy.home.featureBody}</p>
        </div>
        <SessionCard session={sessions[0]} locale={locale} featured />
      </section>

      <section className="branches-section section-pad">
        <div className="section-heading">
          <p className="eyebrow">{copy.home.branchesEyebrow}</p>
          <h2>{copy.home.branchesTitle}</h2>
        </div>
        <div className="branch-grid">
          <Link href={`/${locale}/club`} className="branch-card branch-card--dark">
            <div className="branch-card__image"><Image className="branch-card__portrait branch-card__portrait--hao" src="/haosc.webp" alt="Hao — music and artistic direction at NeoBee Club" fill sizes="(max-width: 760px) 100vw, 50vw" /></div>
            <div className="branch-card__body">
              <span className="branch-card__number">01</span>
              <h3>{copy.home.clubTitle}</h3>
              <p>{copy.home.clubBody}</p>
              <span className="text-link">{copy.common.explore} →</span>
            </div>
          </Link>
          <Link href={`/${locale}/studio`} className="branch-card branch-card--accent">
            <div className="branch-card__image"><Image className="branch-card__portrait branch-card__portrait--leo" src="/leo.webp" alt="Leo — visual and creative production at NeoBee Studio" fill sizes="(max-width: 760px) 100vw, 50vw" /></div>
            <div className="branch-card__body">
              <span className="branch-card__number">02</span>
              <h3>{copy.home.studioTitle}</h3>
              <p>{copy.home.studioBody}</p>
              <span className="text-link">{copy.common.explore} →</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="sessions-section section-pad">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">{copy.home.sessionsEyebrow}</p>
            <h2>{copy.home.sessionsTitle}</h2>
          </div>
          <Link className="text-link" href={`/${locale}/archive`}>{copy.common.viewAll} →</Link>
        </div>
        <div className="session-grid">
          {sessions.map((session) => <SessionCard key={session.id} session={session} locale={locale} />)}
        </div>
      </section>

      <section className="experience-feature section-pad">
        <div className="section-heading section-heading--split">
          <div>
          <p className="eyebrow">{copy.home.experienceEyebrow}</p>
          <h2>{copy.home.experienceTitle}</h2>
          </div>
          <p>{copy.home.experienceBody}</p>
        </div>
        <ExperienceCard experience={featuredExperience} locale={locale} />
      </section>

      <section className="studio-preview section-pad">
        <div className="studio-preview__copy">
          <p className="eyebrow">{copy.home.studioEyebrow}</p>
          <h2>{copy.home.studioPreviewTitle}</h2>
          <p>{copy.home.studioPreviewBody}</p>
          <Link className="button button--line" href={`/${locale}/studio`}>{copy.home.studioCta} <span>→</span></Link>
        </div>
        <div className="studio-preview__images">
          <div className="studio-shot studio-shot--one"><Image src="/yunnan-menu-sp404-set.webp" alt="NeoBee event documentation in Dublin" fill sizes="(max-width: 760px) 70vw, 30vw" /></div>
          <div className="studio-shot studio-shot--two"><Image src="/session-jazzy-house.jpg" alt="NeoBee session film still" fill sizes="(max-width: 760px) 55vw, 24vw" /></div>
          <span>IMAGE / MOTION / SPACE</span>
        </div>
      </section>

      <section className="ghostframe-section section-pad">
        <div className="ghostframe-visual" aria-hidden="true">
          <div className="ghostframe-visual__frame ghostframe-visual__frame--a"></div>
          <div className="ghostframe-visual__frame ghostframe-visual__frame--b"></div>
          <div className="ghostframe-visual__frame ghostframe-visual__frame--c"></div>
          <span>GHOST / FRAME / 001</span>
        </div>
        <div className="ghostframe-section__copy">
          <p className="eyebrow">{copy.home.experimentEyebrow}</p>
          <h2>{copy.home.experimentTitle}</h2>
          <p>{copy.home.experimentBody}</p>
          <a className="text-link" href={`${socialLinks.ghostframe}/?locale=${locale}&source=neobee`} target="_blank" rel="noreferrer">
            {copy.common.explore} Ghostframe ↗
          </a>
        </div>
      </section>

      <section className="about-strip section-pad">
        <div>
          <p className="eyebrow">{copy.home.aboutEyebrow}</p>
          <h2>{copy.home.aboutTitle}</h2>
        </div>
        <div>
          <p>{copy.home.aboutBody}</p>
          <Link className="text-link" href={`/${locale}/about`}>{copy.nav.about} →</Link>
        </div>
      </section>

      <section className="final-cta section-pad">
        <p className="eyebrow">{copy.common.dublin}</p>
        <h2>{copy.home.finalTitle}</h2>
        <p>{copy.home.finalBody}</p>
        <Link className="button button--solid" href={`/${locale}/contact`}>{copy.nav.contact} <span>→</span></Link>
      </section>
    </SiteShell>
  );
}
