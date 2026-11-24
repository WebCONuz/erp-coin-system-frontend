import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen } from "lucide-react";
import { FilterNav } from "@/components/shared/filter-nav";
import { useCourses, useDeleteCourse } from "../../hooks";
import { CourseFormModal } from "../modals";
import type { CourseItem } from "../../types";

/** Kurslar filtri (`?course=`). */
export const GroupCategory = () => {
  const { data: courses, isLoading, isError, refetch, isFetching } =
    useCourses();
  const deleteCourse = useDeleteCourse();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  // Tanlangan kurs — URL'dan hisoblanadi (alohida state kerak emas).
  const selectedCourse = searchParams.get("course") || "all";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [activeCourseData, setActiveCourseData] = useState<
    CourseItem | undefined
  >(undefined);

  const selectCourse = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("course", value);
    setSearchParams(newParams, { replace: true });
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setActiveCourseData(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (courseItem: CourseItem) => {
    setModalMode("edit");
    setActiveCourseData(courseItem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveCourseData(undefined);
  };

  const handleDelete = (courseId: string) => {
    if (window.confirm(t("courses.delete_confirm"))) {
      deleteCourse.mutate(courseId);
    }
  };

  const items = [
    { id: "all", title: t("courses.all") },
    ...(courses?.data ?? []).map((c) => ({
      id: c.id,
      title: c.title,
      onEdit: () => handleOpenEdit(c),
      onDelete: () => handleDelete(c.id),
    })),
  ];

  return (
    <>
      <FilterNav
        title={t("courses.title")}
        items={items}
        selectedId={selectedCourse}
        onSelect={selectCourse}
        onAdd={handleOpenCreate}
        addLabel={t("courses.btn.add")}
        createLabel={t("courses.btn.create")}
        emptyTitle={t("courses.no_data")}
        emptyIcon={BookOpen}
        isLoading={isLoading}
        isError={isError && !courses}
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />

      <CourseFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        course={activeCourseData}
      />
    </>
  );
};
