import { useEffect, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { toast } from "sonner";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageLoading } from "@/components/loading";
import { useGroups } from "@/features/groups/hooks";
import {
  useScheduleTemplates,
  useDeleteScheduleTemplate,
  useMoveScheduleTemplate,
} from "../hooks";
import { WEEKDAY_LABELS } from "../constants";
import { WEEKDAYS, type ScheduleTemplate, type Weekday } from "../types";
import { TemplateCard } from "./TemplateCard";
import { DraggableTemplateCard } from "./DraggableTemplateCard";
import { DroppableColumn } from "./DroppableColumn";
import { TemplateFormModal } from "./TemplateFormModal";

const CARD_COLORS = [
  "border-l-blue-500 bg-blue-100 dark:bg-blue-900/20",
  "border-l-amber-500 bg-amber-100 dark:bg-amber-900/20",
  "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
  "border-l-pink-500 bg-pink-50 dark:bg-pink-900/20",
  "border-l-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-900/20",
  "border-l-cyan-500 bg-cyan-50 dark:bg-cyan-900/20",
  "border-l-sky-500 bg-sky-50 dark:bg-sky-900/20",
  "border-l-purple-500 bg-purple-50 dark:bg-purple-900/20",
  "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
  "border-l-lime-500 bg-lime-50 dark:bg-lime-900/20",
];

interface Props {
  groupFilter?: string;
  onGroupFilterChange?: (groupId: string) => void;
}

export const WeeklyKanban = ({
  groupFilter: controlledGroupFilter,
  onGroupFilterChange,
}: Props = {}) => {
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
    if (
      !window.confirm(
        "Bu shablonni o'chirsangiz, kelajakdagi sessiyalar yaratilmaydi. Mavjud sessiyalarga ta'sir etmaydi. Davom etasizmi?",
      )
    )
      return;

    deleteTemplate.mutate(template.id, {
      onError: (error: any) =>
        toast.error(error?.data?.message || "Xatolik yuz berdi"),
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
        onError: (error: any) =>
          toast.error(error?.data?.message || "Xatolik yuz berdi"),
      },
    );
  };

  return (
    <div className="rounded-2xl bg-background p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">Haftalik Shablon</h3>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="max-w-100 min-w-48 justify-between font-normal"
              >
                <span className="truncate">
                  {groups?.data.find((g) => g.id === groupFilter)?.name ??
                    "Guruh tanlang"}
                </span>
                <ChevronDown size={16} className="shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuRadioGroup
                value={groupFilter}
                onValueChange={setGroupFilter}
              >
                {groups?.data.map((group) => (
                  <DropdownMenuRadioItem key={group.id} value={group.id}>
                    {group.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={openCreateGeneric}
            className="gap-2 bg-linear-to-br from-purple-500 to-purple-700 text-white"
          >
            <Plus size={18} />
            Shablon qo'shish
          </Button>
        </div>
      </div>

      {isLoading ? (
        <PageLoading />
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-7">
            {WEEKDAYS.map((weekday) => {
              const dayTemplates =
                templates?.data.filter((t) => t.weekday === weekday) ?? [];

              return (
                <DroppableColumn key={weekday} weekday={weekday}>
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-semibold">
                      {WEEKDAY_LABELS[weekday]}
                    </span>
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-medium text-primary">
                      {dayTemplates.length}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {dayTemplates.map((template, idx) => (
                      <DraggableTemplateCard
                        key={template.id}
                        template={template}
                        colorClass={CARD_COLORS[idx % CARD_COLORS.length]}
                        onEdit={() => openEdit(template)}
                        onDelete={() => handleDelete(template)}
                      />
                    ))}

                    <button
                      onClick={() => openCreateForDay(weekday)}
                      className="rounded-lg border border-dashed border-border py-2 text-xs text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      + Qo'shish
                    </button>
                  </div>
                </DroppableColumn>
              );
            })}
          </div>

          <DragOverlay>
            {activeTemplate && (
              <TemplateCard
                template={activeTemplate}
                groupName={activeTemplate.group.name}
                roomName={activeTemplate.room.name}
                colorClass="border-l-primary shadow-lg"
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
    </div>
  );
};
