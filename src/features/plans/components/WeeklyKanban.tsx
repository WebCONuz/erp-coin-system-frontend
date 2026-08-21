import { useState } from "react";
import { Plus } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  "border-l-blue-500",
  "border-l-amber-500",
  "border-l-emerald-500",
  "border-l-purple-500",
  "border-l-pink-500",
];

export const WeeklyKanban = () => {
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const { data: groups } = useGroups();
  const { data: templates, isLoading } = useScheduleTemplates({
    groupId: groupFilter === "all" ? undefined : groupFilter,
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
    template?: ScheduleTemplate;
  }>({ open: false, mode: "create", weekday: "monday", lockWeekday: true });

  const openCreateForDay = (weekday: Weekday) =>
    setModalState({ open: true, mode: "create", weekday, lockWeekday: true });

  const openCreateGeneric = () =>
    setModalState({
      open: true,
      mode: "create",
      weekday: "monday",
      lockWeekday: false,
    });

  const openEdit = (template: ScheduleTemplate) =>
    setModalState({
      open: true,
      mode: "edit",
      weekday: template.weekday,
      lockWeekday: true,
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
          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha guruhlar</SelectItem>
              {groups?.data.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        template={modalState.template}
      />
    </div>
  );
};
