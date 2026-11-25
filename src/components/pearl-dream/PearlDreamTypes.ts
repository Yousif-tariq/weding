export type GateId = "welcome" | "jirtiq" | "date" | "location";

export type DreamWorldId = "hub" | GateId;

export type ExperienceCameraState = "intro" | "envelope" | DreamWorldId;

export interface GateMeta {
  id: GateId;
  titleAr: string;
  subtitleAr: string;
  shape: "oval" | "arch" | "organic" | "circle";
}

export const DREAM_GATES_META: GateMeta[] = [
  {
    id: "welcome",
    titleAr: "بحضوركم يزدان فرحنا",
    subtitleAr: "عالم الورد الأبيض والحرير",
    shape: "oval",
  },
  {
    id: "jirtiq",
    titleAr: "زفة العمر وبركة الجرتق",
    subtitleAr: "أصالة الجرتق السوداني",
    shape: "arch",
  },
  {
    id: "date",
    titleAr: "موعد ليلتنا المباركة",
    subtitleAr: "الساعة السماوية للفرح",
    shape: "organic",
  },
  {
    id: "location",
    titleAr: "قاعة لقائنا السعيد",
    subtitleAr: "قاعة ريماس · الرياض",
    shape: "circle",
  },
];
