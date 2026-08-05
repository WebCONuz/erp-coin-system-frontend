import { ActivityIcon, LayoutList } from "lucide-react";

export const StudentBalance = () => {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
        O'quvchilar statistikasi
      </h2>

      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-8">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
            O'rtacha BB-coin balansi
          </h3>
          <div className="flex flex-col items-center gap-y-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-lg border border-gray-400 bg-gray-100 dark:bg-zinc-800/60 dark:border-zinc-700">
              <ActivityIcon className="w-8 h-8 text-gray-400 dark:text-zinc-400" />
            </div>
            <p className="text-center text-zinc-900 dark:text-zinc-50">
              Hali ma'lumot yo'q. Ma'lumot yig'ilgach, bu yerda guruhning
              <br />
              o'rtacha balansi grafigi paydo bo'ladi
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-8">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
            Guruh haftalik faolligi
          </h3>
          <div className="flex flex-col items-center gap-y-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-lg border border-gray-400 bg-gray-100 dark:bg-zinc-800/60 dark:border-zinc-700">
              <LayoutList className="w-8 h-8 text-gray-400 dark:text-zinc-400" />
            </div>
            <p className="text-center text-zinc-900 dark:text-zinc-50">
              Faollik tahlili kutilmoqda.
              <br /> Haftalik guruh faolligi bu yerda ko'rinadi
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
