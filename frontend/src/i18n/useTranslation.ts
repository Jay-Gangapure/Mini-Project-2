import { translations, Translations, Lang } from "./translations";

// Import AuthContext type without causing circular deps
import { useAuth } from "../context/AuthContext";

export function useTranslation(): { t: Translations; lang: Lang } {
  try {
    const { language } = useAuth();
    const t = translations[language] as Translations;
    return { t, lang: language };
  } catch {
    // Fallback to English if auth context is not available
    return { t: translations.en as Translations, lang: "en" };
  }
}

/** Helper to get font family based on language for proper Devanagari rendering */
export function getLangFont(lang: Lang): string {
  if (lang === "hi" || lang === "mr") {
    return "'Noto Sans Devanagari', 'Inter', sans-serif";
  }
  return "'Inter', sans-serif";
}
