import { useTranslation } from "react-i18next";
import { Form } from "@/components/ui/form";
import { ControlledDatePicker, ControlledSelect } from "@/components/controls";
import {
  ALL_VALUE,
  getIsCheckedOptions,
  getSessionTypeOptions,
} from "@/features/sessions/constants";
import { useSessionTypes } from "@/features/sessions/hooks";
import { useMyTaughtGroups, useTeacherSessionsFilter } from "../../hooks";

export const TeacherSessionsFilterBar = () => {
  const { t } = useTranslation();
  const { form } = useTeacherSessionsFilter();
  const { data: groups } = useMyTaughtGroups();
  const { data: sessionTypes } = useSessionTypes();
  const sessionType = form.watch("sessionType");

  const groupOptions = [
    { value: ALL_VALUE, label: t("sessions.filter.allGroups") },
    ...(groups ?? []).map((g) => ({ value: g.id, label: g.name })),
  ];
  const typeOptions = [
    { value: ALL_VALUE, label: t("sessions.filter.allTypes") },
    ...getSessionTypeOptions(t, sessionTypes),
  ];
  const isCheckedOptions = [
    { value: ALL_VALUE, label: t("sessions.filter.allCheckStatuses") },
    ...getIsCheckedOptions(t),
  ];

  return (
    <Form {...form}>
      <div
        role="search"
        className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2.5"
      >
        <div className="min-w-0 sm:w-48">
          <ControlledSelect
            control={form.control}
            name="groupId"
            options={groupOptions}
            placeholder={t("common.group")}
          />
        </div>
        <div className="min-w-0 sm:w-40">
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
          className="min-w-0 sm:min-w-42"
          buttonClassName="h-8"
        />
        {sessionType === "lesson" && (
          <div className="min-w-0 sm:w-44">
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
