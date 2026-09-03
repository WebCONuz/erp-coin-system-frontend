import { useNavigate } from "react-router-dom";
import { CalendarClock, ChevronRight, Users } from "lucide-react";
import type { GroupOverview } from "../../hooks/useMyGroupsOverview";
import { getGroupAccent } from "./groupAccent";

const UZ_WEEKDAYS = [
  "Yakshanba",
  "Dushanba",
  "Seshanba",
  "Chorshanba",
  "Payshanba",
  "Juma",
  "Shanba",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function nextSessionLabel(session: GroupOverview["nextSession"]) {
  if (!session) return null;
  const weekday = UZ_WEEKDAYS[new Date(session.sessionDate).getDay()];
  return `${weekday}, ${session.startTime}${session.room ? ` · ${session.room.name}` : ""}`;
}

export const MyGroupCard = ({ data }: { data: GroupOverview }) => {
  const navigate = useNavigate();
  const accent = getGroupAccent(data.id);
  const nextLabel = nextSessionLabel(data.nextSession);

  return (
    <button
      type="button"
      onClick={() => navigate(`/student/groups/${data.id}`)}
      className="text-left rounded-2xl border border-ink/10 bg-white overflow-hidden transition-shadow hover:shadow-md"
    >
      <div className={`h-1.5 ${accent.bar}`} />

      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${accent.bg} ${accent.text}`}
            >
              {initials(data.name)}
            </div>
            <div className="min-w-0">
              <h4 className="text-base font-semibold text-ink truncate">
                {data.name}
              </h4>
              <p className="text-xs text-ink-soft truncate">
                {data.course.title}
              </p>
            </div>
          </div>
          {!data.isActive && (
            <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-bloom/10 text-bloom">
              Nofaol
            </span>
          )}
        </div>

        <p className="text-xs text-ink-soft mt-3">{data.teacher.fullName}</p>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-ink/8 text-center">
          <div>
            <p className="font-display text-base font-bold text-gold">
              {data.coinThisMonth}
            </p>
            <p className="text-[10px] text-ink-soft mt-0.5">Coin (bu oy)</p>
          </div>
          <div>
            <p className="font-display text-base font-bold text-forest">
              {data.homeworkTotal ? `${data.attendanceRate}%` : "—"}
            </p>
            <p className="text-[10px] text-ink-soft mt-0.5">Davomat</p>
          </div>
          <div>
            <p className="font-display text-base font-bold text-ink">
              {data.homeworkDone}/{data.homeworkTotal}
            </p>
            <p className="text-[10px] text-ink-soft mt-0.5">Topshiriq</p>
          </div>
        </div>

        {nextLabel && (
          <div className="flex items-center gap-1.5 text-xs text-ink-soft mt-3 bg-paper-soft rounded-lg px-2.5 py-2">
            <CalendarClock size={13} className="shrink-0" />
            Keyingi dars: <b className="text-ink">{nextLabel}</b>
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="flex items-center gap-1 text-xs text-ink-soft">
            <Users size={12} />
            {data._count.students} o'quvchi
          </span>
          <span className="flex items-center gap-0.5 text-xs font-medium text-forest">
            Guruh tarixi
            <ChevronRight size={13} />
          </span>
        </div>
      </div>
    </button>
  );
};
