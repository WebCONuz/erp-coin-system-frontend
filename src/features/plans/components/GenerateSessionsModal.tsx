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
import {
  generateSessionsFormSchema,
  type GenerateSessionsFormValues,
} from "../schema";
import { useGenerateSessions } from "../hooks";

interface Props {
  open: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
}

export const GenerateSessionsModal = ({
  open,
  onClose,
  groupId,
  groupName,
}: Props) => {
  const generateSessions = useGenerateSessions();

  const form = useForm<GenerateSessionsFormValues>({
    resolver: zodResolver(generateSessionsFormSchema),
    defaultValues: { fromDate: "", toDate: "" },
  });

  useEffect(() => {
    if (!open) {
      form.reset({ fromDate: "", toDate: "" });
    }
  }, [open, form]);

  const onSubmit = (values: GenerateSessionsFormValues) => {
    generateSessions.mutate(
      { groupId, ...values },
      {
        onSuccess: (result) => {
          toast.success(
            `${result.created} ta sessiya yaratildi, ${result.cancelled} ta bekor (istisno), ${result.skipped} ta o'tkazib yuborildi (avvaldan bor edi)`,
          );
          onClose();
        },
        onError: (error: any) =>
          toast.error(error?.data?.message || "Xatolik yuz berdi"),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-100 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle>Sessiyalar yaratish</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <FormLabel>Guruh</FormLabel>
              <div className="mt-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-muted/50 px-3 py-2 text-sm">
                {groupName}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fromDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dan</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="toDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gacha</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                disabled={generateSessions.isPending}
              >
                Bekor qilish
              </Button>
              <Button type="submit" disabled={generateSessions.isPending}>
                {generateSessions.isPending
                  ? "Yaratilmoqda..."
                  : "Sessiyalar yaratish"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
