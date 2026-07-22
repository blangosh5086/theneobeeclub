export type SiteLocale = "en" | "zh";

type LocalizedText = Record<SiteLocale, string>;

export const locales: SiteLocale[] = ["en", "zh"];

export function isSiteLocale(locale: string): locale is SiteLocale {
  return locales.includes(locale as SiteLocale);
}

export const siteCopy = {
  en: {
    nav: {
      home: "Home",
      club: "Club",
      studio: "Studio",
      archive: "Archive",
      about: "About",
      contact: "Contact",
      menu: "Menu",
      close: "Close"
    },
    common: {
      dublin: "Dublin, Ireland",
      explore: "Explore",
      viewAll: "View the archive",
      play: "Watch on YouTube",
      next: "Next",
      founded: "Founded by Hao and Leo in Dublin.",
      social: "Elsewhere"
    },
    home: {
      eyebrow: "Dublin-based creative collective",
      title: "Sound. Space. Culture.",
      intro:
        "Curated sounds, distinctive spaces, and cross-cultural experiences from Dublin.",
      clubCta: "Explore NeoBee Club",
      studioCta: "Explore NeoBee Studio",
      featureEyebrow: "Featured session · 002",
      featureTitle: "A room, a guitar, a shared pulse.",
      featureBody:
        "A warm, fluid session where house music meets live improvisation—recorded as a shared moment, not a perfect performance.",
      branchesEyebrow: "One ecosystem, two practices",
      branchesTitle: "Built between the room and the image.",
      clubTitle: "NeoBee Club",
      clubBody:
        "Music, sessions, experiences, collaborations, and experiments shaped through careful curation.",
      studioTitle: "NeoBee Studio",
      studioBody:
        "Visual stories for artists, spaces, events, and independent brands.",
      sessionsEyebrow: "Selected sessions",
      sessionsTitle: "Music made for a real room.",
      experienceEyebrow: "Experiences",
      experienceTitle: "A Yunnan evening, shaped through food and sound.",
      experienceBody:
        "At Hakkahan, a menu launch became a meeting point for food, memory, and a Yunnan-themed SP-404 set.",
      experienceMeta: "Hakkahan · Dublin · 28 June 2026",
      experienceCta: "View the event record",
      studioEyebrow: "NeoBee Studio",
      studioPreviewTitle: "The visual life around the music.",
      studioPreviewBody:
        "Photography, moving image, live documentation, and visual direction for people and places with something real to say.",
      experimentEyebrow: "Experiment · Ghostframe",
      experimentTitle: "Movement becomes memory.",
      experimentBody:
        "A real-time visual experiment exploring movement, image, and memory.",
      aboutEyebrow: "About",
      aboutTitle: "Local in practice. International in outlook.",
      aboutBody:
        "The NeoBee Club is a Dublin-based creative collective exploring music, visual culture, and live experiences through carefully curated sounds, distinctive spaces, and cross-cultural collaboration.",
      finalTitle: "Make something with us.",
      finalBody: "Sessions, spaces, visual stories, and thoughtful collaborations."
    },
    club: {
      eyebrow: "NeoBee Club",
      title: "A listening culture, made visible.",
      intro:
        "Genre-fluid sessions and live experiences built around warm sound, distinctive places, and the people in the room.",
      statement:
        "We are interested in music that feels human: soulful, textured, culturally aware, and open to surprise.",
      sessionsTitle: "Sessions",
      sessionsBody:
        "Each session is a document of exchange—between selectors and players, preparation and improvisation, sound and space.",
      experiencesTitle: "Experiences",
      experiencesBody:
        "Our live format is intentionally flexible. A restaurant, gallery, courtyard, or overlooked room can become the setting when it has the right character.",
      collaborationTitle: "Collaborations",
      collaborationBody:
        "We work with independent artists, venues, and cultural partners who care about context as much as reach.",
      experimentTitle: "Experiments",
      experimentBody:
        "Technology enters when it adds a new way to feel or remember the moment. Ghostframe is our first ongoing visual study.",
      contactTitle: "Have a space, sound, or idea?"
    },
    studio: {
      eyebrow: "NeoBee Studio",
      title: "Visual stories with atmosphere and intent.",
      intro:
        "NeoBee Studio creates visual stories for artists, spaces, events, and independent brands.",
      note:
        "NeoBee Studio and NeoBee Club share the same instinct: notice the details, respect the context, and make the work feel alive.",
      servicesEyebrow: "Practice",
      servicesTitle: "From a first frame to a complete visual world.",
      servicePhoto: "Photography",
      servicePhotoBody: "Portraits, spaces, hospitality, and documentary coverage.",
      serviceFilm: "Moving image",
      serviceFilmBody: "Artist films, live sessions, event stories, and short-form campaigns.",
      serviceDirection: "Visual direction",
      serviceDirectionBody: "A coherent visual language across image, motion, and release moments.",
      selectedEyebrow: "Selected direction",
      selectedTitle: "Live documentation as a place to begin.",
      selectedBody:
        "Our selected archive traces a visual language shaped through live sound, shared spaces, and close observation.",
      contactTitle: "Tell us what you are making."
    },
    archive: {
      eyebrow: "Archive",
      title: "A selective record of sound, image, and experiment.",
      intro:
        "Not everything needs to be documented. These are the moments and studies we want to keep in view.",
      sessions: "Sessions",
      experiments: "Experiments",
      ghostframeTitle: "Ghostframe",
      ghostframeBody:
        "A real-time visual experiment exploring movement, image, and memory.",
      ghostframeMeta: "Ongoing visual study"
    },
    about: {
      eyebrow: "About",
      title: "Independent by structure. Open by nature.",
      intro:
        "The NeoBee Club is a Dublin-based creative collective working across music, visual culture, and live experience.",
      originTitle: "From Dublin, across cultures.",
      originBody:
        "Founded by Hao and Leo in Dublin, NeoBee began as a shared practice: listening closely, documenting honestly, and creating room for people and ideas that do not always fit established categories.",
      visionTitle: "Across cultures, without flattening them.",
      visionBody:
        "We bring independent voices, distinctive spaces, and curious audiences into thoughtful exchange.",
      peopleEyebrow: "People",
      peopleTitle: "Two perspectives, one evolving practice."
    },
    contact: {
      eyebrow: "Contact",
      title: "Start with the idea, not the format.",
      intro:
        "We are open to sessions, spaces, events, visual commissions, and cross-cultural collaborations.",
      clubTitle: "For NeoBee Club",
      clubBody: "Artists, selectors, venues, cultural programmes, and live collaborations.",
      studioTitle: "For NeoBee Studio",
      studioBody: "Photography, moving image, visual direction, and independent productions.",
      directTitle: "Reach us where the work is active.",
      directBody: "For projects and collaborations, email us directly or find the latest work through our active channels.",
      email: "Email The NeoBee Club",
      instagram: "The NeoBee Club on Instagram",
      youtube: "NeoBee on YouTube"
    }
  },
  zh: {
    nav: {
      home: "首页",
      club: "音乐与现场",
      studio: "视觉工作室",
      archive: "档案",
      about: "关于",
      contact: "联系",
      menu: "菜单",
      close: "关闭"
    },
    common: {
      dublin: "爱尔兰 · 都柏林",
      explore: "了解更多",
      viewAll: "查看档案",
      play: "在 YouTube 观看",
      next: "下一页",
      founded: "由 Hao 与 Leo 在都柏林创立。",
      social: "关注我们"
    },
    home: {
      eyebrow: "来自都柏林的创意团体",
      title: "声音。空间。文化。",
      intro: "我们从都柏林出发，做音乐、拍影像，也让不同文化在现场相遇。",
      clubCta: "了解 NeoBee Club",
      studioCta: "了解 NeoBee Studio",
      featureEyebrow: "精选 Session · 002",
      featureTitle: "一间房，一把吉他，共享的律动。",
      featureBody:
        "House 音乐和现场吉他即兴在同一间房里展开。我们想留下的是大家一起进入音乐的那一刻，而不是一场完美无误的演出。",
      branchesEyebrow: "一个生态，两种实践",
      branchesTitle: "发生在现场，也延伸到影像。",
      clubTitle: "NeoBee Club",
      clubBody: "我们策划音乐 Session、现场活动、合作与实验项目。",
      studioTitle: "NeoBee Studio",
      studioBody: "我们为艺术家、空间、活动和独立品牌拍摄照片与影像，并提供视觉方向。",
      sessionsEyebrow: "精选 Sessions",
      sessionsTitle: "为真实空间而生的音乐。",
      experienceEyebrow: "现场体验",
      experienceTitle: "从云\u2060南的味\u2060道，走进云\u2060南的声\u2060音。",
      experienceBody:
        "Hakkahan 发布都柏林首份云南菜单的当晚，我们带来了一套云南主题 SP-404 Set。",
      experienceMeta: "Hakkahan · 都柏林 · 2026 年 6 月 28 日",
      experienceCta: "查看活动记录",
      studioEyebrow: "NeoBee Studio",
      studioPreviewTitle: "音乐停止以\u2060后，影\u2060像还在。",
      studioPreviewBody:
        "我们用摄影、动态影像和现场记录，为艺术家、空间与活动建立一致的视觉风格。",
      experimentEyebrow: "实验 · Ghostframe",
      experimentTitle: "让动作成\u2060为记\u2060忆。",
      experimentBody: "Ghostframe 是一个实时视觉实验，用动态画面记录人的动作。",
      aboutEyebrow: "关于",
      aboutTitle: "扎根都柏林，也向不同文化敞开。",
      aboutBody:
        "The NeoBee Club 由 Hao 和 Leo 在都柏林创立。我们做音乐 Session、现场活动和视觉项目，也与来自不同文化背景的人合作。",
      finalTitle: "和我们一起做点什么。",
      finalBody: "无论是一场 Session、一个空间、一组影像，还是其他合作，都可以联系我们。"
    },
    club: {
      eyebrow: "NeoBee Club",
      title: "让聆听文化变得可见。",
      intro: "不受流派限制的 Session，围绕声音、空间和当晚在场的人展开。",
      statement: "我们喜欢有人味的音乐：有律动、有层次，也给即兴和意外留一点空间。",
      sessionsTitle: "Sessions",
      sessionsBody: "每场 Session 都来自选曲、演奏和即兴之间的配合，也会受到空间和现场氛围的影响。",
      experiencesTitle: "现场体验",
      experiencesBody: "活动不必发生在标准场地。餐厅、画廊、庭院，或一间平时被忽略的房间，只要合适，都可以变成现场。",
      collaborationTitle: "合作",
      collaborationBody: "我们愿意和认真对待内容与现场体验的独立艺术家、空间和文化项目合作。",
      experimentTitle: "实验",
      experimentBody: "技术不是目的。只有它能带来新的观看方式时，我们才会使用。Ghostframe 是我们正在进行的第一个视觉实验。",
      contactTitle: "你有一\u2060个空\u2060间、一\u2060种声\u2060音，或一\u2060个想\u2060法吗？"
    },
    studio: {
      eyebrow: "NeoBee Studio",
      title: "让影\u2060像有氛\u2060围，也有自\u2060己的表\u2060达。",
      intro: "NeoBee Studio 提供摄影、动态影像、现场记录和视觉方向。",
      note: "NeoBee Studio 和 NeoBee Club 的工作方式相同：先理解现场和内容，再决定怎么拍、怎么呈现。",
      servicesEyebrow: "我们做什么",
      servicesTitle: "从第一帧，到完\u2060整的视\u2060觉世\u2060界。",
      servicePhoto: "摄影",
      servicePhotoBody: "人物、空间、餐饮和活动现场。",
      serviceFilm: "动态影像",
      serviceFilmBody: "艺术家短片、Live Session、活动记录和社交媒体短片。",
      serviceDirection: "视觉方向",
      serviceDirectionBody: "统一照片、影像和发布内容的视觉风格。",
      selectedEyebrow: "目前的作品",
      selectedTitle: "先从现场记录开始。",
      selectedBody: "现有作品主要来自音乐 Session 和活动现场，也让我们逐渐形成自己的拍摄和呈现方式。",
      contactTitle: "想合作吗？"
    },
    archive: {
      eyebrow: "档案",
      title: "留下值\u2060得回\u2060看的声\u2060音、影\u2060像与实\u2060验。",
      intro: "这里收录我们做过的 Session、活动记录和仍在进行的实验。",
      sessions: "Sessions",
      experiments: "实验",
      ghostframeTitle: "Ghostframe",
      ghostframeBody: "Ghostframe 用实时生成的动态画面记录人的动作。",
      ghostframeMeta: "进行中的视觉实验"
    },
    about: {
      eyebrow: "关于",
      title: "结构独立，天性开放。",
      intro: "The NeoBee Club 是 Hao 和 Leo 在都柏林创立的创意团体，工作包括音乐、影像和现场活动。",
      originTitle: "从都柏林出发，也不止于都柏林。",
      originBody: "NeoBee 从音乐策划、现场记录和共同创作开始，后来逐渐延伸到影像、活动和跨文化合作。",
      visionTitle: "让不同文化相遇，也保留各自的样子。",
      visionBody: "我们希望独立音乐、独特空间和不同文化背景的人，可以在尊重彼此的前提下真正交流。",
      peopleEyebrow: "成员",
      peopleTitle: "Hao 与 Leo。"
    },
    contact: {
      eyebrow: "联系",
      title: "先说想法，不必先定\u2060义形\u2060式。",
      intro: "无论是音乐 Session、场地活动、视觉拍摄，还是跨文化合作，都欢迎联系我们。",
      clubTitle: "NeoBee Club",
      clubBody: "音乐人、选曲人、场地与文化项目都可以联系我们。",
      studioTitle: "NeoBee Studio",
      studioBody: "摄影、动态影像、视觉方向与独立制作。",
      directTitle: "合作，从一\u2060封邮\u2060件开\u2060始。",
      directBody: "项目与合作请直接发邮件。最新作品会发布在 Instagram 和 YouTube。",
      email: "发送邮件",
      instagram: "在 Instagram 查看最新动态",
      youtube: "在 YouTube 观看作品"
    }
  }
} as const;

