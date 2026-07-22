import Link from "next/link";
import { ReactNode } from "react";
import { SiteLocale, siteCopy, socialLinks } from "@/data/site";
import SiteHeader from "./SiteHeader";

export default function SiteShell({ locale, children }: { locale: SiteLocale; children: ReactNode }) {
  const copy = siteCopy[locale];

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">{locale === "zh" ? "跳到主要内容" : "Skip to content"}</a>
      <SiteHeader locale={locale} />
      <main id="main-content">{children}</main>
      <footer className="site-footer">
        <div className="site-footer__statement">
          <p className="eyebrow">The NeoBee Club</p>
          <p>Sound. Space. Culture.</p>
        </div>
        <div className="site-footer__links">
          <p className="eyebrow">{copy.common.social}</p>
          <a href={socialLinks.email}>theneobeeclub@gmail.com ↗</a>
          <a href={socialLinks.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>
          <a href={socialLinks.youtube} target="_blank" rel="noreferrer">YouTube ↗</a>
        </div>
        <div className="site-footer__meta">
          <p>{copy.common.founded}</p>
          <p>© {new Date().getFullYear()} NeoBee</p>
          <Link href={`/${locale}/contact`}>{copy.nav.contact} →</Link>
        </div>
      </footer>
    </div>
  );
}
