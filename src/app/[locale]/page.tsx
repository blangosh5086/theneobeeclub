import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import ExperienceCard from "@/components/site/ExperienceCard";
import HomeHeroMotion from "@/components/site/HomeHeroMotion";
import HomePageIndex from "@/components/site/HomePageIndex";
import SessionCard from "@/components/site/SessionCard";
import SiteShell from "@/components/site/SiteShell";
import { experiences, founders, isSiteLocale, sessions, siteCopy, socialLinks } from "@/data/site";
import { generatePageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return generatePageMetadata(params, "home");
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isSiteLocale(locale)) notFound();
  setRequestLocale(locale);
  const copy = siteCopy[locale];
  const featuredExperience = experiences[0];

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://theneobee.club";
  const organizationId = `${baseUrl}/#organization`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: "The NeoBee Club",
        alternateName: "NeoBee",
        description: copy.home.aboutBody,
        foundingDate: "2024",
        foundingLocation: { "@type": "Place", name: "Dublin", addressCountry: "IE" },
        address: { "@type": "PostalAddress", addressLocality: "Dublin", addressCountry: "IE" },
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/logo.webp`
        },
        email: "theneobeeclub@gmail.com",
        founder: founders.map((founder) => ({
          "@type": "Person",
          name: founder.name,
          sameAs: founder.socials.map((social) => social.href)
        })),
        sameAs: [socialLinks.instagram, socialLinks.youtube]
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "The NeoBee Club",
        inLanguage: ["en", "zh"],
        publisher: { "@id": organizationId }
      }
    ]
  };

  return (
    <SiteShell locale={locale}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

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

      <HomePageIndex locale={locale} />

      <section className="branches-section section-pad" id="practices">
        <div className="section-heading">
          <p className="eyebrow">{copy.home.branchesEyebrow}</p>
          <h2>{copy.home.branchesTitle}</h2>
        </div>
        <div className="branch-grid">
          <Link href={`/${locale}/club`} className="branch-card branch-card--dark">
            <div className="branch-card__image"><Image className="branch-card__portrait branch-card__portrait--hao" src="/haosc.webp" alt={locale === "zh" ? "Hao — NeoBee Club 音乐与艺术方向" : "Hao — music and artistic direction at NeoBee Club"} fill sizes="(max-width: 760px) 100vw, 50vw" /></div>
            <div className="branch-card__body">
              <span className="branch-card__number">01</span>
              <h3>{copy.home.clubTitle}</h3>
              <p>{copy.home.clubBody}</p>
              <span className="text-link">{copy.common.explore} →</span>
            </div>
          </Link>
          <Link href={`/${locale}/studio`} className="branch-card branch-card--accent">
            <div className="branch-card__image"><Image className="branch-card__portrait branch-card__portrait--leo" src="/leo.webp" alt={locale === "zh" ? "Leo — NeoBee Studio 视觉与创意制作" : "Leo — visual and creative production at NeoBee Studio"} fill sizes="(max-width: 760px) 100vw, 50vw" /></div>
            <div className="branch-card__body">
              <span className="branch-card__number">02</span>
              <h3>{copy.home.studioTitle}</h3>
              <p>{copy.home.studioBody}</p>
              <span className="text-link">{copy.common.explore} →</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="sessions-section sessions-section--home section-pad" id="sessions">
        <div className="section-heading section-heading--split home-feature-heading">
          <div>
            <p className="eyebrow">{copy.home.featureEyebrow}</p>
            <h2 className={locale === "zh" ? "feature-title-phrases" : undefined}>
              {locale === "zh"
                ? copy.home.featureTitle.split("，").map((phrase, index, phrases) => (
                    <span key={`${phrase}-${index}`}>{phrase}{index < phrases.length - 1 ? "，" : ""}</span>
                  ))
                : copy.home.featureTitle}
            </h2>
          </div>
          <p>{copy.home.featureBody}</p>
        </div>
        <SessionCard session={sessions[0]} locale={locale} featured />

        <div className="home-session-archive">
          <div className="home-session-archive__intro">
            <p className="eyebrow">{copy.home.sessionsEyebrow}</p>
            <h2>{copy.home.sessionsTitle}</h2>
            <Link className="text-link" href={`/${locale}/archive`}>{copy.common.viewAll} →</Link>
          </div>
          <div className="session-grid session-grid--home">
            {sessions.slice(1).map((session) => <SessionCard key={session.id} session={session} locale={locale} />)}
          </div>
        </div>
      </section>

      <section className="experience-feature section-pad" id="experiences">
        <div className="section-heading section-heading--split">
          <div>
          <p className="eyebrow">{copy.home.experienceEyebrow}</p>
          <h2>{copy.home.experienceTitle}</h2>
          </div>
          <p>{copy.home.experienceBody}</p>
        </div>
        <ExperienceCard experience={featuredExperience} locale={locale} compact />
      </section>

      <section className="studio-preview section-pad" id="studio">
        <div className="studio-preview__copy">
          <p className="eyebrow">{copy.home.studioEyebrow}</p>
          <h2>{copy.home.studioPreviewTitle}</h2>
          <p>{copy.home.studioPreviewBody}</p>
          <Link className="button button--line" href={`/${locale}/studio`}>{copy.home.studioCta} <span>→</span></Link>
        </div>
        <div className="studio-preview__images">
          <div className="studio-shot studio-shot--one"><Image src="/yunnan-menu-sp404-set.webp" alt={locale === "zh" ? "NeoBee 都柏林活动现场记录" : "NeoBee event documentation in Dublin"} fill sizes="(max-width: 760px) 70vw, 30vw" /></div>
          <div className="studio-shot studio-shot--two"><Image src="/session-jazzy-house.jpg" alt={locale === "zh" ? "NeoBee 音乐 Session 现场画面" : "NeoBee music session film still"} fill sizes="(max-width: 760px) 55vw, 24vw" /></div>
          <span>IMAGE / MOTION / SPACE</span>
        </div>
      </section>

      <section className="ghostframe-section section-pad" id="experiment">
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

      <section className="about-contact" id="about">
        <div className="about-contact__about">
          <p className="eyebrow">{copy.home.aboutEyebrow}</p>
          <h2>{copy.home.aboutTitle}</h2>
          <p>{copy.home.aboutBody}</p>
          <Link className="text-link" href={`/${locale}/about`}>{copy.nav.about} →</Link>
        </div>
        <div className="about-contact__cta">
          <p className="eyebrow">{copy.common.dublin}</p>
          <h2>{copy.home.finalTitle}</h2>
          <p>{copy.home.finalBody}</p>
          <Link className="button button--solid" href={`/${locale}/contact`}>{copy.nav.contact} <span>→</span></Link>
        </div>
      </section>
    </SiteShell>
  );
}
