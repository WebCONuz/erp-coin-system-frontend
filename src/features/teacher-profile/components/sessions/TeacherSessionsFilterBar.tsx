import { Form } from "@/components/ui/form";
import { ControlledDatePicker, ControlledSelect } from "@/components/controls";
import { ALL_VALUE, sessionTypeOptions } from "@/features/sessions/constants";
import { useMyTaughtGroups, useTeacherSessionsFilter } from "../../hooks";

export const TeacherSessionsFilterBar = () => {
  const { form } = useTeacherSessionsFilter();
  const { data: groups } = useMyTaughtGroups();

  const groupOptions = [
    { value: ALL_VALUE, label: "Barcha guruhlar" },
    ...(groups ?? []).map((g) => ({ value: g.id, label: g.name })),
  ];
  const typeOptions = [
    { value: ALL_VALUE, label: "Barcha turlar" },
    ...sessionTypeOptions,
  ];

  return (
    <Form {...form}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-48">
          <ControlledSelect
            control={form.control}
            name="groupId"
            options={groupOptions}
            placeholder="Guruh"
          />
        </div>
        <div className="w-40">
          <ControlledSelect
            control={form.control}
            name="sessionType"
            options={typeOptions}
            placeholder="Turi"
          />
        </div>
        <ControlledDatePicker
          control={form.control}
          name="date"
          placeholder="Sana"
          className="min-w-42"
        />
      </div>
    </Form>
  );
};
