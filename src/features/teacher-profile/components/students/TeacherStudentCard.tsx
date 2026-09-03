import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Coins, Phone } from "lucide-react";
import type { StudentDetail } from "@/features/students/types";
import { GiveCoinModal } from "./GiveCoinModal";

export const TeacherStudentCard = ({
  student,
  groupId,
}: {
  student: StudentDetail;
  groupId?: string;
}) => {
  const navigate = useNavigate();
  const [coinModalOpen, setCoinModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => navigate(`/teacher/students/${student.id}`)}
        className="rounded-2xl border border-ink/10 bg-white p-4 cursor-pointer transition-shadow hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-forest text-gold-soft flex items-center justify-center text-sm font-semibold shrink-0">
            {student.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink truncate">
              {student.fullName}
            </p>
            <p className="text-xs text-ink-soft flex items-center gap-1 mt-0.5">
              <Phone size={11} />
              {student.phone}
            </p>
          </div>
          {!student.isActive && (
            <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-bloom/10 text-bloom">
              Nofaol
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-ink/8">
          <span className="flex items-center gap-1.5 text-sm font-medium text-gold">
            <Coins size={14} />
            {student.wallet?.balance ?? 0} coin
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCoinModalOpen(true);
            }}
            className="text-xs font-medium text-forest hover:underline"
          >
            + Coin berish
          </button>
        </div>
      </div>

      <GiveCoinModal
        open={coinModalOpen}
        onClose={() => setCoinModalOpen(false)}
        studentId={student.id}
        studentName={student.fullName}
        defaultGroupId={groupId}
      />
    </>
  );
};
