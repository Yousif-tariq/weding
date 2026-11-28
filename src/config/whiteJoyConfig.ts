export interface WhiteJoyConfig {
  brand: {
    experienceTitle: string;
    groomAr: string;
    brideAr: string;
    coupleJoinAr: string;
    monogramAr: string;
    families: [string, string];
  };
  intro: {
    poeticLine: string;
    skipLabel: string;
    openButtonLabel: string;
  };
  media: {
    /** Supports drop-in .webp / .png or optional .webm / .mp4 video */
    carImage: string;
    carVideoUrl: string | null;
    envelopeImage: string;
    receptionPhoto: string;
    zaffaPhoto: string;
    jirtiqPhoto: string;
    /** Optional custom background music .mp3/.ogg URL (uses Web Audio cinematic score if null) */
    ambientMusicUrl: string | null;
  };
  event: {
    isoDate: string;
    dayLabelAr: string;
    gregorianDisplayAr: string;
    timeDisplayAr: string;
    receptionTimeAr: string;
    durationHours: number;
  };
  venue: {
    name: string;
    cityDistrict: string;
    mapsUrl: string;
    whatsappNumber: string;
    whatsappDisplay: string;
  };
  chapters: {
    welcome: {
      title: string;
      eyebrow: string;
      message: string;
      closingLine: string;
    };
    jirtiq: {
      title: string;
      eyebrow: string;
      zaffaCopy: string;
      jirtiqCopy: string;
      traditionalCheer: string;
    };
    date: {
      title: string;
      eyebrow: string;
      blessingLine: string;
    };
    location: {
      title: string;
      eyebrow: string;
      openMapLabel: string;
    };
  };
  audio: {
    enabledByDefault: boolean;
  };
}

export const WHITE_JOY_CONFIG: WhiteJoyConfig = {
  brand: {
    experienceTitle: "ليلة الفرح الأبيض",
    groomAr: "مصطفى",
    brideAr: "إيثار",
    coupleJoinAr: "وإيثار",
    monogramAr: "م & إ",
    families: ["آل عبد الله يوسف زكريا", "آل مبارك محمد عبد الله"],
  },
  intro: {
    poeticLine:
      "وزول يحلم بالعديلة\nوفرحة الريد الطويل\nوناس تجيهو تغنّي ليهو\nناس تبارك وناس تهنّئ",
    skipLabel: "تخطّي",
    openButtonLabel: "افتحوا دعوتنا",
  },
  media: {
    carImage: "/images/wedding-car.png",
    carVideoUrl: null,
    envelopeImage: "/images/wedding-envelope.png",
    receptionPhoto: "/images/reception.jpg",
    zaffaPhoto: "/images/arrival.jpg",
    jirtiqPhoto: "/images/jirtiq.jpg",
    ambientMusicUrl: "/audio/ordinary-alex-warren.mp3",
  },
  event: {
    isoDate: "2026-12-03T20:00:00+03:00",
    dayLabelAr: "يوم الخميس",
    gregorianDisplayAr: "٣ ديسمبر ٢٠٢٦ م",
    timeDisplayAr: "الساعة ٨:٠٠ مساءً",
    receptionTimeAr: "الاستقبال ٧:٣٠ مساءً",
    durationHours: 5,
  },
  venue: {
    name: "قاعة ريماس للاحتفالات",
    cityDistrict: "الرياض — حي الشفاء",
    mapsUrl: "https://maps.app.goo.gl/PpPdYDgY5c9Vi3b18?g_st=iw",
    whatsappNumber: "966530124082",
    whatsappDisplay: "+966 53 012 4082",
  },
  chapters: {
    welcome: {
      title: "بحضوركم تكتمل فرحتنا",
      eyebrow: "الفصل الأول · الاستقبال",
      message:
        "بقلوبٍ يملؤها الشوق، وتغمرها السعادة، نتشرّف بدعوتكم لتكونوا شركاء فرحتنا، وتشاركونا ليلةً من ليالي العمر الجميلة، نحتفي فيها بأجمل المناسبات، ونرجو أن تكتمل أفراحنا بوجودكم، فأنتم للّمة عنوان، وللفرح أجمل حضور.",
      closingLine: "أهلاً بمن أناروا ليلتنا وتشرفنا بهم",
    },
    jirtiq: {
      title: "زفة العمر وبركة الجرتق",
      eyebrow: "الفصل الثاني · الأصالة والفرح",
      zaffaCopy:
        "لحظةٌ تتهادى فيها الأضواء وتعلو الزغاريد ابتهاجاً بإطلالة مصطفى وإيثار في ممرّ الفرح.",
      jirtiqCopy:
        "تمتزج الفخامة العصرية بجمال الجرتق السوداني الأصيل؛ الحريرة والضريرة وعبق الصندل ودعوات الأهل.",
      traditionalCheer: "«يا عديلة يا بيضاء.. وسحائب بركة تفيض بالهناء»",
    },
    date: {
      title: "موعدُ لقائنا والفرح",
      eyebrow: "الفصل الثالث · التاريخ والوقت",
      blessingLine: "ذلك بمشيئة الله تعالى — حضوركم يشرفنا",
    },
    location: {
      title: "قاعة لقائنا السعيد",
      eyebrow: "الفصل الرابع · الوجهة",
      openMapLabel: "فتح الموقع في Google Maps",
    },
  },
  audio: {
    enabledByDefault: true,
  },
};
