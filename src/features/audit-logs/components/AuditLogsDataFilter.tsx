import { useTranslation } from "react-i18next";
import { RotateCcw } from "lucide-react";
import { parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DashboardTitle } from "@/components/shared/title";
import {
  ControlledDatePicker,
  ControlledSelect,
  type IOption,
} from "@/components/controls";
import { DATE_FORMAT_ISO_8601 } from "@/assets/constants";
import { useFilter } from "../hooks";
import {
  ALL_VALUE,
  getAuditActionOptions,
  getAuditEntityOptions,
} from "../constants";

const toDate = (value: string) =>
  value ? parse(value, DATE_FORMAT_ISO_8601, new Date()) : undefined;

export const AuditLogsDataFilter = () => {
  const { t } = useTranslation();
  const { form, hasActiveFilters, reset } = useFilter();
  const fromDate = form.watch("fromDate");
  const toDateValue = form.watch("toDate");

  const actionOptions: IOption[] = [
    { value: ALL_VALUE, label: t("auditLogs.filter.allActions") },
    ...getAuditActionOptions(t),
  ];

  const entityOptions: IOption[] = [
    { value: ALL_VALUE, label: t("auditLogs.filter.allEntities") },
    ...getAuditEntityOptions(t),
  ];

  return (
    <Form {...form}>
      <div className="w-full space-y-3 py-4">
        <DashboardTitle
          title={t("auditLogs.title")}
          description={t("auditLogs.description")}
        />

        <div className="flex flex-wrap items-start gap-3">
          <div className="w-full sm:w-48">
            <ControlledSelect
              control={form.control}
              name="actionType"
              options={actionOptions}
              clearable={false}
            />
          </div>
          <div className="w-full sm:w-48">
            <ControlledSelect
              control={form.control}
              name="entityType"
              options={entityOptions}
              clearable={false}
            />
          </div>
          <ControlledDatePicker
            control={form.control}
            name="fromDate"
            placeholder={t("auditLogs.filter.fromDate")}
            maxDate={toDate(toDateValue)}
            className="w-full min-w-0 sm:w-44"
            withoutDescription
          />
          <ControlledDatePicker
            control={form.control}
            name="toDate"
            placeholder={t("auditLogs.filter.toDate")}
            minDate={toDate(fromDate)}
            className="w-full min-w-0 sm:w-44"
            withoutDescription
          />
          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              onClick={reset}
              className="h-10 gap-2 border-zinc-300 dark:border-zinc-700"
            >
              <RotateCcw size={14} />
              {t("auditLogs.filter.reset")}
            </Button>
          )}
        </div>
      </div>
    </Form>
  );
};
