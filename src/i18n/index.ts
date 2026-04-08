import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import uz_cr from "./locales/uz_cr/translation.json";
import ru from "./locales/ru/translation.json";
import uz from "./locales/uz/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "uz",
    supportedLngs: ["uz", "ru", "en"],
    defaultNS: "common",
    resources: {
      uz_cr: { common: uz_cr },
      ru: { common: ru },
      uz: { common: uz },
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
