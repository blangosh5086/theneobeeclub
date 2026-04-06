"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useLocale, useTranslations } from "next-intl";

const Banner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useTranslations("banner");
  const visualAppUrl = process.env.NEXT_PUBLIC_VISUAL_APP_URL || "https://visual.theneobee.club";
  const ghostframeHref = `${visualAppUrl.replace(/\/$/, "")}/?locale=${locale}&source=neobee`;

  useEffect(() => {
    // Check if banner was dismissed in localStorage
    const dismissedTime = localStorage.getItem("banner-dismissed");
    const shouldShow = !dismissedTime || Date.now() - parseInt(dismissedTime) > 7 * 24 * 60 * 60 * 1000; // Show again after 7 days

    if (shouldShow) {
      setIsVisible(true);
    }
  }, []);

  // Add/remove top padding to body when banner is visible/hidden
  useEffect(() => {
    const updateBodyPadding = () => {
      if (isVisible && bannerRef.current) {
        const bannerHeight = bannerRef.current.offsetHeight;
        document.body.style.paddingTop = `${bannerHeight}px`;
      } else {
        document.body.style.paddingTop = "0px";
      }
    };

    // Update immediately
    updateBodyPadding();

    // Update on resize
    const handleResize = () => updateBodyPadding();
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.paddingTop = "0px";
      window.removeEventListener("resize", handleResize);
    };
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    // Store dismissal with a timestamp so we can potentially show it again after some time
    localStorage.setItem("banner-dismissed", Date.now().toString());
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={bannerRef}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white shadow-lg"
          role="banner"
          aria-label="Ghostframe announcement"
        >
          <div className="max-w-7xl mx-auto px-1.5 sm:px-4 lg:px-8">
            <div className="flex items-center justify-between py-2 sm:py-3 h-11 sm:h-12">
              {/* Content container - single line, no wrapping */}
              <div className="flex items-center space-x-1 sm:space-x-2 flex-1 min-w-0 overflow-hidden">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 3, -3, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-sm sm:text-base lg:text-lg flex-shrink-0"
                >
                  🎵
                </motion.div>

                {/* Text content - can truncate if needed */}
                <span className="font-medium text-xs sm:text-sm lg:text-base truncate flex-shrink min-w-0">
                  {t("launch")}
                </span>

                {/* CTA button - always visible */}
                <a
                  href={ghostframeHref}
                  rel="noreferrer"
                  className="font-bold text-white underline hover:text-yellow-200 transition-colors duration-200 text-xs sm:text-sm lg:text-base whitespace-nowrap flex-shrink-0"
                  aria-label={`${t("cta")} - ${t("launch")}`}
                >
                  {t("cta")}
                </a>
              </div>

              {/* Close button - always visible */}
              <motion.button
                onClick={handleDismiss}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 sm:p-1.5 hover:bg-white/10 rounded-full transition-colors duration-200 flex-shrink-0 ml-1"
                aria-label="Dismiss banner"
              >
                <XMarkIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Banner;
