import type { TeacherCalendarEntry } from "../../types";

const SESSION_TYPE_LABELS: Record<string, string> = {
  lesson: "Dars",
  exam: "Imtihon",
  trial: "Sinov",
  competition: "Musobaqa",
};

export const TeacherSessionChip = ({ entry }: { entry: TeacherCalendarEntry }) => {
  const { template, exception, session, group } = entry;

  if (exception?.isCancelled) {
    return (
      <div
        title={`${group.name}: bekor qilindi${exception.note ? ` — ${exception.note}` : ""}`}
        className="w-full truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium text-bloom bg-bloom/10"
      >
        <span className="line-through">{group.name}</span>
        <br />
        Bekor qilindi
      </div>
    );
  }

  if (exception) {
    return (
      <div
        title={`${group.name}: vaqti o'zgardi — ${exception.startTime}:${exception.endTime}${exception.note ? ` (${exception.note})` : ""}`}
        className="w-full truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium text-gold bg-gold/15"
      >
        {group.name}
        <br />
        {exception.startTime}:{exception.endTime}
      </div>
    );
  }

  if (!session) {
    return (
      <div
        title={`${group.name}: rejalashtirilgan dars — ${template.startTime}:${template.endTime}`}
        className="w-full truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium text-ink-soft bg-paper-soft"
      >
        {group.name}
        <br />
        {template.startTime}:{template.endTime}
      </div>
    );
  }

  return (
    <div
      title={`${group.name}: ${SESSION_TYPE_LABELS[session.sessionType] ?? session.sessionType}${session.topic ? ` — ${session.topic}` : ""}`}
      className={`w-full truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium ${
        session.isLocked ? "text-forest bg-forest/10" : "text-gold bg-gold/15"
      }`}
    >
      {group.name}
      <br />
      {session.startTime}:{session.endTime}
      {session.isLocked ? " · yo'qlama olindi" : ""}
    </div>
  );
};
