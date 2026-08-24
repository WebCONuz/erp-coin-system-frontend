import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

import { groupFormSchema, type GroupFormValues } from "../../schema";
import { useCourses, useCreateGroup, useUpdateGroup } from "../../hooks";

import { useTeachers } from "@/features/teachers/hooks";
import type { GroupDetail, GroupItem } from "../../types";
import { ControlledSelect } from "@/components/controls";

interface GroupFormModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  group?: GroupItem | GroupDetail; // edit mode uchun
}

export const GroupFormModal = ({
  open,
  onClose,
  mode,
  group,
}: GroupFormModalProps) => {
  const isEdit = mode === "edit";

  const { data: courses, isLoading: isCoursesLoading } = useCourses();
  const { data: teachers, isLoading: isTeachersLoading } = useTeachers({});

  const createGroup = useCreateGroup();
  const updateGroup = useUpdateGroup(group?.id ?? "");

  const isPending = createGroup.isPending || updateGroup.isPending;

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: "",
      maxStudents: 20,
      courseId: "",
      teacherId: "",
    },
  });

  // Edit mode da mavjud ma'lumotlarni formga yuklash
  useEffect(() => {
    if (isEdit && group) {
      form.reset({
        name: group.name,
        maxStudents: group.maxStudents,
        courseId: group.course.id,
        teacherId: group.teacher.id,
      });
    }
  }, [isEdit, group, form]);

  // Modal yopilganda formni tozalash
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = (values: GroupFormValues) => {
    if (isEdit) {
      updateGroup.mutate(values, {
        onSuccess: () => onClose(),
      });
    } else {
      createGroup.mutate(values, {
        onSuccess: () => onClose(),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-120 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-50">
            {isEdit ? "Guruhni tahrirlash" : "Yangi guruh yaratish"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Guruh nomi */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 dark:text-zinc-300">
                    Guruh nomi
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masalan: 5-A"
                      className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Maksimal studentlar soni */}
            <FormField
              control={form.control}
              name="maxStudents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 dark:text-zinc-300">
                    Maksimal studentlar soni
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={500}
                      placeholder="20"
                      className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Kurs */}
            <div className="grid grid-cols-2 gap-x-4">
              <div>
                <ControlledSelect
                  name="courseId"
                  label="Kurs"
                  control={form.control}
                  options={
                    courses && courses.data.length
                      ? courses.data.map((item) => ({
                          label: item.title,
                          value: item.id,
                        }))
                      : []
                  }
                  isLoading={isCoursesLoading}
                  placeholder="Kursni tanlang"
                />
              </div>
              <div>
                <ControlledSelect
                  name="teacherId"
                  label="O'qituvchi"
                  control={form.control}
                  options={
                    teachers && teachers.data.length
                      ? teachers.data.map((item) => ({
                          label: item.fullName,
                          value: item.id,
                        }))
                      : []
                  }
                  isLoading={isTeachersLoading}
                  placeholder="O'qituvchini tanlang"
                />
              </div>
            </div>

            {/* O'qituvchi */}

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
                className="border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Bekor qilish
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
              >
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
