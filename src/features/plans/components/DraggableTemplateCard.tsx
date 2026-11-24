import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { ScheduleTemplate } from "../types";
import { TemplateCard } from "./TemplateCard";

interface Props {
  template: ScheduleTemplate;
  onEdit: () => void;
  onDelete: () => void;
}

export const DraggableTemplateCard = ({ template, onEdit, onDelete }: Props) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: template.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.4 : 1,
      }}
      className="touch-none rounded-lg focus-visible:outline-2 focus-visible:outline-ring"
      {...listeners}
      {...attributes}
    >
      <TemplateCard
        template={template}
        groupName={template.group.name}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};
