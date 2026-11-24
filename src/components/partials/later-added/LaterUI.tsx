import { useTranslation } from "react-i18next";

export const LaterUI = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center">
      <div className="bg-card rounded-2xl mb-4 pb-2">
        <img src="/coming_soon.png" alt="coming soon" className="w-75" />
      </div>
      <h2 className="text-3xl font-extrabold mb-2">
        {t("system.comingSoon.title")}
      </h2>
      <p className="text-muted-foreground text-lg max-w-100 text-center leading-6">
        {t("system.comingSoon.description")}
      </p>
    </div>
  );
};
