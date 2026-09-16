import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DashboardTitle } from "@/components/shared/title";
import {
  ControlledDatePicker,
  ControlledSelect,
  type IOption,
} from "@/components/controls";
import {
  useFilter,
  useSessionGroupOptions,
  useSessionTeacherOptions,
} from "../hooks";
import { ALL_VALUE, getIsCheckedOptions, getSessionTypeOptions } from "../constants";

interface Props {
  onAdd?: () => void;
  hasAction?: boolean;
  pageName?: "teacher" | "group" | "session";
}

export const SessionsFilterBar = ({
  onAdd,
  hasAction = true,
  pageName = "session",
}: Props) => {
  const { t } = useTranslation();
  const { form } = useFilter();
  const { data: groups } = useSessionGroupOptions();
  const { data: teachers } = useSessionTeacherOptions();
  const sessionType = form.watch("sessionType");

  const groupOptions: IOption[] = [
    { value: ALL_VALUE, label: t("sessions.filter.allGroups") },
    ...(groups?.data ?? []).map((g) => ({ value: g.id, label: g.name })),
  ];

  const teacherOptions: IOption[] = [
    { value: ALL_VALUE, label: t("sessions.filter.allTeachers") },
    ...(teachers?.data ?? []).map((tch) => ({
      value: tch.id,
      label: tch.fullName,
    })),
  ];

  const typeOptions: IOption[] = [
    { value: ALL_VALUE, label: t("sessions.filter.allTypes") },
    ...getSessionTypeOptions(t),
  ];

  const isCheckedOptions: IOption[] = [
    { value: ALL_VALUE, label: t("sessions.filter.allCheckStatuses") },
    ...getIsCheckedOptions(t),
  ];

  return (
    <Form {...form}>
      <div className={`${hasAction && "w-full"} space-y-3`}>
        {hasAction && (
          <div className="flex items-center justify-between">
            <DashboardTitle title={t("admin.header.sessions")} />
            <Button
              onClick={onAdd}
              className="bg-linear-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-lg px-4 h-9 gap-2 shadow-sm duration-200"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">
                {t("sessions.filter.addSession")}
              </span>
            </Button>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {pageName !== "group" && (
            <div className="w-44">
              <ControlledSelect
                control={form.control}
                name="groupId"
                options={groupOptions}
                placeholder={t("common.group")}
              />
            </div>
          )}
          {pageName !== "teacher" && (
            <div className="w-44">
              <ControlledSelect
                control={form.control}
                name="teacherId"
                options={teacherOptions}
                placeholder={t("common.teacher")}
              />
            </div>
          )}
          <div className="w-36">
            <ControlledSelect
              control={form.control}
              name="sessionType"
              options={typeOptions}
              placeholder={t("sessions.typeLabel")}
            />
          </div>
          <ControlledDatePicker
            control={form.control}
            name="date"
            placeholder={t("common.date")}
            className="min-w-42"
            buttonClassName="h-8"
          />
          {sessionType === "lesson" && (
            <div className="w-44">
              <ControlledSelect
                control={form.control}
                name="isChecked"
                options={isCheckedOptions}
                placeholder={t("sessions.filter.isCheckedLabel")}
              />
            </div>
          )}
        </div>
      </div>
    </Form>
  );
};
