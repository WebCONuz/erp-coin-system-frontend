import { useTranslation } from "react-i18next";
import { Form } from "@/components/ui/form";
import { ControlledDatePicker, ControlledSelect } from "@/components/controls";
import {
  ALL_VALUE,
  getIsCheckedOptions,
  getSessionTypeOptions,
} from "@/features/sessions/constants";
import { useMyTaughtGroups, useTeacherSessionsFilter } from "../../hooks";

export const TeacherSessionsFilterBar = () => {
  const { t } = useTranslation();
  const { form } = useTeacherSessionsFilter();
  const { data: groups } = useMyTaughtGroups();
  const sessionType = form.watch("sessionType");

  const groupOptions = [
    { value: ALL_VALUE, label: t("sessions.filter.allGroups") },
    ...(groups ?? []).map((g) => ({ value: g.id, label: g.name })),
  ];
  const typeOptions = [
    { value: ALL_VALUE, label: t("sessions.filter.allTypes") },
    ...getSessionTypeOptions(t),
  ];
  const isCheckedOptions = [
    { value: ALL_VALUE, label: t("sessions.filter.allCheckStatuses") },
    ...getIsCheckedOptions(t),
  ];

  return (
    <Form {...form}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-48">
          <ControlledSelect
            control={form.control}
            name="groupId"
            options={groupOptions}
            placeholder={t("common.group")}
          />
        </div>
        <div className="w-40">
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
    </Form>
  );
};
