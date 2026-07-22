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

const DESKTOP_SCAN_WIDTH = 28;
const MOBILE_SCAN_WIDTH = 32;
// Leave only a quiet translated sliver at rest so the primary mobile headline stays legible.
const MOBILE_REST_POSITION = { left: 84, right: 100 };

const centerOf = ({ left, right }: { left: number; right: number }) => (left + right) / 2;

export default function HomeHeroMotion({ locale, title }: { locale: SiteLocale; title: string }) {
  const scope = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLButtonElement>(null);
  const interactionHint = useRef<HTMLSpanElement>(null);
  const scanTimeline = useRef<gsap.core.Timeline | null>(null);
  const introDemo = useRef<gsap.core.Tween | null>(null);
  const scanning = useRef(false);
  const hintDismissed = useRef(false);
  const dragState = useRef<{ pointerId: number; startX: number; moved: boolean } | null>(null);
  const suppressClickUntil = useRef(0);
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
    media.add("(max-width: 760px)", () => {
      lastPointer.current = { ...MOBILE_REST_POSITION };
      gsap.set(stage.current, {
        "--hero-left": `${MOBILE_REST_POSITION.left}%`,
        "--hero-right": `${MOBILE_REST_POSITION.right}%`,
        "--hero-center": `${centerOf(MOBILE_REST_POSITION)}%`
      });
    });

    media.add("(prefers-reduced-motion: reduce)", () => {
      const restPosition = window.matchMedia("(max-width: 760px)").matches
        ? MOBILE_REST_POSITION
        : initialPosition;
      gsap.set(stage.current, {
        "--hero-left": `${restPosition.left}%`,
        "--hero-right": `${restPosition.right}%`,
        "--hero-center": `${centerOf(restPosition)}%`
      });
    });

    return () => {
      scanTimeline.current?.kill();
      media.revert();
    };
  }, { scope });

  const dismissHint = contextSafe(() => {
    introDemo.current?.kill();
    introDemo.current = null;
    window.sessionStorage.setItem("neobee-hero-demo-seen", "true");

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

  const move = contextSafe((clientX: number, immediate = false) => {
    if (!stage.current) return;
    dismissHint();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches && !immediate) return;
    const rect = stage.current.getBoundingClientRect();
    const center = gsap.utils.clamp(0, 100, ((clientX - rect.left) / rect.width) * 100);
    const desktopPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const width = desktopPointer ? DESKTOP_SCAN_WIDTH : MOBILE_SCAN_WIDTH;
    const left = gsap.utils.clamp(0, 100 - width, center - width / 2);
    lastPointer.current = { left, right: left + width };
    if (scanning.current) return;

    const position = {
      "--hero-left": `${left}%`,
      "--hero-right": `${left + width}%`,
      "--hero-center": `${left + width / 2}%`
    };

    if (immediate) {
      gsap.set(stage.current, position);
      return;
    }

    gsap.to(stage.current, {
      ...position,
      duration: 0.34,
      ease: "power3.out",
      overwrite: "auto"
    });
  });

  const beginDrag = contextSafe((pointerId: number, clientX: number) => {
    if (!stage.current) return;
    dismissHint();
    scanTimeline.current?.kill();
    scanTimeline.current = null;
    scanning.current = false;
    suppressClickUntil.current = 0;
    dragState.current = { pointerId, startX: clientX, moved: false };
  });

  const drag = contextSafe((pointerId: number, clientX: number) => {
    const currentDrag = dragState.current;
    if (!currentDrag || currentDrag.pointerId !== pointerId) return;
    if (Math.abs(clientX - currentDrag.startX) > 4) currentDrag.moved = true;
    move(clientX, true);
  });

  const endDrag = contextSafe((pointerId: number) => {
    const currentDrag = dragState.current;
    if (!currentDrag || currentDrag.pointerId !== pointerId) return;
    suppressClickUntil.current = currentDrag.moved ? performance.now() + 500 : 0;
    dragState.current = null;
  });

  const play = contextSafe((dismissInteractionHint = true) => {
    if (!stage.current) return;
    if (dismissInteractionHint) dismissHint();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktopPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const desktopWidth = DESKTOP_SCAN_WIDTH;
    const mobileWidth = MOBILE_SCAN_WIDTH;
    const returnPosition = { ...lastPointer.current };

    if (reducedMotion) {
      gsap.set(stage.current, {
        "--hero-left": `${returnPosition.left}%`,
        "--hero-right": `${returnPosition.right}%`,
        "--hero-center": `${centerOf(returnPosition)}%`
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
        .to(stage.current, { "--hero-left": `${100 - desktopWidth}%`, "--hero-right": "100%", "--hero-center": `${100 - desktopWidth / 2}%`, duration: 0.5 }, "scan")
        .to(stage.current, { "--hero-left": "0%", "--hero-right": `${desktopWidth}%`, "--hero-center": `${desktopWidth / 2}%`, duration: 0.72 })
        .to(stage.current, {
          "--hero-left": `${returnPosition.left}%`,
          "--hero-right": `${returnPosition.right}%`,
          "--hero-center": `${centerOf(returnPosition)}%`,
          duration: 0.56,
          ease: "power3.out"
        });
    } else {
      timeline.addLabel("scan")
        .set(stage.current, { "--hero-left": "0%", "--hero-right": `${mobileWidth}%`, "--hero-center": `${mobileWidth / 2}%` }, "scan")
        .to(stage.current, { "--hero-left": `${100 - mobileWidth}%`, "--hero-right": "100%", "--hero-center": `${100 - mobileWidth / 2}%`, duration: 1.05 }, "scan")
        .to(stage.current, {
          "--hero-left": `${returnPosition.left}%`,
          "--hero-right": `${returnPosition.right}%`,
          "--hero-center": `${centerOf(returnPosition)}%`,
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

  useGSAP(() => {
    if (!stage.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.sessionStorage.getItem("neobee-hero-demo-seen") === "true") return;

    introDemo.current = gsap.delayedCall(0.9, () => {
      introDemo.current = null;
      window.sessionStorage.setItem("neobee-hero-demo-seen", "true");
      play(false);
    });

    return () => {
      introDemo.current?.kill();
      introDemo.current = null;
    };
  }, { scope });

  const interactionLabel = locale === "zh"
    ? "互动双语标题：声音。空间。文化。移动指针或拖动扫描线探索翻译，点击或轻触扫描。"
    : "Interactive bilingual title: Sound. Space. Culture. Move the pointer or drag the scanner to explore the translation, then click or tap to scan.";

  return (
    <div className={styles.root} ref={scope}>
      <h1 className="sr-only">{title}</h1>
      <button
        className={styles.stage}
        ref={stage}
        type="button"
        style={{
          "--hero-left": `${initialPosition.left}%`,
          "--hero-right": `${initialPosition.right}%`,
          "--hero-center": `${centerOf(initialPosition)}%`
        } as CSSProperties}
        aria-label={interactionLabel}
        onPointerEnter={() => {
          if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) activate();
        }}
        onPointerDown={(event) => {
          const target = event.target as HTMLElement;
          const desktopPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
          if (!desktopPointer && !target.closest("[data-hero-handle]")) return;
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          beginDrag(event.pointerId, event.clientX);
        }}
        onPointerMove={(event) => {
          if (dragState.current?.pointerId === event.pointerId) {
            event.preventDefault();
            drag(event.pointerId, event.clientX);
          } else if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            move(event.clientX);
          }
        }}
        onPointerUp={(event) => {
          endDrag(event.pointerId);
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={(event) => {
          suppressClickUntil.current = dragState.current?.moved ? performance.now() + 500 : 0;
          dragState.current = null;
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerLeave={() => {
          if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !dragState.current) settle();
        }}
        onFocus={activate}
        onBlur={settle}
        onClick={() => {
          if (performance.now() < suppressClickUntil.current) return;
          play();
        }}
      >
        <span className={styles.meta} ref={interactionHint} aria-hidden="true">
          <span className={styles.desktopHint}>{locale === "zh" ? "移动 / 拖动 / 点击" : "MOVE / DRAG / CLICK"}</span>
          <span className={styles.mobileHint}>{locale === "zh" ? "拖动 / 轻触" : "DRAG / TAP"}</span>
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
        <span className={styles.mobileHandle} data-hero-handle aria-hidden="true">
          <span>↔</span>
        </span>
      </button>
    </div>
  );
}
