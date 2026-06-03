import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import uz_cr from "@/assets/locales/uz_cr/translation.json";
import ru from "@/assets/locales/ru/translation.json";
import uz from "@/assets/locales/uz/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "uz",
    supportedLngs: ["uz", "ru", "uz_cr"],
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
