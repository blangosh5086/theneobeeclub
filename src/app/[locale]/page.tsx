import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ArtistsSection from "@/components/ArtistsSection";
import LiveHighlightSection from "@/components/LiveHighlightSection";
import MusicSection from "@/components/MusicSection";
import ContactSection from "@/components/ContactSection";
import { setRequestLocale } from "next-intl/server";
import { getAllSocialLinks } from "@/data/artists";

export default async function Home(props: { params: Promise<{ locale: string }> }) {
  const { params } = props;
  const { locale } = await params;

  setRequestLocale(locale);

  // Structured data for music collective
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "The NeoBee Club",
    description:
      "A collective of music lovers exploring soulful, jazzy, and electronic sounds—here to have fun and share the joy of music.",
    genre: ["Electronic", "Jazz", "Soul", "House"],
    location: {
      "@type": "Place",
      name: "Dublin",
      addressCountry: "IE"
    },
    url: `https://theneobee.club/${locale}`,
    logo: "https://theneobee.club/logo.webp",
    sameAs: getAllSocialLinks()
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="min-h-screen relative overflow-x-hidden">
        <Banner />
        <Navbar />
        <HeroSection />
        <AboutSection />
        <ArtistsSection />
        <LiveHighlightSection />
        <MusicSection />
        <ContactSection />
      </main>
    </>
  );
}
