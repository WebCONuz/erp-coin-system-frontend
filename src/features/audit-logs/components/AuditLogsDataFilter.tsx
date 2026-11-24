import { useTranslation } from "react-i18next";
import { RefreshCw, RotateCcw } from "lucide-react";
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

interface Props {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const AuditLogsDataFilter = ({ onRefresh, isRefreshing }: Props) => {
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
      <div className="w-full space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <DashboardTitle
              title={t("auditLogs.title")}
              description={t("auditLogs.description")}
              as="h2"
            />
          </div>
          {onRefresh && (
            <Button
              type="button"
              variant="outline"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="h-9 shrink-0 gap-2"
              aria-label={t("auditLogs.refresh")}
            >
              <RefreshCw
                className={isRefreshing ? "size-4 animate-spin" : "size-4"}
                aria-hidden
              />
              <span className="hidden sm:inline">
                {t("auditLogs.refresh")}
              </span>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 items-start gap-2 sm:flex sm:flex-wrap sm:gap-2.5">
          <div className="min-w-0 sm:w-48">
            <ControlledSelect
              control={form.control}
              name="actionType"
              options={actionOptions}
              clearable={false}
            />
          </div>
          <div className="min-w-0 sm:w-48">
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
              variant="ghost"
              onClick={reset}
              className="col-span-2 h-10 gap-2 text-muted-foreground hover:text-foreground sm:col-span-1"
            >
              <RotateCcw className="size-4" aria-hidden />
              {t("auditLogs.filter.reset")}
            </Button>
          )}
        </div>
      </div>
    </Form>
  );
};
