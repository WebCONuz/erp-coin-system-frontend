import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  createGenerateSessionsFormSchema,
  type GenerateSessionsFormValues,
} from "../schema";
import { useGenerateSessions } from "../hooks";
import { ControlledDatePicker } from "@/components/controls";

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
  const { t } = useTranslation();
  const generateSessions = useGenerateSessions();

  const generateSessionsFormSchema = useMemo(
    () => createGenerateSessionsFormSchema(t),
    [t],
  );

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
            t("plans.generate.resultToast", {
              created: result.created,
              cancelled: result.cancelled,
              skipped: result.skipped,
            }),
          );
          onClose();
        },
        onError: (error: any) =>
          toast.error(error?.data?.message || t("common.error")),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-100 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle>{t("plans.generate.title")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <FormLabel>{t("common.group")}</FormLabel>
              <div className="mt-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-muted/50 px-3 py-2 text-sm">
                {groupName}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ControlledDatePicker
                control={form.control}
                name="fromDate"
                placeholder={t("common.date")}
                className="min-w-42"
                buttonClassName="h-8"
                label={t("plans.generate.from")}
                minDate={new Date()}
              />
              <ControlledDatePicker
                control={form.control}
                name="toDate"
                placeholder={t("common.date")}
                className="min-w-42"
                buttonClassName="h-8"
                label={t("plans.generate.to")}
                disabled={!form.watch("fromDate")}
                minDate={
                  !!form.watch("fromDate")
                    ? new Date(form.watch("fromDate"))
                    : new Date()
                }
              />
            </div>
            <p className="text-sm text-gray-600">
              <span className="text-yellow-600">
                {t("plans.generate.warningLabel")}
              </span>{" "}
              {t("plans.generate.warningText")}
            </p>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={generateSessions.isPending}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={generateSessions.isPending}>
                {generateSessions.isPending
                  ? t("common.creating")
                  : t("plans.generate.action")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
