import { MoreVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCourses } from "../../hooks";
import { NoData } from "@/components/partials/no-data";
import { useTranslation } from "react-i18next";
import { NoDataBox } from "@/features/tenants/components/ui";
import { PageLoading } from "@/components/loading";

export const GroupCategory = () => {
  const { data: courses, isLoading } = useCourses();
  const { t } = useTranslation();

  return (
    <aside className="flex flex-col gap-y-2.5 rounded-2xl bg-background p-6 shadow-sm min-h-[calc(100vh-105px)]">
      <h3 className="text-lg font-semibold pb-3">Kurslar</h3>

      {isLoading ? (
        <PageLoading />
      ) : courses?.data ? (
        <>
          {courses.data.length === 0 ? (
            <NoDataBox
              title={t("courses.no_data")}
              btnText={t("courses.btn.create")}
              btnFn={() => console.log("create")}
            />
          ) : (
            <>
              <div className="py-2 px-3 cursor-pointer text-lg font-medium rounded-md bg-bg-primary dark:bg-black hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20">
                {t("courses.all")}
              </div>
              {courses.data.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 px-3 cursor-pointer text-lg font-medium rounded-md bg-bg-primary dark:bg-black hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20"
                >
                  <span>{item.title}</span>
                  <button>
                    <MoreVertical size={20} />
                  </button>
                </div>
              ))}
              <Button className="mt-2 h-12 flex items-center gap-x-2 justify-center text-lg font-medium rounded-md bg-primary/90 hover:bg-primary text-white">
                <Plus />
                <span>{t("courses.btn.add")}</span>
              </Button>
            </>
          )}
        </>
      ) : (
        <NoData text={t("no_loading")} />
      )}
    </aside>
  );
};
