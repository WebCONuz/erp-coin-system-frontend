import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { CalendarCheck, Check, X } from "lucide-react";
import { Form } from "@/components/ui/form";
import { ControlledSelect, ControlledDatePicker } from "@/components/controls";
import { PageLoading } from "@/components/loading";
import { EmptyState } from "@/features/students/components/ui";
import { TablePagination } from "@/components/shared/table";
import { formatDate } from "@/ustils";
import { usePagination } from "@/hooks/usePagination";
import { useMyAttendance, useMyGroups } from "../../hooks";

const SESSION_TYPE_LABELS: Record<string, string> = {
  lesson: "Dars",
  exam: "Imtihon",
  trial: "Sinov",
  competition: "Musobaqa",
};

interface FilterValues {
  groupId: string;
  from: string;
  to: string;
}

export const MyAttendanceTab = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: groups } = useMyGroups();

  const form = useForm<FilterValues>({
    defaultValues: {
      groupId: searchParams.get("groupId") || "",
      from: searchParams.get("from") || "",
      to: searchParams.get("to") || "",
    },
  });

  const groupId = form.watch("groupId");
  const from = form.watch("from");
  const to = form.watch("to");

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (groupId) next.set("groupId", groupId);
    else next.delete("groupId");
    if (from) next.set("from", from);
    else next.delete("from");
    if (to) next.set("to", to);
    else next.delete("to");
    next.delete("page");
    setSearchParams(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, from, to]);

  const { currentPage, setPage } = usePagination();

  const { data, isLoading } = useMyAttendance({
    groupId: groupId || undefined,
    from: from || undefined,
    to: to || undefined,
    page: currentPage,
    limit: 20,
  });

  const records = data?.data ?? [];

  return (
    <div className="space-y-4">
      <Form {...form}>
        <div className="flex flex-wrap items-end gap-3">
          <ControlledSelect
            control={form.control}
            name="groupId"
            placeholder="Barcha guruhlar"
            options={(groups ?? []).map((g) => ({ value: g.id, label: g.name }))}
            className="w-48"
          />
          <ControlledDatePicker
            control={form.control}
            name="from"
            placeholder="Sanadan"
            className="min-w-40"
          />
          <ControlledDatePicker
            control={form.control}
            name="to"
            placeholder="Sanagacha"
            className="min-w-40"
          />
        </div>
      </Form>

      {isLoading ? (
        <PageLoading />
      ) : !records.length ? (
        <EmptyState
          icon={<CalendarCheck size={20} />}
          title="Davomat tarixi mavjud emas"
          text="Tanlangan filtr bo'yicha davomat topilmadi."
        />
      ) : (
        <>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            {records.map((record, idx) => (
              <div
                key={record.id}
                className={`flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-900 ${
                  idx !== records.length - 1
                    ? "border-b border-zinc-100 dark:border-zinc-800"
                    : ""
                }`}
              >
                <div className="min-w-0">
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 truncate">
                    <b>{record.session.group.name}</b>
                    {record.session.topic ? ` · ${record.session.topic}` : ""}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {formatDate(record.session.sessionDate, "dd.MM.yyyy")} ·{" "}
                    {SESSION_TYPE_LABELS[record.session.sessionType] ??
                      record.session.sessionType}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-4xl ${
                      record.isPresent
                        ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                    }`}
                  >
                    {record.isPresent ? <Check size={11} /> : <X size={11} />}
                    {record.isPresent ? "Keldi" : "Kelmadi"}
                  </span>
                  <span
                    className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-4xl ${
                      record.homeworkDone
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
                        : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {record.homeworkDone ? <Check size={11} /> : <X size={11} />}
                    HW
                  </span>
                </div>
              </div>
            ))}
          </div>

          {data && data.meta.totalPages > 1 && (
            <TablePagination
              totalItems={data.meta.total}
              currentPage={data.meta.page}
              totalPages={data.meta.totalPages}
              pageSize={data.meta.limit}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
};
