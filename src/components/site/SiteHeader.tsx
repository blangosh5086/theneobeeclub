"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SiteLocale, siteCopy } from "@/data/site";

export default function SiteHeader({ locale }: { locale: SiteLocale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const copy = siteCopy[locale];
  const otherLocale: SiteLocale = locale === "en" ? "zh" : "en";
  const pathWithoutLocale = pathname.replace(/^\/(en|zh)/, "") || "";
  const nav = [
    ["club", copy.nav.club],
    ["studio", copy.nav.studio],
    ["archive", copy.nav.archive],
    ["about", copy.nav.about],
    ["contact", copy.nav.contact]
  ] as const;

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand-lockup" href={`/${locale}`} aria-label={`${copy.nav.home} — The NeoBee Club`}>
          <Image src="/logo.webp" width={44} height={44} alt="" priority />
          <span>The NeoBee Club</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map(([path, label]) => (
            <Link className={pathname === `/${locale}/${path}` ? "is-active" : ""} href={`/${locale}/${path}`} key={path}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="language-link" href={`/${otherLocale}${pathWithoutLocale}`} prefetch={false}>
            {otherLocale === "en" ? "EN" : "中文"}
          </Link>
          <button
            className="menu-button"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span>{open ? copy.nav.close : copy.nav.menu}</span>
            <span className="menu-button__mark" aria-hidden="true">{open ? "×" : "+"}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="mobile-nav" id="mobile-menu" aria-label="Mobile navigation">
          {nav.map(([path, label], index) => (
            <Link href={`/${locale}/${path}`} key={path}>
              <span>0{index + 1}</span>
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
