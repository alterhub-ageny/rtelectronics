import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en/translation.json";
import fr from "../locales/fr/translation.json";
import ar from "../locales/ar/translation.json";

const stored = typeof window !== "undefined" ? localStorage.getItem("rt-lang") : null;
const browser = typeof navigator !== "undefined" ? navigator.language?.split("-")[0] : "en";
const lng = stored || (["en", "fr", "ar"].includes(browser) ? browser : "en");

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, fr: { translation: fr }, ar: { translation: ar } },
  lng,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

const detect = () => lng;

i18n.on("languageChanged", (lang) => {
  localStorage.setItem("rt-lang", lang);
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lang;
});

document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
document.documentElement.lang = lng;

export { detect };
export default i18n;
