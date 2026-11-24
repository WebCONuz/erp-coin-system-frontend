import { useEffect, useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { translateApiError } from "@/ustils";
import { notifySessionSync } from "../lib/session-sync";
import { useTranslation } from "react-i18next";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGroups } from "@/features/groups/hooks";
import {
  useScheduleTemplates,
  useDeleteScheduleTemplate,
  useMoveScheduleTemplate,
} from "../hooks";
import { getWeekdayLabels } from "../constants";
import { WEEKDAYS, type ScheduleTemplate, type Weekday } from "../types";
import { TemplateCard } from "./TemplateCard";
import { DraggableTemplateCard } from "./DraggableTemplateCard";
import { DroppableColumn } from "./DroppableColumn";
import { TemplateFormModal } from "./TemplateFormModal";
import { GroupPicker } from "./GroupPicker";


interface Props {
  groupFilter?: string;
  onGroupFilterChange?: (groupId: string) => void;
  /** Ko'rinish almashtirgichi (haftalik/oylik) — guruh tanlash yonida chiqadi. */
  viewSwitcher?: ReactNode;
}

export const WeeklyKanban = ({
  groupFilter: controlledGroupFilter,
  onGroupFilterChange,
  viewSwitcher,
}: Props = {}) => {
  const { t } = useTranslation();
  const WEEKDAY_LABELS = getWeekdayLabels(t);
  const [internalGroupFilter, setInternalGroupFilter] = useState<string>("");
  const groupFilter = controlledGroupFilter ?? internalGroupFilter;
  const setGroupFilter = onGroupFilterChange ?? setInternalGroupFilter;

  const { data: groups } = useGroups();

  useEffect(() => {
    if (!groupFilter && groups?.data.length) {
      setGroupFilter(groups.data[0].id);
    }
  }, [groupFilter, groups]);

  const { data: templates, isLoading } = useScheduleTemplates({
    groupId: groupFilter || undefined,
    limit: "100",
  });
  const deleteTemplate = useDeleteScheduleTemplate();
  const moveTemplate = useMoveScheduleTemplate();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );
  const [activeTemplate, setActiveTemplate] = useState<ScheduleTemplate | null>(
    null,
  );

  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: "create" | "edit";
    weekday: Weekday;
    lockWeekday: boolean;
    presetGroupId?: string;
    lockGroup: boolean;
    template?: ScheduleTemplate;
  }>({
    open: false,
    mode: "create",
    weekday: "monday",
    lockWeekday: true,
    lockGroup: false,
  });

  const openCreateForDay = (weekday: Weekday) =>
    setModalState({
      open: true,
      mode: "create",
      weekday,
      lockWeekday: true,
      presetGroupId: groupFilter,
      lockGroup: true,
    });

  const openCreateGeneric = () =>
    setModalState({
      open: true,
      mode: "create",
      weekday: "monday",
      lockWeekday: false,
      lockGroup: false,
    });

  const openEdit = (template: ScheduleTemplate) =>
    setModalState({
      open: true,
      mode: "edit",
      weekday: template.weekday,
      lockWeekday: true,
      lockGroup: true,
      template,
    });

  const closeModal = () => setModalState((s) => ({ ...s, open: false }));

  const handleDelete = (template: ScheduleTemplate) => {
    if (!window.confirm(t("plans.deleteTemplateConfirm"))) return;

    // Shablon o'chirilsa kelajakdagi (tekshirilmagan) darslari ham o'chiriladi.
    deleteTemplate.mutate(template.id, {
      onSuccess: (res) => notifySessionSync(res.sessionSync, t),
      onError: (error: unknown) => toast.error(translateApiError(error, t)),
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const template = templates?.data.find((t) => t.id === event.active.id);
    setActiveTemplate(template ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTemplate(null);
    const { active, over } = event;
    if (!over) return;

    const newWeekday = over.id as Weekday;
    const template = templates?.data.find((t) => t.id === active.id);
    if (!template || template.weekday === newWeekday) return;

    moveTemplate.mutate(
      { templateId: template.id, weekday: newWeekday },
      {
        // Hafta kuni o'zgarsa darslar yangi kunga ko'chiriladi — to'qnashuvlar ko'rsatiladi.
        onSuccess: (res) => notifySessionSync(res.sessionSync, t),
        onError: (error: unknown) => toast.error(translateApiError(error, t)),
      },
    );
  };

  const selectedGroupName = groups?.data.find((g) => g.id === groupFilter)?.name;

  return (
    <section
      aria-labelledby="weekly-template-title"
      className="rounded-2xl border bg-card p-4 sm:p-5"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2
          id="weekly-template-title"
          className="font-heading text-base font-semibold"
        >
          {t("plans.weeklyTemplate")}
        </h2>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {viewSwitcher}
          <GroupPicker
            groups={groups?.data ?? []}
            value={groupFilter}
            onChange={setGroupFilter}
            label={selectedGroupName ?? t("plans.selectGroup")}
          />
          <Button onClick={openCreateGeneric} className="h-9 shrink-0 gap-2">
            <Plus className="size-4" aria-hidden />
            <span className="hidden sm:inline">{t("plans.addTemplate")}</span>
            <span className="sr-only sm:hidden">{t("plans.addTemplate")}</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div aria-busy="true" className="flex gap-2 overflow-hidden 2xl:grid 2xl:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-56 shrink-0 rounded-xl 2xl:w-auto" />
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* 2xl dan kichik ekranlarda ustunlar gorizontal suriladi */}
          <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:-mx-5 sm:px-5 2xl:mx-0 2xl:overflow-visible 2xl:px-0">
            <div className="flex snap-x gap-2 2xl:grid 2xl:grid-cols-7">
              {WEEKDAYS.map((weekday) => {
                const dayTemplates = (
                  templates?.data.filter((t) => t.weekday === weekday) ?? []
                ).sort((a, b) => a.startTime.localeCompare(b.startTime));

                return (
                  <DroppableColumn
                    key={weekday}
                    weekday={weekday}
                    className="w-60 shrink-0 snap-start 2xl:w-auto"
                  >
                    <h3 className="flex items-center gap-2 px-1 pt-0.5 text-sm font-semibold">
                      {WEEKDAY_LABELS[weekday]}
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-card px-1.5 text-xs font-medium tabular-nums text-muted-foreground">
                        {dayTemplates.length}
                      </span>
                    </h3>

                    <div className="flex flex-col gap-2">
                      {dayTemplates.map((template) => (
                        <DraggableTemplateCard
                          key={template.id}
                          template={template}
                          onEdit={() => openEdit(template)}
                          onDelete={() => handleDelete(template)}
                        />
                      ))}

                      <button
                        type="button"
                        onClick={() => openCreateForDay(weekday)}
                        aria-label={`${t("common.add")}: ${WEEKDAY_LABELS[weekday]}`}
                        className="flex h-9 items-center justify-center gap-1 rounded-lg border border-dashed border-border text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:bg-card hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        <Plus className="size-3.5" aria-hidden />
                        {t("common.add")}
                      </button>
                    </div>
                  </DroppableColumn>
                );
              })}
            </div>
          </div>

          <DragOverlay>
            {activeTemplate && (
              <TemplateCard
                template={activeTemplate}
                groupName={activeTemplate.group.name}
                isOverlay
                onEdit={() => {}}
                onDelete={() => {}}
              />
            )}
          </DragOverlay>
        </DndContext>
      )}

      <TemplateFormModal
        open={modalState.open}
        onClose={closeModal}
        mode={modalState.mode}
        weekday={modalState.weekday}
        lockWeekday={modalState.lockWeekday}
        presetGroupId={modalState.presetGroupId}
        lockGroup={modalState.lockGroup}
        template={modalState.template}
      />
    </section>
  );
};
