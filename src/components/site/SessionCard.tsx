import Image from "next/image";
import { sessions, SiteLocale, siteCopy } from "@/data/site";

type Session = (typeof sessions)[number];

export default function SessionCard({ session, locale, featured = false }: { session: Session; locale: SiteLocale; featured?: boolean }) {
  return (
    <article className={`session-card ${featured ? "session-card--featured" : ""}`}>
      <a className="session-card__image" href={session.youtube} target="_blank" rel="noreferrer" aria-label={`${siteCopy[locale].common.play}: ${session.title}`}>
        <Image
          src={session.image}
          alt={locale === "zh"
            ? `${session.title} — NeoBee Session ${session.number} 现场画面`
            : `${session.title} — NeoBee Club Session ${session.number}`}
          fill
          sizes={featured ? "(max-width: 900px) 100vw, 62vw" : "(max-width: 760px) 100vw, 50vw"}
        />
        <span className="play-mark" aria-hidden="true">Play ↗</span>
      </a>
      <div className="session-card__meta">
        <span>Session {session.number}</span>
        <span>{session.year} · {session.duration}</span>
      </div>
      <h3>{session.title}</h3>
      <p>{session.description[locale]}</p>
    </article>
  );
}
