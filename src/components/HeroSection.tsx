"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const MetaballsEffect = dynamic(() => import("./MetaballsEffect"), { ssr: false });

export default function HeroSection() {
  const t = useTranslations();
  const locale = useLocale();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();

  // Parallax transforms
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);

  return (
    <section ref={heroRef} className="h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Gradient Background with Parallax */}
      <motion.div
        style={{ y: yBg, scale }}
        className="absolute inset-0 z-0 animate-gradient bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-400 opacity-80"
      />
      <MetaballsEffect />

      <motion.div style={{ opacity }} className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/65 z-10" />

      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 1,
          ease: "easeOut",
          type: "spring",
          damping: 15,
          stiffness: 80
        }}
        className="relative z-20 text-center px-4"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="relative"
        >
          <Image
            src="/logo.webp"
            alt="The NeoBee Club Logo"
            width={192}
            height={192}
            className="mx-auto mb-8 w-32 h-32 sm:w-48 sm:h-48 rounded-full object-cover shadow-2xl ring-4 ring-white/20"
            priority
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-display text-3xl sm:text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
        >
          {t("hero.title")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-base sm:text-xl md:text-2xl text-gray-300 font-normal px-2 sm:px-0 max-w-3xl mx-auto"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href={`/${locale}#live`}
            className="inline-flex min-w-[210px] items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-[0_18px_55px_rgba(56,189,248,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_75px_rgba(56,189,248,0.45)]"
          >
            {t("hero.openGhostframe")}
          </Link>
          <Link
            href={`/${locale}/works`}
            className="inline-flex min-w-[210px] items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
          >
            {t("hero.exploreWorks")}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