export const sessions = [
  {
    id: "session-002",
    number: "002",
    title: "Jazzy House with Live Guitar",
    description: {
      en: "House, jazz colour, and live improvisation in one continuous room.",
      zh: "一段连续的 House Session，加入爵士色彩和现场吉他即兴。"
    } satisfies LocalizedText,
    image: "/session-jazzy-house.jpg",
    youtube: "https://www.youtube.com/watch?v=unfvfyO3lOk",
    year: "2025",
    uploadDate: "2025-06-11",
    duration: "22:22",
    durationSeconds: 1342
  },
  {
    id: "session-001",
    number: "001",
    title: "Funky House Session",
    description: {
      en: "A soulful, guitar-led live session with funk running through its centre.",
      zh: "一场以现场吉他为主线的 Soulful House / Funk Session。"
    } satisfies LocalizedText,
    image: "/session-funky-house.jpg",
    youtube: "https://www.youtube.com/watch?v=eVjDLGp4xY8",
    year: "2025",
    uploadDate: "2025-01-05",
    duration: "37:00",
    durationSeconds: 2220
  }
] as const;

export const experiences = [
  {
    id: "yunnan-menu-sp404-set-2026",
    title: {
      en: "Yunnan Menu Launch & SP-404 Set",
      zh: "云南菜单发布与 SP-404 云南主题 Set"
    } satisfies LocalizedText,
    description: {
      en: "The NeoBee Club joined Hakkahan for the launch of Dublin's first Yunnan menu. A Yunnan-themed SP-404 set brought music into the evening.",
      zh: "The NeoBee Club 参与了 Hakkahan 的都柏林首份云南菜单发布，并在现场带来一套云南主题 SP-404 Set。"
    } satisfies LocalizedText,
    image: "/yunnan-menu-sp404-set.webp",
    date: {
      en: "Sunday, 28 June 2026",
      zh: "2026 年 6 月 28 日，星期日"
    } satisfies LocalizedText,
    dateISO: "2026-06-28",
    time: "18:00–19:00",
    venue: "Hakkahan",
    address: "32 Stoneybatter, Dublin 7, D07 X504",
    href: "https://ma.to/event/yunnan-menu-launch-kawa-band-28-jun-2026"
  }
] as const;

