import { MetadataRoute } from "next";
import { experiences, sessions } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://theneobee.club";

  const latestContentDate = [
    ...sessions.map((session) => session.uploadDate),
    ...experiences.map((experience) => experience.dateISO)
  ].reduce((latest, date) => {
    const contentDate = new Date(date);
    return contentDate > latest ? contentDate : latest;
  }, new Date("2024-01-01"));

  const pages = ["", "/club", "/studio", "/archive", "/about", "/contact"];

  return (["en", "zh"] as const).flatMap((locale) =>
    pages.map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: path === "/archive" ? latestContentDate : new Date("2026-07-22"),
      changeFrequency: path === "" ? "weekly" as const : "monthly" as const,
      priority: path === "" ? 1 : path === "/archive" ? 0.9 : 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en${path}`,
          zh: `${baseUrl}/zh${path}`,
          "x-default": `${baseUrl}/en${path}`
        }
      }
    }))
  );
}
