import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BookOpen, CalendarClock, Coins, Phone, Users } from "lucide-react";
import { BackListButton } from "@/components/shared/back";
import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import { useGroup } from "@/features/groups/hooks";
import { getGroupAccent } from "@/lib/group-accent";
import { BulkGiveCoinModal } from "@/features/teacher-profile/components/students";

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: group, isLoading, isError } = useGroup(id ?? "");
  const [bulkCoinOpen, setBulkCoinOpen] = useState(false);

  const bulkCoinStudents = useMemo(
    () =>
      (group?.students ?? []).map((gs) => ({
        id: gs.student.id,
        fullName: gs.student.fullName,
        phone: gs.student.phone,
      })),
    [group],
  );

  if (isLoading) return <PageLoading />;
  if (isError || !group) {
    return <NoData text="Guruh ma'lumotlari topilmadi" />;
  }

  const accent = getGroupAccent(group.id);

  return (
    <div className="space-y-4">
      <BackListButton title="Guruhlarim" />

      <div className="relative overflow-hidden rounded-3xl bg-forest text-paper p-6 sm:p-8">
        <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-sm font-semibold ${accent.bg} ${accent.text}`}
            >
              {group.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-xl font-semibold truncate">
                {group.name}
              </h1>
              <p className="text-sm text-paper/60 flex items-center gap-1.5 mt-1">
                <BookOpen size={13} />
                {group.course.title}
              </p>
            </div>
          </div>

          <Link
            to={`/teacher/sessions?groupId=${group.id}`}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gold/15 border border-gold/30 text-gold px-4 py-2.5 text-sm font-medium hover:bg-gold/20 transition-colors"
          >
            <CalendarClock size={15} />
            Guruh darslari
          </Link>
        </div>

        {group.course.description && (
          <p className="relative text-sm text-paper/60 mt-4 max-w-2xl">
            {group.course.description}
          </p>
        )}

        <div className="relative flex flex-wrap gap-x-6 gap-y-1 text-sm text-paper/70 mt-4 pt-4 border-t border-white/10">
          <span className="flex items-center gap-1.5">
            <Users size={13} />
            {group.students.length}/{group.maxStudents} o'quvchi
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-sm font-semibold text-ink">
            O'quvchilar ({group.students.length})
          </h3>
          {!!group.students.length && (
            <button
              type="button"
              onClick={() => setBulkCoinOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-forest text-paper px-3.5 py-2 text-xs font-medium hover:bg-forest-light transition-colors"
            >
              <Coins size={14} />
              Tanga berish
            </button>
          )}
        </div>

        {!group.students.length ? (
          <p className="text-sm text-ink-soft py-6 text-center">
            Guruhda hali o'quvchi yo'q
          </p>
        ) : (
          <div className="space-y-1">
            {group.students.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-paper-soft transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-forest text-gold-soft flex items-center justify-center text-xs font-semibold shrink-0">
                  {member.student.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-ink flex-1 min-w-0 truncate">
                  {member.student.fullName}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-ink-soft shrink-0">
                  <Phone size={12} />
                  {member.student.phone}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <BulkGiveCoinModal
        open={bulkCoinOpen}
        onClose={() => setBulkCoinOpen(false)}
        students={bulkCoinStudents}
        groupId={group.id}
        title="Guruhga ommaviy tanga berish"
        subtitle={`${group.name} guruhi o'quvchilariga birdaniga tanga bering`}
      />
    </div>
  );
};

export default GroupDetail;