export const founders = [
  {
    id: "hao",
    name: "Hao",
    role: {
      en: "Music & Artistic Direction",
      zh: "音乐与艺术方向"
    } satisfies LocalizedText,
    bio: {
      en: "Hao shapes NeoBee's musical and artistic perspective through curation, performance, cultural programming, and ongoing experimentation.",
      zh: "Hao 主要负责音乐策划、现场表演与艺术方向，也推动 NeoBee 的文化项目和实验创作。"
    } satisfies LocalizedText,
    image: "/haosc.webp",
    socials: [
      { label: "Instagram", href: "https://www.instagram.com/haosc.official" },
      { label: "Spotify", href: "https://open.spotify.com/artist/0ASsfvcyv6P3TVLEYLurds" },
      { label: "YouTube", href: "https://www.youtube.com/@HAOSC" },
      { label: "Bilibili", href: "https://space.bilibili.com/3546828570101837" }
    ]
  },
  {
    id: "leo",
    name: "Leo",
    role: {
      en: "Visual & Creative Production",
      zh: "视觉与创意制作"
    } satisfies LocalizedText,
    bio: {
      en: "Leo develops NeoBee's visual language through photography, moving image, live documentation, and creative production.",
      zh: "Leo 主要负责摄影、动态影像和现场记录，并统筹 NeoBee 的视觉制作。"
    } satisfies LocalizedText,
    image: "/leo.webp",
    socials: [
      { label: "Bilibili", href: "https://space.bilibili.com/327769785" }
    ]
  }
] as const;

export const socialLinks = {
  email: "mailto:theneobeeclub@gmail.com",
  instagram: "https://www.instagram.com/theneobeeclub",
  youtube: "https://youtube.com/@theneobeeclub",
  ghostframe: "https://visual.theneobee.club"
} as const;
