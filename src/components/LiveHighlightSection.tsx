"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useOptimizedVariants } from "@/lib/animations";

export default function LiveHighlightSection() {
  const t = useTranslations("liveHighlight");
  const locale = useLocale();
  const { containerVariants, itemVariants, textRevealVariants } = useOptimizedVariants();
  const visualAppUrl = process.env.NEXT_PUBLIC_VISUAL_APP_URL || "https://visual.theneobee.club";
  const ghostframeHref = `${visualAppUrl.replace(/\/$/, "")}/?locale=${locale}&source=neobee`;

  const features = [t("featureOne"), t("featureTwo"), t("featureThree")];

  return (
    <motion.section
      id="live"
      className="relative overflow-hidden bg-[#060912] py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={containerVariants}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_78%_28%,rgba(168,85,247,0.15),transparent_24%),linear-gradient(180deg,rgba(7,10,18,0.96),rgba(3,5,10,1))]" />
      <div className="absolute left-[8%] top-16 h-28 w-28 rounded-full border border-cyan-300/15 bg-cyan-300/10 blur-2xl" />
      <div className="absolute bottom-16 right-[10%] h-36 w-36 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <motion.div variants={itemVariants} className="space-y-6">
          <p className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
            {t("eyebrow")}
          </p>
          <motion.h2
            variants={textRevealVariants}
            className="max-w-3xl font-display text-4xl font-bold leading-tight text-white md:text-6xl"
          >
            {t("title")}
          </motion.h2>
          <motion.p
            variants={textRevealVariants}
            className="max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl"
          >
            {t("description")}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-2">
            <a
              href={ghostframeHref}
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-[0_18px_55px_rgba(56,189,248,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_75px_rgba(56,189,248,0.45)]"
            >
              {t("cta")}
            </a>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-cyan-400/20 via-transparent to-fuchsia-500/20 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(15,23,42,0.95),rgba(2,6,23,0.92))] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">Ghostframe</p>
                <p className="mt-2 text-2xl font-semibold text-white">Live Visualizer</p>
              </div>
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.8)]" />
                <span className="h-3 w-3 rounded-full bg-fuchsia-400 shadow-[0_0_18px_rgba(232,121,249,0.75)]" />
                <span className="h-3 w-3 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.75)]" />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/8 bg-[#04070d] p-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(34,211,238,0.18),transparent_22%),radial-gradient(circle_at_70%_35%,rgba(232,121,249,0.2),transparent_24%),radial-gradient(circle_at_50%_72%,rgba(59,130,246,0.18),transparent_28%)]" />
              <div className="relative aspect-[4/3] rounded-[1.1rem] border border-white/8 bg-[linear-gradient(135deg,#05070d,#0e1424)]">
                <div className="absolute left-[12%] top-[18%] h-28 w-28 rounded-full bg-cyan-300/18 blur-2xl" />
                <div className="absolute bottom-[18%] right-[16%] h-24 w-24 rounded-full bg-fuchsia-400/20 blur-2xl" />
                <div className="absolute inset-x-[22%] top-[22%] h-[1px] bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />
                <div className="absolute inset-y-[28%] left-[28%] w-[1px] bg-gradient-to-b from-transparent via-fuchsia-300/60 to-transparent" />
                <div className="absolute inset-x-[16%] bottom-[24%] h-14 rounded-full border border-cyan-200/18 bg-cyan-300/10 blur-md" />
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-slate-200"
                >
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.8)]" />
                  <span className="text-sm leading-6">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
