import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { translateApiError } from "@/ustils";
import { notifySyncConflicts } from "../lib/session-sync";
import { GENERATE_SESSIONS_MAX_DAYS } from "../constants";

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
  const fromDate = useWatch({ control: form.control, name: "fromDate" });

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
          // `skipped` — mavjud sessiya tufayli o'tkazib yuborilgan darslar soni.
          toast.success(
            t("plans.generate.resultToast", {
              created: result.created,
              cancelled: result.cancelled,
              skipped: result.skipped,
            }),
          );
          if (result.holidays) {
            toast.info(
              t("plans.generate.holidaysSkipped", { count: result.holidays }),
            );
          }
          // Xona/o'qituvchi band bo'lgani uchun yaratilmagan darslar.
          notifySyncConflicts(result.conflicts, t);
          onClose();
        },
        onError: (error: unknown) => toast.error(translateApiError(error, t)),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-100 bg-card border border-border">
        <DialogHeader>
          <DialogTitle>{t("plans.generate.title")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <FormLabel>{t("common.group")}</FormLabel>
              <div className="mt-1.5 rounded-md border border-border bg-muted/50 px-3 py-2 text-sm">
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
                disabled={!fromDate}
                minDate={fromDate ? new Date(fromDate) : new Date()}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="text-warning">
                {t("plans.generate.warningLabel")}
              </span>{" "}
              {t("plans.generate.warningText")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("plans.generate.maxRangeHint", {
                days: GENERATE_SESSIONS_MAX_DAYS,
              })}
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
