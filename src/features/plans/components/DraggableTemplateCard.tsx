import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { ScheduleTemplate } from "../types";
import { TemplateCard } from "./TemplateCard";

interface Props {
  template: ScheduleTemplate;
  colorClass: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const DraggableTemplateCard = ({
  template,
  colorClass,
  onEdit,
  onDelete,
}: Props) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: template.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.4 : 1,
      }}
      className="touch-none"
      {...listeners}
      {...attributes}
    >
      <TemplateCard
        template={template}
        groupName={template.group.name}
        roomName={template.room.name}
        colorClass={colorClass}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};
