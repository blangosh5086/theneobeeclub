"use client";

import { useEffect, useMemo, useState } from "react";
import type { SiteLocale } from "@/data/site";

const labels = {
  en: {
    title: "On this page",
    menu: "Open page index",
    items: [
      ["practices", "Practices"],
      ["sessions", "Sessions"],
      ["experiences", "Experiences"],
      ["studio", "Studio"],
      ["experiment", "Experiment"],
      ["about", "About"]
    ]
  },
  zh: {
    title: "本页目录",
    menu: "打开本页目录",
    items: [
      ["practices", "工作方式"],
      ["sessions", "Sessions"],
      ["experiences", "现场体验"],
      ["studio", "视觉工作室"],
      ["experiment", "实验"],
      ["about", "关于"]
    ]
  }
} as const;

export default function HomePageIndex({ locale }: { locale: SiteLocale }) {
  const copy = labels[locale];
  const items = useMemo(() => copy.items, [copy.items]);
  const [activeId, setActiveId] = useState<string>(items[0][0]);
  const [isOpen, setIsOpen] = useState(false);
  const activeItem = items.find(([id]) => id === activeId) ?? items[0];

  useEffect(() => {
    const initialId = window.location.hash.slice(1);
    if (items.some(([id]) => id === initialId)) setActiveId(initialId);

    const sections = items
      .map(([id]) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    let frame = 0;
    const updateActiveSection = () => {
      const marker = window.scrollY + Math.min(window.innerHeight * 0.24, 220);
      const current = sections.reduce(
        (active, section) => section.offsetTop <= marker ? section : active,
        sections[0]
      );

      if (current?.id) setActiveId(current.id);
      frame = 0;
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [items]);

  const selectItem = (id: string) => {
    setActiveId(id);
    setIsOpen(false);
  };

  return (
    <nav className={`home-index${isOpen ? " is-open" : ""}`} aria-label={copy.title}>
      <div className="home-index__inner">
        <span className="home-index__title">INDEX / 01—06</span>

        <div className="home-index__desktop">
          {items.map(([id, label], index) => (
            <a
              className={`home-index__link${activeId === id ? " is-active" : ""}`}
              href={`#${id}`}
              key={id}
              onClick={() => selectItem(id)}
              aria-current={activeId === id ? "location" : undefined}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {label}
            </a>
          ))}
        </div>

        <button
          className="home-index__toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls="home-index-panel"
          aria-label={copy.menu}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="home-index__current">
            <span>{String(items.findIndex(([id]) => id === activeItem[0]) + 1).padStart(2, "0")}</span>
            {activeItem[1]}
          </span>
          <span className="home-index__icons" aria-hidden="true">
            <span className="home-index__icon home-index__icon--plus">+</span>
            <span className="home-index__icon home-index__icon--minus">−</span>
          </span>
        </button>

        <div className="home-index__panel" id="home-index-panel" aria-hidden={!isOpen}>
          {items.map(([id, label], index) => (
            <a
              className={`home-index__panel-link${activeId === id ? " is-active" : ""}`}
              href={`#${id}`}
              key={id}
              onClick={() => selectItem(id)}
              tabIndex={isOpen ? 0 : -1}
              aria-current={activeId === id ? "location" : undefined}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{label}</strong>
              <span>↘</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
