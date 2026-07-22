import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import PageIntro from "@/components/site/PageIntro";
import PageSeo from "@/components/site/PageSeo";
import SiteShell from "@/components/site/SiteShell";
import { isSiteLocale, siteCopy, socialLinks } from "@/data/site";
import { generatePageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return generatePageMetadata(params, "contact");
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isSiteLocale(locale)) notFound();
  setRequestLocale(locale);
  const copy = siteCopy[locale];

  return (
    <SiteShell locale={locale}>
      <PageSeo locale={locale} page="contact" />
      <PageIntro eyebrow={copy.contact.eyebrow} title={copy.contact.title} intro={copy.contact.intro} />
      <section className="contact-paths section-pad">
        <article><span>01</span><h2>{copy.contact.clubTitle}</h2><p>{copy.contact.clubBody}</p></article>
        <article><span>02</span><h2>{copy.contact.studioTitle}</h2><p>{copy.contact.studioBody}</p></article>
      </section>
      <section className="contact-direct section-pad">
        <div><p className="eyebrow">{copy.nav.contact}</p><h2>{copy.contact.directTitle}</h2><p>{copy.contact.directBody}</p></div>
        <div className="contact-links">
          <a href={socialLinks.email}><span>{copy.contact.email}</span><span>↗</span></a>
          <a href={socialLinks.instagram} target="_blank" rel="noreferrer"><span>{copy.contact.instagram}</span><span>↗</span></a>
          <a href={socialLinks.youtube} target="_blank" rel="noreferrer"><span>{copy.contact.youtube}</span><span>↗</span></a>
        </div>
      </section>
    </SiteShell>
  );
}
