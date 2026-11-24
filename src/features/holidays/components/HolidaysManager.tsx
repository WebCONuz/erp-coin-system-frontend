import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  CalendarOff,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ControlledDatePicker, ControlledInput } from "@/components/controls";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardTitle } from "@/components/shared/title";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { formatDate, translateApiError } from "@/ustils";
import { notifySessionSync } from "@/features/plans/lib/session-sync";
import { useCreateHoliday, useDeleteHoliday, useHolidays } from "../hooks";
import { createHolidayFormSchema, type HolidayFormValues } from "../schema";
import type { Holiday } from "../types";

const emptyValues: HolidayFormValues = { date: "", name: "" };

export const HolidaysManager = () => {
  const { t } = useTranslation();
  const [year, setYear] = useState(() => new Date().getFullYear());
  const params = useMemo(
    () => ({ from: `${year}-01-01`, to: `${year}-12-31` }),
    [year],
  );

  const { data, isLoading, isError, error } = useHolidays(params);
  const createHoliday = useCreateHoliday();
  const deleteHoliday = useDeleteHoliday();

  const schema = useMemo(() => createHolidayFormSchema(t), [t]);
  const form = useForm<HolidayFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  const holidays = useMemo(
    () =>
      [...(data?.data ?? [])].sort((a, b) => a.date.localeCompare(b.date)),
    [data],
  );

  const onSubmit = (values: HolidayFormValues) => {
    createHoliday.mutate(values, {
      onSuccess: (res) => {
        toast.success(t("holidays.created", { name: res.name }));
        notifySessionSync(res.sessionSync, t);
        // Qo'lda yaratilgan darslar avtomatik o'chirilmaydi — admin ko'rib chiqsin.
        if (res.manualSessionsOnDate > 0) {
          toast.warning(
            t("holidays.manualSessionsWarning", {
              count: res.manualSessionsOnDate,
              date: formatDate(res.date, "dd.MM.yyyy"),
            }),
            { duration: 10000 },
          );
        }
        form.reset(emptyValues);
      },
      onError: (error) => toast.error(translateApiError(error, t)),
    });
  };

  const handleDelete = (holiday: Holiday) => {
    if (
      !window.confirm(
        t("holidays.deleteConfirm", {
          name: holiday.name,
          date: formatDate(holiday.date, "dd.MM.yyyy"),
        }),
      )
    )
      return;

    deleteHoliday.mutate(holiday.id, {
      onSuccess: (res) => {
        toast.success(res.message || t("holidays.deleted"));
        notifySessionSync(res.sessionSync, t);
      },
      onError: (error) => toast.error(translateApiError(error, t)),
    });
  };

  return (
    <div className="min-w-0 space-y-4 sm:space-y-5">
      <DashboardTitle
        title={t("holidays.title")}
        description={t("holidays.description")}
        as="h2"
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 items-start gap-3 rounded-2xl border bg-card p-4 sm:grid-cols-[15rem_minmax(0,1fr)_auto] sm:p-5"
        >
          <ControlledDatePicker
            control={form.control}
            name="date"
            label={t("common.date")}
            placeholder={t("common.date")}
            // DatePicker'da standart `min-w-60` bor — grid ustunidan chiqib ketmasin.
            className="min-w-0"
          />
          <ControlledInput
            control={form.control}
            name="name"
            label={t("holidays.nameLabel")}
            placeholder={t("holidays.namePlaceholder")}
          />
          <Button
            type="submit"
            disabled={createHoliday.isPending}
            className="h-10 gap-2 sm:mt-6"
          >
            <Plus className="size-4" aria-hidden />
            {createHoliday.isPending ? t("common.adding") : t("common.add")}
          </Button>
        </form>
      </Form>

      <section aria-labelledby="holidays-list-title" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3
            id="holidays-list-title"
            className="font-heading text-base font-semibold"
          >
            {t("holidays.listTitle", { year })}
          </h3>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setYear((y) => y - 1)}
              aria-label={t("holidays.prevYear")}
            >
              <ChevronLeft className="size-4" aria-hidden />
            </Button>
            <span
              aria-live="polite"
              className="w-14 text-center text-sm font-medium tabular-nums"
            >
              {year}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setYear((y) => y + 1)}
              aria-label={t("holidays.nextYear")}
            >
              <ChevronRight className="size-4" aria-hidden />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div aria-busy="true" className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState description={translateApiError(error, t)} />
        ) : !holidays.length ? (
          <div className="rounded-2xl border bg-card">
            <EmptyState icon={CalendarOff} title={t("holidays.empty")} />
          </div>
        ) : (
          <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
            {holidays.map((holiday) => (
              <li
                key={holiday.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="shrink-0 rounded-lg bg-destructive-soft px-2 py-1 text-xs font-medium tabular-nums text-destructive">
                    {formatDate(holiday.date, "dd.MM.yyyy")}
                  </span>
                  <span className="truncate text-sm">{holiday.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 shrink-0 text-muted-foreground hover:bg-destructive-soft hover:text-destructive"
                  disabled={deleteHoliday.isPending}
                  onClick={() => handleDelete(holiday)}
                  aria-label={`${t("common.delete")}: ${holiday.name}`}
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
