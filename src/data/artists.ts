export interface Artist {
  id: string;
  name: string;
  roleKey: string; // Translation key for role
  bioKey?: string; // Optional translation key for bio/description
  imageUrl: string;
  social: {
    spotify?: string;
    youtube?: string;
    bilibili?: string;
    instagram?: string;
    soundcloud?: string;
    twitter?: string;
    xiaohongshu?: string;
  };
}

export const artists: Artist[] = [
  {
    id: "haosc",
    name: "HAØSC",
    roleKey: "artists.haosc_role",
    bioKey: "artists.haosc_bio",
    imageUrl: "/haosc.webp",
    social: {
      instagram: "https://www.instagram.com/haosc.official",
      spotify: "https://open.spotify.com/artist/0ASsfvcyv6P3TVLEYLurds",
      youtube: "https://www.youtube.com/@HAOSC",
      bilibili: "https://space.bilibili.com/3546828570101837"
    }
  },
  {
    id: "leo",
    name: "Leo",
    roleKey: "artists.leo_role",
    imageUrl: "/leo.webp",
    social: {
      bilibili: "https://space.bilibili.com/327769785"
    }
  },
  {
    id: "kewusir",
    name: "Kewusir",
    roleKey: "artists.kewusir_role",
    imageUrl: "/kewusir.webp",
    social: {
      instagram: "https://www.instagram.com/kewusir",
      xiaohongshu: "https://www.xiaohongshu.com/user/profile/5f146132000000000101d967"
    }
  }
];

// Helper function to get all social media links for structured data
export const getAllSocialLinks = (): string[] => {
  const allLinks: string[] = [];

  artists.forEach((artist) => {
    Object.values(artist.social).forEach((link) => {
      if (link) allLinks.push(link);
    });
  });

  return allLinks;
};
