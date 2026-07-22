import Image from "next/image";
import { experiences, SiteLocale, siteCopy } from "@/data/site";

type Experience = (typeof experiences)[number];

export default function ExperienceCard({ experience, locale }: { experience: Experience; locale: SiteLocale }) {
  const copy = siteCopy[locale];

  return (
    <article className="experience-card" id={experience.id}>
      <a className="experience-card__image" href={experience.href} target="_blank" rel="noreferrer">
        <Image
          src={experience.image}
          alt={`${experience.title[locale]} — ${experience.venue}`}
          fill
          sizes="(max-width: 760px) 100vw, 42vw"
        />
      </a>
      <div className="experience-card__content">
        <div className="experience-card__meta">
          <span>{experience.date[locale]}</span>
          <span>{experience.time}</span>
        </div>
        <h3>{experience.title[locale]}</h3>
        <p>{experience.description[locale]}</p>
        <div className="experience-card__place">
          <strong>{experience.venue}</strong>
          <span>{experience.address}</span>
        </div>
        <a className="text-link" href={experience.href} target="_blank" rel="noreferrer">
          {copy.home.experienceCta} ↗
        </a>
      </div>
    </article>
  );
}
