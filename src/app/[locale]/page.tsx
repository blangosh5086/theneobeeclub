import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ArtistsSection from "@/components/ArtistsSection";
import MusicSection from "@/components/MusicSection";
import ContactSection from "@/components/ContactSection";
import { setRequestLocale } from "next-intl/server";

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
    sameAs: [
      "https://open.spotify.com/artist/0ASsfvcyv6P3TVLEYLurds",
      "https://www.youtube.com/@HAOSC",
      "https://space.bilibili.com/3546828570101837",
      "https://space.bilibili.com/327769785"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="min-h-screen relative overflow-x-hidden">
        <Navbar />
        <HeroSection />
        <AboutSection />
        <ArtistsSection />
        <MusicSection />
        <ContactSection />
      </main>
    </>
  );
}
