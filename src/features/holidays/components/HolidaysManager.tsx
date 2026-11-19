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
import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
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
    <div className="space-y-6 min-w-0">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {t("holidays.title")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("holidays.description")}
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-[15rem_minmax(0,1fr)_auto] gap-3 items-start rounded-xl border border-zinc-200 dark:border-zinc-800 p-4"
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
            className="sm:mt-6 gap-2"
          >
            <Plus size={16} />
            {createHoliday.isPending ? t("common.adding") : t("common.add")}
          </Button>
        </form>
      </Form>

      <div className="flex items-center justify-between gap-3">
        <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
          {t("holidays.listTitle", { year })}
        </h3>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setYear((y) => y - 1)}
            aria-label={t("holidays.prevYear")}
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="w-14 text-center text-sm font-medium tabular-nums">
            {year}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setYear((y) => y + 1)}
            aria-label={t("holidays.nextYear")}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <PageLoading />
      ) : isError ? (
        <NoData text={translateApiError(error, t)} />
      ) : !holidays.length ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <CalendarOff size={22} className="text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            {t("holidays.empty")}
          </p>
        </div>
      ) : (
        <ul className="rounded-xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-800 overflow-hidden">
          {holidays.map((holiday) => (
            <li
              key={holiday.id}
              className="flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-zinc-900"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="shrink-0 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 px-2 py-1 text-xs font-medium tabular-nums">
                  {formatDate(holiday.date, "dd.MM.yyyy")}
                </span>
                <span className="text-sm text-zinc-800 dark:text-zinc-200 truncate">
                  {holiday.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                disabled={deleteHoliday.isPending}
                onClick={() => handleDelete(holiday)}
                aria-label={t("common.delete")}
              >
                <Trash2 size={16} />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
