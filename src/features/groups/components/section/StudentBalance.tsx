import { ActivityIcon, LayoutList } from "lucide-react";
import { useTranslation } from "react-i18next";

export const StudentBalance = () => {
  const { t } = useTranslation();

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
        {t("groups.balance.title")}
      </h2>

      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-8">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
            {t("groups.balance.avgTitle")}
          </h3>
          <div className="flex flex-col items-center gap-y-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-lg border border-gray-400 bg-gray-100 dark:bg-zinc-800/60 dark:border-zinc-700">
              <ActivityIcon className="w-8 h-8 text-gray-400 dark:text-zinc-400" />
            </div>
            <p className="text-center text-zinc-900 dark:text-zinc-50">
              {t("groups.balance.avgEmpty1")}
              <br />
              {t("groups.balance.avgEmpty2")}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-8">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
            {t("groups.balance.activityTitle")}
          </h3>
          <div className="flex flex-col items-center gap-y-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-lg border border-gray-400 bg-gray-100 dark:bg-zinc-800/60 dark:border-zinc-700">
              <LayoutList className="w-8 h-8 text-gray-400 dark:text-zinc-400" />
            </div>
            <p className="text-center text-zinc-900 dark:text-zinc-50">
              {t("groups.balance.activityEmpty1")}
              <br /> {t("groups.balance.activityEmpty2")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
