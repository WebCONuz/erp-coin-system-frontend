import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getTemplateFormSchema, type TemplateFormValues } from "../schema";
import { useCreateScheduleTemplate, useUpdateScheduleTemplate } from "../hooks";
import { GROUP_TEACHER_VALUE, WEEKDAY_LABELS } from "../constants";
import { WEEKDAYS, type ScheduleTemplate, type Weekday } from "../types";
import { useGroups } from "@/features/groups/hooks";
import { useRooms } from "@/features/rooms/hooks";
import { useTeachers } from "@/features/teachers/hooks";
import { useSubjects } from "@/features/subjects/hooks";
import { useCurrentTenant } from "@/features/tenants/hooks";
import { ControlledSelect } from "@/components/controls";

interface TemplateFormModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  weekday: Weekday;
  lockWeekday?: boolean;
  presetGroupId?: string;
  lockGroup?: boolean;
  template?: ScheduleTemplate;
}

export const TemplateFormModal = ({
  open,
  onClose,
  mode,
  weekday,
  lockWeekday = true,
  presetGroupId,
  lockGroup = false,
  template,
}: TemplateFormModalProps) => {
  const isEdit = mode === "edit";
  const createTemplate = useCreateScheduleTemplate();
  const updateTemplate = useUpdateScheduleTemplate(template?.id ?? "");
  const isPending = createTemplate.isPending || updateTemplate.isPending;

  const { data: groups } = useGroups();
  const { data: rooms } = useRooms();
  const { data: teachers } = useTeachers({});
  const { data: subjects } = useSubjects();
  const { isLearningCenter } = useCurrentTenant();
  const showSubject = !isLearningCenter;

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(getTemplateFormSchema(showSubject)),
    defaultValues: {
      weekday,
      groupId: "",
      roomId: "",
      teacherId: GROUP_TEACHER_VALUE,
      subjectId: "",
      startTime: "",
      endTime: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    if (isEdit && template) {
      form.reset({
        weekday: template.weekday,
        groupId: template.groupId ?? template.group.id,
        roomId: template.roomId ?? template.room.id,
        teacherId:
          template.teacherId ?? template.teacher?.id ?? GROUP_TEACHER_VALUE,
        subjectId: template.subjectId ?? template.subject?.id ?? "",
        startTime: template.startTime,
        endTime: template.endTime,
      });
    } else {
      form.reset({
        weekday,
        groupId: lockGroup ? (presetGroupId ?? "") : "",
        roomId: "",
        teacherId: GROUP_TEACHER_VALUE,
        subjectId: "",
        startTime: "",
        endTime: "",
      });
    }
  }, [open, isEdit, template, weekday, lockGroup, presetGroupId, form]);

  const onError = (error: any) =>
    toast.error(error?.data?.message || "Xatolik yuz berdi");

  const onSubmit = (values: TemplateFormValues) => {
    const teacherId =
      values.teacherId === GROUP_TEACHER_VALUE ? undefined : values.teacherId;

    if (isEdit && template) {
      updateTemplate.mutate(
        {
          startTime: values.startTime,
          endTime: values.endTime,
          roomId: values.roomId,
          teacherId: teacherId ?? null,
          subjectId: values.subjectId || null,
        },
        { onSuccess: () => onClose(), onError },
      );
    } else {
      createTemplate.mutate(
        { ...values, teacherId, subjectId: values.subjectId || undefined },
        {
          onSuccess: () => onClose(),
          onError,
        },
      );
    }
  };

  const activeGroupId = isEdit
    ? (template?.groupId ?? template?.group.id)
    : lockGroup
      ? presetGroupId
      : form.watch("groupId");
  const groupDefaultTeacherName = groups?.data.find(
    (g) => g.id === activeGroupId,
  )?.teacher?.fullName;

  const teacherOptions = [
    {
      value: GROUP_TEACHER_VALUE,
      label: groupDefaultTeacherName
        ? `Guruh o'qituvchisi (${groupDefaultTeacherName})`
        : "Guruh o'qituvchisi",
    },
    ...(teachers?.data.map((t) => ({ label: t.fullName, value: t.id })) ?? []),
  ];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-100 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-50">
            {isEdit ? "Shablonni tahrirlash" : "Yangi shablon qo'shish"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {isEdit || lockWeekday ? (
              <div>
                <FormLabel>Hafta kuni</FormLabel>
                <div className="mt-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-muted/50 px-3 py-2 text-sm">
                  {WEEKDAY_LABELS[weekday]}
                </div>
              </div>
            ) : (
              <ControlledSelect
                name="weekday"
                label="Hafta kuni"
                control={form.control}
                options={WEEKDAYS.map((item) => ({
                  label: WEEKDAY_LABELS[item],
                  value: item,
                }))}
                placeholder="Hafta kunini tanlang"
              />
            )}

            {isEdit || lockGroup ? (
              <div>
                <FormLabel>Guruh</FormLabel>
                <div className="mt-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                  {isEdit
                    ? (template?.group.name ?? "—")
                    : (groups?.data.find((g) => g.id === presetGroupId)?.name ??
                      "—")}
                </div>
              </div>
            ) : (
              <ControlledSelect
                name="groupId"
                label="Guruh"
                control={form.control}
                options={
                  groups?.data && groups.data.length > 0
                    ? groups.data.map((item) => ({
                        label: item.name,
                        value: item.id,
                      }))
                    : []
                }
                placeholder="Guruhni tanlang"
              />
            )}

            <ControlledSelect
              name="roomId"
              label="Xona"
              control={form.control}
              options={
                rooms?.data && rooms?.data.length > 0
                  ? rooms?.data.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))
                  : []
              }
              placeholder="Xonani tanlang"
            />

            <ControlledSelect
              name="teacherId"
              label="O'qituvchi"
              control={form.control}
              options={teacherOptions}
              placeholder="O'qituvchini tanlang"
            />

            {showSubject && (
              <ControlledSelect
                name="subjectId"
                label="Fan"
                required
                control={form.control}
                options={
                  subjects?.data.map((item) => ({
                    label: item.name,
                    value: item.id,
                  })) ?? []
                }
                placeholder="Fanni tanlang"
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Boshlanish vaqti</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tugash vaqti</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? isEdit
                    ? "Saqlanmoqda..."
                    : "Yaratilmoqda..."
                  : isEdit
                    ? "Saqlash"
                    : "Yaratish"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
