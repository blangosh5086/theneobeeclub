import type { SiteLocale } from "@/data/site";
import { buildPageStructuredData, type SeoPage } from "@/lib/seo";

export default function PageSeo({
  locale,
  page
}: {
  locale: SiteLocale;
  page: Exclude<SeoPage, "home">;
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildPageStructuredData(locale, page)) }}
    />
  );
}
