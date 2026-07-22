import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import "../globals.css";
import { Montserrat, Noto_Sans_SC, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { isSiteLocale, locales, siteCopy } from "@/data/site";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-playfair"
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat"
});
const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-sc"
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { params } = props;
  const { locale } = await params;

  if (!isSiteLocale(locale)) notFound();
  const copy = siteCopy[locale];
  const title = "The NeoBee Club";
  const description = copy.home.aboutBody;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://theneobee.club";

  return {
    title: {
      default: title,
      template: `%s | ${title}`
    },
    description,
    keywords: [
      "Dublin creative collective",
      "independent music Dublin",
      "live sessions",
      "visual production Dublin",
      "cross-cultural events",
      "NeoBee Studio"
    ],
    authors: [{ name: "The NeoBee Club" }],
    creator: "The NeoBee Club",
    publisher: "The NeoBee Club",
    formatDetection: {
      email: false,
      address: false,
      telephone: false
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        zh: "/zh"
      }
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}`,
      siteName: title,
      images: [
        {
          url: "/neobee-social-card.png",
          width: 1200,
          height: 630,
          alt: "The NeoBee Club — Sound. Space. Culture."
        }
      ],
      locale: locale === "zh" ? "zh_CN" : "en_US",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/neobee-social-card.png"]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1
      }
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
    }
  };
}

export default async function LocaleLayout(props: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { children, params } = props;
  const { locale } = await params;

  if (!isSiteLocale(locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${montserrat.variable} ${playfair.variable} ${notoSansSC.variable}`}
      style={
        {
          "--font-playfair": playfair.style.fontFamily,
          "--font-montserrat": montserrat.style.fontFamily,
          "--font-noto-sans-sc": notoSansSC.style.fontFamily,
        } as React.CSSProperties
      }
    >
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
