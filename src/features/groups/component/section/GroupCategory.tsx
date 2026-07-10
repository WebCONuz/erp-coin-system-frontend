import { Pencil, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCourses } from "../../hooks";
import { NoData } from "@/components/partials/no-data";
import { useTranslation } from "react-i18next";
import { NoDataBox } from "@/features/tenants/components/ui";
import { PageLoading } from "@/components/loading";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CourseFormModal } from "../modals";

export const GroupCategory = () => {
  const { data: courses, isLoading } = useCourses();
  const { t } = useTranslation();
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [searchParams, setSearchParams] = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [activeCourseData, setActiveCourseData] = useState<any>(undefined);

  const selectCourse = (key: string, value: string | undefined | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "all") {
      newParams.set(key, value);
      setSearchParams(newParams, { replace: true });
      setSelectedCourse("all");
    } else {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      setSearchParams(newParams, { replace: true });
      setSelectedCourse(value || "");
    }
  };

  const courseQuery = searchParams.get("course");
  useEffect(() => {
    if (courseQuery) {
      setSelectedCourse(courseQuery);
    } else {
      setSelectedCourse("all");
    }
  }, [courseQuery]);

  const handleOpenCreate = () => {
    setModalMode("create");
    setActiveCourseData(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, courseItem: any) => {
    e.stopPropagation();
    setModalMode("edit");
    setActiveCourseData(courseItem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveCourseData(undefined);
  };

  return (
    <>
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
                <div
                  onClick={() => selectCourse("course", "all")}
                  className={`py-2 px-3 cursor-pointer text-lg font-medium rounded-md hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 ${selectedCourse === "all" ? "bg-primary/10 dark:bg-primary/20 text-primary" : "bg-bg-primary dark:bg-black"}`}
                >
                  {t("courses.all")}
                </div>
                {courses.data.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => selectCourse("course", item.id)}
                    className={`flex items-center justify-between py-2 px-3 cursor-pointer text-lg font-medium rounded-md hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 ${selectedCourse === item.id ? "bg-primary/10 dark:bg-primary/20 text-primary" : "bg-bg-primary dark:bg-black"}`}
                  >
                    <span>{item.title}</span>
                    <div className="flex gap-x-2.5">
                      <Pencil
                        size="15"
                        className="text-gray-500 hover:text-green-600 cursor-pointer opacity-50 hover:opacity-100 duration-150"
                        onClick={(e) => handleOpenEdit(e, item)}
                      />
                      <Trash
                        size="15"
                        className="text-gray-500 hover:text-red-600 cursor-pointer opacity-50 hover:opacity-100 duration-150"
                      />
                    </div>
                  </div>
                ))}
                <Button
                  onClick={handleOpenCreate}
                  className="mt-2 h-12 flex items-center gap-x-2 justify-center text-lg font-medium rounded-md bg-primary/90 hover:bg-primary text-white"
                >
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

      <CourseFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        course={activeCourseData}
      />
    </>
  );
};
