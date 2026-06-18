export type MoodTone =
  | "อ่อนโยน"
  | "เหงาแต่สวย"
  | "เริ่มใหม่"
  | "ปล่อยวาง"
  | "กอดตัวเอง"
  | "กวน ๆ นิด ๆ แต่ยังฮีลใจ";

export type SkyResult = {
  isSkyOrNature: boolean;
  nonSkyMessage?: string;
  skyName: string;
  moodSummary: string;
  healingMessage: string;
  storyText: string;
  tinyAction: string;
  hashtags: string[];
  fallback?: boolean;
  fallbackMessage?: string;
};

export type AnalyzeSkyRequest = {
  image: string;
  tone: MoodTone;
};
