import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
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
import { ALL_VALUE, sessionTypeOptions } from "../constants";

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
  const { form } = useFilter();
  const { data: groups } = useSessionGroupOptions();
  const { data: teachers } = useSessionTeacherOptions();

  const groupOptions: IOption[] = [
    { value: ALL_VALUE, label: "Barcha guruhlar" },
    ...(groups?.data ?? []).map((g) => ({ value: g.id, label: g.name })),
  ];

  const teacherOptions: IOption[] = [
    { value: ALL_VALUE, label: "Barcha o'qituvchilar" },
    ...(teachers?.data ?? []).map((t) => ({ value: t.id, label: t.fullName })),
  ];

  const typeOptions: IOption[] = [
    { value: ALL_VALUE, label: "Barcha turlar" },
    ...sessionTypeOptions,
  ];

  return (
    <Form {...form}>
      <div className={`${hasAction && "w-full"} space-y-3`}>
        {hasAction && (
          <div className="flex items-center justify-between">
            <DashboardTitle title="Darslar" />
            <Button
              onClick={onAdd}
              className="bg-linear-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-lg px-4 h-9 gap-2 shadow-sm duration-200"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Dars qo'shish</span>
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
                placeholder="Guruh"
              />
            </div>
          )}
          {pageName !== "teacher" && (
            <div className="w-44">
              <ControlledSelect
                control={form.control}
                name="teacherId"
                options={teacherOptions}
                placeholder="O'qituvchi"
              />
            </div>
          )}
          <div className="w-36">
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
            buttonClassName="h-8"
          />
        </div>
      </div>
    </Form>
  );
};
