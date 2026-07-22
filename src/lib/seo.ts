import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isSiteLocale, type SiteLocale } from "@/data/site";

const SITE_NAME = "The NeoBee Club";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://theneobee.club";
const SOCIAL_IMAGE = "/neobee-social-card.png";

const pagePaths = {
  home: "",
  club: "/club",
  studio: "/studio",
  archive: "/archive",
  about: "/about",
  contact: "/contact"
} as const;

const seoCopy = {
  en: {
    home: {
      title: "The NeoBee Club — Music, Visual Culture & Live Experiences",
      description: "A Dublin-based creative collective making music sessions, visual stories, and cross-cultural live experiences."
    },
    club: {
      title: "Music Sessions & Live Experiences",
      description: "Explore NeoBee Club's genre-fluid music sessions, live experiences, cultural collaborations, and creative experiments in Dublin."
    },
    studio: {
      title: "Photography, Film & Visual Direction",
      description: "NeoBee Studio creates photography, moving image, live documentation, and visual direction for artists, spaces, events, and independent brands."
    },
    archive: {
      title: "Music, Events & Experiments Archive",
      description: "Watch NeoBee music sessions and explore selected event records and visual experiments created in Dublin."
    },
    about: {
      title: "About Hao, Leo & NeoBee",
      description: "Meet Hao and Leo, the founders of The NeoBee Club, an independent Dublin collective working across music, image, and live culture."
    },
    contact: {
      title: "Contact & Collaborations",
      description: "Contact The NeoBee Club for music sessions, live events, photography, moving image, visual direction, and cross-cultural collaborations."
    }
  },
  zh: {
    home: {
      title: "The NeoBee Club｜都柏林音乐、影像与现场文化",
      description: "The NeoBee Club 是由 Hao 和 Leo 在都柏林创立的创意团体，创作音乐 Session、现场活动、摄影与动态影像。"
    },
    club: {
      title: "音乐 Session 与现场体验",
      description: "探索 NeoBee Club 在都柏林策划的音乐 Session、现场活动、文化合作与创意实验。"
    },
    studio: {
      title: "摄影、动态影像与视觉方向",
      description: "NeoBee Studio 为艺术家、空间、活动和独立品牌提供摄影、动态影像、现场记录与视觉方向。"
    },
    archive: {
      title: "音乐、活动与视觉实验档案",
      description: "观看 NeoBee 的音乐 Session，并浏览我们在都柏林完成的活动记录与视觉实验。"
    },
    about: {
      title: "关于 Hao 与 Leo",
      description: "认识 The NeoBee Club 的创立者 Hao 与 Leo，以及我们在都柏林围绕音乐、影像和现场文化展开的工作。"
    },
    contact: {
      title: "联系与合作",
      description: "联系 The NeoBee Club，讨论音乐 Session、现场活动、摄影、动态影像、视觉方向与跨文化合作。"
    }
  }
} as const;

export type SeoPage = keyof typeof pagePaths;

const breadcrumbLabels: Record<SiteLocale, Record<SeoPage, string>> = {
  en: {
    home: "Home",
    club: "Club",
    studio: "Studio",
    archive: "Archive",
    about: "About",
    contact: "Contact"
  },
  zh: {
    home: "首页",
    club: "音乐与现场",
    studio: "视觉工作室",
    archive: "档案",
    about: "关于",
    contact: "联系"
  }
};

export function buildPageMetadata(locale: SiteLocale, page: SeoPage): Metadata {
  const path = pagePaths[page];
  const localizedPath = `/${locale}${path}`;
  const copy = seoCopy[locale][page];
  const isHome = page === "home";
  const renderedTitle = isHome ? copy.title : `${copy.title} | ${SITE_NAME}`;

  return {
    title: isHome ? { absolute: copy.title } : copy.title,
    description: copy.description,
    alternates: {
      canonical: localizedPath,
      languages: {
        en: `/en${path}`,
        zh: `/zh${path}`,
        "x-default": `/en${path}`
      }
    },
    openGraph: {
      title: renderedTitle,
      description: copy.description,
      url: `${BASE_URL}${localizedPath}`,
      siteName: SITE_NAME,
      images: [{
        url: SOCIAL_IMAGE,
        width: 1200,
        height: 630,
        alt: "The NeoBee Club — Sound. Space. Culture."
      }],
      locale: locale === "zh" ? "zh_CN" : "en_IE",
      alternateLocale: locale === "zh" ? ["en_IE"] : ["zh_CN"],
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: renderedTitle,
      description: copy.description,
      images: [SOCIAL_IMAGE]
    }
  };
}

export async function generatePageMetadata(
  params: Promise<{ locale: string }>,
  page: SeoPage
): Promise<Metadata> {
  const { locale } = await params;
  if (!isSiteLocale(locale)) notFound();
  return buildPageMetadata(locale, page);
}

export function buildPageStructuredData(locale: SiteLocale, page: Exclude<SeoPage, "home">) {
  const path = pagePaths[page];
  const pageUrl = `${BASE_URL}/${locale}${path}`;
  const homeUrl = `${BASE_URL}/${locale}`;
  const copy = seoCopy[locale][page];
  const breadcrumbId = `${pageUrl}/#breadcrumb`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}/#webpage`,
        url: pageUrl,
        name: copy.title,
        description: copy.description,
        inLanguage: locale,
        isPartOf: { "@id": `${BASE_URL}/#website` },
        breadcrumb: { "@id": breadcrumbId }
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: breadcrumbLabels[locale].home,
            item: homeUrl
          },
          {
            "@type": "ListItem",
            position: 2,
            name: breadcrumbLabels[locale][page],
            item: pageUrl
          }
        ]
      }
    ]
  };
}
