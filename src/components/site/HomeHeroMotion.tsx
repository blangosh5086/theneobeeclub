"use client";

import { type CSSProperties, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { SiteLocale } from "@/data/site";
import styles from "./HomeHeroMotion.module.css";

gsap.registerPlugin(useGSAP);

const words = [
  { zh: "声音。", en: "SOUND." },
  { zh: "空间。", en: "SPACE." },
  { zh: "文化。", en: "CULTURE." }
] as const;

export default function HomeHeroMotion({ locale, title }: { locale: SiteLocale; title: string }) {
  const scope = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLButtonElement>(null);
  const interactionHint = useRef<HTMLSpanElement>(null);
  const scanTimeline = useRef<gsap.core.Timeline | null>(null);
  const scanning = useRef(false);
  const hintDismissed = useRef(false);
  const initialPosition = locale === "zh" ? { left: 34, right: 66 } : { left: 16, right: 44 };
  const lastPointer = useRef(initialPosition);
  const translationLocale: SiteLocale = locale === "zh" ? "en" : "zh";
  const main = words.map((word) => word[locale]);
  const translation = words.map((word) => word[translationLocale]);
  const translationSpace = translationLocale === "zh" ? ["空", "间。"] : ["SPA", "CE."];
  const languageClass = (language: SiteLocale) => language === "zh" ? styles.cjk : styles.latin;

  const { contextSafe } = useGSAP(() => {
    if (!stage.current) return;
    gsap.set("[data-hero-sound-ghost]", { autoAlpha: 0 });
    gsap.set("[data-hero-culture-print]", { autoAlpha: 0, x: 0, y: 0 });

    if (window.sessionStorage.getItem("neobee-hero-hint-seen") === "true" && interactionHint.current) {
      hintDismissed.current = true;
      gsap.set(interactionHint.current, { autoAlpha: 0, y: -4 });
    }

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(stage.current, {
        "--hero-left": `${initialPosition.left}%`,
        "--hero-right": `${initialPosition.right}%`
      });
    });

    return () => {
      scanTimeline.current?.kill();
      media.revert();
    };
  }, { scope });

  const dismissHint = contextSafe(() => {
    if (!interactionHint.current || hintDismissed.current) return;
    hintDismissed.current = true;
    window.sessionStorage.setItem("neobee-hero-hint-seen", "true");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(interactionHint.current, { autoAlpha: 0 });
      return;
    }

    gsap.to(interactionHint.current, {
      autoAlpha: 0,
      y: -4,
      duration: 0.28,
      ease: "power2.out",
      overwrite: "auto"
    });
  });

  const activate = contextSafe(() => {
    if (!stage.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to("[data-hero-sound-ghost]", {
      autoAlpha: 0.18,
      x: (index) => index ? 11 : -8,
      duration: 0.18,
      stagger: 0.035,
      ease: "power1.out",
      overwrite: "auto"
    });
    gsap.to("[data-hero-space-piece]", {
      x: (index) => index ? "0.16em" : "-0.16em",
      duration: 0.58,
      ease: "expo.out",
      overwrite: "auto"
    });
    gsap.to("[data-hero-culture-print]", {
      autoAlpha: 0.44,
      x: "0.055em",
      y: "0.045em",
      duration: 0.48,
      ease: "power3.out",
      overwrite: "auto"
    });
  });

  const settle = contextSafe(() => {
    gsap.to("[data-hero-sound-ghost]", { autoAlpha: 0, x: 0, duration: 0.52, ease: "expo.out", overwrite: "auto" });
    gsap.to("[data-hero-space-piece]", { x: 0, duration: 0.58, ease: "expo.out", overwrite: "auto" });
    gsap.to("[data-hero-culture-print]", { autoAlpha: 0, x: 0, y: 0, duration: 0.48, ease: "power3.out", overwrite: "auto" });
  });

  const move = contextSafe((clientX: number) => {
    if (!stage.current) return;
    dismissHint();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = stage.current.getBoundingClientRect();
    const center = gsap.utils.clamp(0, 100, ((clientX - rect.left) / rect.width) * 100);
    const desktopPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const width = desktopPointer ? 28 : 46;
    const left = gsap.utils.clamp(0, 100 - width, center - width / 2);
    lastPointer.current = { left, right: left + width };
    if (scanning.current) return;

    gsap.to(stage.current, {
      "--hero-left": `${left}%`,
      "--hero-right": `${left + width}%`,
      duration: 0.34,
      ease: "power3.out",
      overwrite: "auto"
    });
  });

  const play = contextSafe(() => {
    if (!stage.current) return;
    dismissHint();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktopPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const desktopWidth = 28;
    const mobileWidth = 46;
    const returnPosition = desktopPointer
      ? { ...lastPointer.current }
      : { left: (100 - mobileWidth) / 2, right: (100 + mobileWidth) / 2 };

    if (reducedMotion) {
      gsap.set(stage.current, {
        "--hero-left": `${returnPosition.left}%`,
        "--hero-right": `${returnPosition.right}%`
      });
      return;
    }

    scanTimeline.current?.kill();
    gsap.killTweensOf(stage.current);
    scanning.current = true;

    const timeline = gsap.timeline({
      defaults: { ease: "expo.inOut" },
      onComplete: () => {
        scanning.current = false;
        scanTimeline.current = null;
      },
      onInterrupt: () => {
        scanning.current = false;
      }
    });
    scanTimeline.current = timeline;

    if (desktopPointer) {
      timeline.addLabel("scan")
        .to(stage.current, { "--hero-left": `${100 - desktopWidth}%`, "--hero-right": "100%", duration: 0.5 }, "scan")
        .to(stage.current, { "--hero-left": "0%", "--hero-right": `${desktopWidth}%`, duration: 0.72 })
        .to(stage.current, {
          "--hero-left": `${returnPosition.left}%`,
          "--hero-right": `${returnPosition.right}%`,
          duration: 0.56,
          ease: "power3.out"
        });
    } else {
      timeline.addLabel("scan")
        .set(stage.current, { "--hero-left": "0%", "--hero-right": `${mobileWidth}%` }, "scan")
        .to(stage.current, { "--hero-left": `${100 - mobileWidth}%`, "--hero-right": "100%", duration: 1.05 }, "scan")
        .to(stage.current, {
          "--hero-left": `${returnPosition.left}%`,
          "--hero-right": `${returnPosition.right}%`,
          duration: 0.58,
          ease: "power3.out"
        });
    }

    timeline.to("[data-hero-sound-ghost]", { autoAlpha: 0.2, x: (index) => index ? 12 : -9, duration: 0.18, stagger: 0.04, ease: "power1.out" }, "scan+=0.08")
      .to("[data-hero-sound-ghost]", { autoAlpha: 0, x: 0, duration: 0.64, ease: "expo.out" }, "scan+=0.32")
      .to("[data-hero-space-piece]", { x: (index) => index ? "0.16em" : "-0.16em", duration: 0.5, ease: "expo.out" }, "scan+=0.3")
      .to("[data-hero-space-piece]", { x: 0, duration: 0.52, ease: "expo.out" }, "scan+=0.92")
      .to("[data-hero-culture-print]", { autoAlpha: 0.46, x: "0.055em", y: "0.045em", duration: 0.42, ease: "power3.out" }, "scan+=0.66")
      .to("[data-hero-culture-print]", { autoAlpha: 0, x: 0, y: 0, duration: 0.46, ease: "power3.out" }, "scan+=1.2");
  });

  const interactionLabel = locale === "zh"
    ? "互动双语标题：声音。空间。文化。移动指针探索翻译，点击扫描。"
    : "Interactive bilingual title: Sound. Space. Culture. Move to explore the translation and click to scan.";

  return (
    <div className={styles.root} ref={scope}>
      <h1 className="sr-only">{title}</h1>
      <button
        className={styles.stage}
        ref={stage}
        type="button"
        style={{
          "--hero-left": `${initialPosition.left}%`,
          "--hero-right": `${initialPosition.right}%`
        } as CSSProperties}
        aria-label={interactionLabel}
        onPointerEnter={(event) => { if (event.pointerType === "mouse") activate(); }}
        onPointerMove={(event) => { if (event.pointerType === "mouse") move(event.clientX); }}
        onPointerLeave={(event) => { if (event.pointerType === "mouse") settle(); }}
        onFocus={activate}
        onBlur={settle}
        onClick={play}
      >
        <span className={styles.meta} ref={interactionHint} aria-hidden="true">
          <span className={styles.desktopHint}>{locale === "zh" ? "移动 / 点击" : "MOVE / CLICK"}</span>
          <span className={styles.mobileHint}>{locale === "zh" ? "轻触" : "TAP"}</span>
        </span>

        <span className={`${styles.layer} ${styles.base} ${languageClass(locale)}`} aria-hidden="true">
          {main.map((word) => (
            <span className={styles.row} key={word}><b>{word}</b></span>
          ))}
        </span>

        <span className={`${styles.layer} ${styles.translation} ${languageClass(translationLocale)}`} aria-hidden="true">
          <span className={styles.row}>
            <b className={styles.sound}>
              <span data-hero-sound-ghost>{translation[0]}</span>
              <span data-hero-sound-ghost>{translation[0]}</span>
              <span>{translation[0]}</span>
            </b>
          </span>
          <span className={styles.row}>
            <b className={styles.space}>
              <span data-hero-space-piece>{translationSpace[0]}</span>
              <span data-hero-space-piece>{translationSpace[1]}</span>
            </b>
          </span>
          <span className={styles.row}>
            <b className={styles.culture}>
              <span>{translation[2]}</span>
              <span data-hero-culture-print>{translation[2]}</span>
            </b>
          </span>
        </span>

        <span className={styles.lineStart} aria-hidden="true" />
        <span className={styles.lineEnd} aria-hidden="true" />
      </button>
    </div>
  );
}
