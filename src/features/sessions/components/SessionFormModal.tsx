import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ControlledDatePicker, ControlledSelect } from "@/components/controls";
import { sessionFormSchema, type SessionFormValues } from "../schema";
import {
  useCreateSession,
  useSessionGroupOptions,
  useSessionRoomOptions,
  useSessionSubjectOptions,
  useSessionTeacherOptions,
} from "../hooks";
import { sessionTypeOptions } from "../constants";

interface Props {
  open: boolean;
  onClose: () => void;
}

const emptyValues: SessionFormValues = {
  sessionDate: "",
  startTime: "",
  endTime: "",
  sessionType: "lesson",
  groupId: "",
  roomId: "",
  teacherId: "",
  subjectId: "",
  topic: "",
};

export const SessionFormModal = ({ open, onClose }: Props) => {
  const navigate = useNavigate();
  const createSession = useCreateSession();

  const { data: groups } = useSessionGroupOptions(open);
  const { data: rooms } = useSessionRoomOptions(open);
  const { data: teachers } = useSessionTeacherOptions(open);
  const { data: subjects } = useSessionSubjectOptions(open);

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!open) return;
    form.reset(emptyValues);
  }, [open, form]);

  const onError = (error: any) =>
    toast.error(error?.data?.message || "Xatolik yuz berdi");

  const onSubmit = (values: SessionFormValues) => {
    const data = {
      ...values,
      topic: values.topic || undefined,
      subjectId: values.subjectId || undefined,
    };

    createSession.mutate(data, {
      onSuccess: (session) => {
        onClose();
        navigate(`/admin/sessions/${session.id}`);
      },
      onError,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-110 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-50">
            Yangi sessiya qo'shish
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <ControlledDatePicker
                control={form.control}
                name="sessionDate"
                placeholder="Sana"
                className="min-w-42"
                buttonClassName="h-8"
                label="Sessiya sanasi"
              />
              <ControlledSelect
                control={form.control}
                name="sessionType"
                label="Sessiya turi"
                options={sessionTypeOptions}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
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

            <ControlledSelect
              control={form.control}
              name="groupId"
              label="Guruh"
              options={
                groups?.data.map((g) => ({ value: g.id, label: g.name })) ?? []
              }
              placeholder="Guruhni tanlang"
            />

            <div className="grid grid-cols-2 gap-3">
              <ControlledSelect
                control={form.control}
                name="roomId"
                label="Xona"
                options={
                  rooms?.data.map((r) => ({ value: r.id, label: r.name })) ?? []
                }
                placeholder="Xonani tanlang"
              />
              <ControlledSelect
                control={form.control}
                name="teacherId"
                label="O'qituvchi"
                options={
                  teachers?.data.map((t) => ({
                    value: t.id,
                    label: t.fullName,
                  })) ?? []
                }
                placeholder="O'qituvchi tanlang"
              />
            </div>

            <ControlledSelect
              control={form.control}
              name="subjectId"
              label="Fan (Ixtiyoriy)"
              options={
                subjects?.data.map((s) => ({
                  value: s.id,
                  label: s.name,
                })) ?? []
              }
              placeholder="Fanni tanlang"
            />

            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mavzu (Ixtiyoriy)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masalan: OOP asoslari"
                      className="resize-none h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={createSession.isPending}
              >
                Bekor qilish
              </Button>
              <Button type="submit" disabled={createSession.isPending}>
                {createSession.isPending ? "Yaratilmoqda..." : "Yaratish"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
