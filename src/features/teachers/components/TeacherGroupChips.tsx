import { useTranslation } from "react-i18next";
import type { Group } from "../types";

/** Guruhlar: ko'pi bilan `max` ta chip + "+N"; bo'sh bo'lsa aniq matn. */
export const TeacherGroupChips = ({
  groups,
  max = 2,
}: {
  groups: Group[];
  max?: number;
}) => {
  const { t } = useTranslation();

  if (!groups.length) {
    return (
      <span className="text-sm text-muted-foreground">
        {t("teachers.table.noGroups")}
      </span>
    );
  }

  const shown = groups.slice(0, max);
  const rest = groups.length - shown.length;

  return (
    <ul
      className="flex flex-wrap gap-1"
      title={groups.map((g) => g.name).join(", ")}
    >
      {shown.map((g) => (
        <li
          key={g.id}
          className="max-w-40 truncate rounded-md bg-muted px-2 py-0.5 text-xs text-foreground/80"
        >
          {g.name}
        </li>
      ))}
      {rest > 0 && (
        <li className="rounded-md px-1.5 py-0.5 text-xs text-muted-foreground">
          +{rest}
        </li>
      )}
    </ul>
  );
};
