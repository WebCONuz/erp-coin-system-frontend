import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useGroup } from "@/features/groups/hooks";
import { groupKeys } from "@/features/groups/constants";
import { studentKeys } from "@/features/students/constants";
import {
  getApiErrorData,
  isForbiddenError,
  translateApiError,
} from "@/ustils";
import { MAX_COIN_AMOUNT, MAX_RESULT_NOTE_LENGTH } from "../constants";
import { useAttendance, useSaveAttendance, useSaveResults } from "./useHook";
import type {
  AttendanceRecord,
  AttendanceRecordInput,
  ResultRecordInput,
  SaveAttendanceResponse,
  SessionItem,
} from "../types";

export type AttendanceLocalRecord = {
  isPresent: boolean;
  homeworkDone: boolean;
};

/** Inputlar string ko'rinishida saqlanadi (bo'sh ball — `null`). */
export type ScoredLocalRecord = {
  isPresent: boolean;
  score: string;
  coinAmount: string;
  note: string;
};

export type ScoredRecordErrors = Record<string, { score?: string }>;

const SCORE_DECIMALS_REGEX = /^\d+([.,]\d{1,2})?$/;

/** "92,5" → 92.5; bo'sh qator → null. */
export const parseScore = (value: string): number | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  return Number(trimmed.replace(",", "."));
};

type EvaluationStudent = { id: string; fullName: string; phone: string };

const buildAttendanceRecords = (
  students: EvaluationStudent[],
  attendance?: AttendanceRecord[],
) => {
  const byStudentId = new Map((attendance ?? []).map((r) => [r.student.id, r]));
  const records: Record<string, AttendanceLocalRecord> = {};

  students.forEach((student) => {
    const existing = byStudentId.get(student.id);
    records[student.id] = {
      isPresent: existing?.isPresent ?? false,
      homeworkDone: existing?.homeworkDone ?? false,
    };
  });
  return records;
};

const buildScoredRecords = (
  students: EvaluationStudent[],
  attendance?: AttendanceRecord[],
) => {
  const byStudentId = new Map((attendance ?? []).map((r) => [r.student.id, r]));
  const records: Record<string, ScoredLocalRecord> = {};

  students.forEach((student) => {
    const existing = byStudentId.get(student.id);
    // Yozuvi yo'q o'quvchi uchun: qatnashgan, ball bo'sh, coin 0.
    records[student.id] = {
      isPresent: existing?.isPresent ?? true,
      score:
        existing?.score !== null && existing?.score !== undefined
          ? String(existing.score).replace(".", ",")
          : "",
      coinAmount: String(Math.max(existing?.coinAwarded ?? 0, 0)),
      note: existing?.note ?? "",
    };
  });
  return records;
};

interface Params {
  session: SessionItem;
  readOnly: boolean;
  /**
   * Formada tahrirlanayotgan maksimal ball (hali saqlanmagan bo'lishi mumkin).
   * Berilmasa `session.maxScore` olinadi.
   */
  maxScore?: number | null;
}

/**
 * Sessiyani tekshirish holati — `session.evaluationMode` bo'yicha:
 *   - `attendance`: Keldi + Uy vazifasi → POST /sessions/:id/attendance
 *   - `scored`:     Keldi + Ball + Coin + Izoh → POST /sessions/:id/results
 */
export const useSessionEvaluation = ({
  session,
  readOnly,
  maxScore: maxScoreOverride,
}: Params) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isScored = session.evaluationMode === "scored";
  const maxScore =
    maxScoreOverride !== undefined ? maxScoreOverride : (session.maxScore ?? null);

  const {
    data: group,
    isLoading: isGroupLoading,
    isError: isGroupError,
    error: groupError,
  } = useGroup(
    session.group.id ?? "",
  );
  const { data: attendance, isLoading: isAttendanceLoading } = useAttendance(
    session.id,
  );
  const saveAttendance = useSaveAttendance(session.id);
  const saveResults = useSaveResults(session.id);

  const students = useMemo(
    () => group?.students.map(({ student }) => student) ?? [],
    [group],
  );

  const [attendanceRecords, setAttendanceRecords] = useState<
    Record<string, AttendanceLocalRecord>
  >({});
  const [scoredRecords, setScoredRecords] = useState<
    Record<string, ScoredLocalRecord>
  >({});
  /** Backend xato qaytargan o'quvchilar (masalan SCORE_EXCEEDS_MAX). */
  const [invalidStudentIds, setInvalidStudentIds] = useState<string[]>([]);

  // Guruh yoki saqlangan yozuvlar (qayta) kelganda inputlar ulardan to'ldiriladi.
  // Effect o'rniga render paytida sozlanadi (react.dev: "adjusting state when
  // a prop changes") — ortiqcha qayta render bo'lmasligi uchun.
  const [prefilledFrom, setPrefilledFrom] = useState<{
    group?: typeof group;
    attendance?: typeof attendance;
  }>({});

  if (
    group &&
    (prefilledFrom.group !== group || prefilledFrom.attendance !== attendance)
  ) {
    setPrefilledFrom({ group, attendance });
    setAttendanceRecords(buildAttendanceRecords(students, attendance));
    setScoredRecords(buildScoredRecords(students, attendance));
    setInvalidStudentIds([]);
  }

  // ─── Attendance rejimi ────────────────────────────────────────────────────
  const toggleAttendance = (
    studentId: string,
    field: keyof AttendanceLocalRecord,
  ) => {
    if (readOnly) return;
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: !prev[studentId][field] },
    }));
  };

  const toggleAllAttendance = (
    field: keyof AttendanceLocalRecord,
    value: boolean,
  ) => {
    if (readOnly) return;
    setAttendanceRecords((prev) => {
      const next: Record<string, AttendanceLocalRecord> = {};
      for (const [studentId, record] of Object.entries(prev)) {
        next[studentId] = { ...record, [field]: value };
      }
      return next;
    });
  };

  // ─── Scored rejimi ────────────────────────────────────────────────────────
  const updateScored = (
    studentId: string,
    patch: Partial<ScoredLocalRecord>,
  ) => {
    if (readOnly) return;
    setScoredRecords((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], ...patch },
    }));
    setInvalidStudentIds((prev) => prev.filter((id) => id !== studentId));
  };

  const setAllScoredPresent = (value: boolean) => {
    if (readOnly) return;
    setScoredRecords((prev) => {
      const next: Record<string, ScoredLocalRecord> = {};
      for (const [studentId, record] of Object.entries(prev)) {
        next[studentId] = { ...record, isPresent: value };
      }
      return next;
    });
  };

  /** "Hammaga coin" — faqat frontendda qatnashgan o'quvchilar qatorini to'ldiradi. */
  const fillCoinsForAll = (coinAmount: string) => {
    if (readOnly) return;
    setScoredRecords((prev) => {
      const next: Record<string, ScoredLocalRecord> = {};
      for (const [studentId, record] of Object.entries(prev)) {
        next[studentId] = record.isPresent ? { ...record, coinAmount } : record;
      }
      return next;
    });
  };

  const scoredErrors = useMemo<ScoredRecordErrors>(() => {
    if (!isScored) return {};
    const errors: ScoredRecordErrors = {};

    for (const [studentId, record] of Object.entries(scoredRecords)) {
      if (!record.isPresent || !record.score.trim()) continue;

      const score = parseScore(record.score);
      if (!SCORE_DECIMALS_REGEX.test(record.score.trim()) || score === null) {
        errors[studentId] = { score: t("sessions.results.scoreInvalid") };
      } else if (maxScore !== null && score > maxScore) {
        errors[studentId] = {
          score: t("sessions.results.scoreExceedsMax", { maxScore }),
        };
      }
    }
    return errors;
  }, [isScored, scoredRecords, maxScore, t]);

  const hasErrors = Object.keys(scoredErrors).length > 0;

  // ─── Saqlash ──────────────────────────────────────────────────────────────
  const nameById = useMemo(
    () => new Map(students.map((s) => [s.id, s.fullName])),
    [students],
  );

  const handleSuccess = (res: SaveAttendanceResponse) => {
    toast.success(res.message);

    if (res.coinsSkippedFor?.length) {
      toast.warning(
        t("sessions.evaluation.coinsSkipped", {
          total: res.coinsSkippedFor.length,
        }),
      );
      res.coinsSkippedFor.forEach((skip) => {
        const reason = skip.code
          ? t(`sessions.coinsSkippedCode.${skip.code}`, {
              defaultValue: skip.reason,
            })
          : skip.reason;
        toast.warning(
          `${nameById.get(skip.studentId) ?? skip.studentId}: ${reason}`,
        );
      });
    }

    // Tekshiruv guruh a'zolarining coin balansi/statistikasiga ta'sir
    // qiladi — shu sababli guruh, talabalar ro'yxati va har bir talabaning
    // shaxsiy sahifasi keshini "eskirgan" deb belgilaymiz.
    queryClient.invalidateQueries({
      queryKey: groupKeys.oneGroupById(session.group.id ?? ""),
    });
    queryClient.invalidateQueries({ queryKey: studentKeys.allStudents() });
    students.forEach((student) => {
      queryClient.invalidateQueries({
        queryKey: studentKeys.oneStudentById(student.id),
      });
    });
  };

  const handleError = (error: unknown) => {
    const studentIds = getApiErrorData(error)?.studentIds ?? [];
    const names = studentIds
      .map((id) => nameById.get(id))
      .filter(Boolean)
      .join(", ");
    const message = translateApiError(error, t);

    toast.error(names ? `${message}: ${names}` : message);
    setInvalidStudentIds(studentIds);
  };

  const save = (onSuccess?: () => void) => {
    if (isScored) {
      if (hasErrors) {
        toast.error(t("sessions.results.fixErrors"));
        return;
      }

      const records: ResultRecordInput[] = Object.entries(scoredRecords).map(
        ([studentId, r]) => ({
          studentId,
          isPresent: r.isPresent,
          // Kelmagan o'quvchi uchun backend ball/coinni baribir e'tiborsiz qoldiradi.
          score: r.isPresent ? parseScore(r.score) : null,
          coinAmount: r.isPresent
            ? Math.min(Number(r.coinAmount) || 0, MAX_COIN_AMOUNT)
            : 0,
          note: r.note.trim().slice(0, MAX_RESULT_NOTE_LENGTH) || undefined,
        }),
      );

      saveResults.mutate(
        { records },
        {
          onSuccess: (res) => {
            handleSuccess(res);
            onSuccess?.();
          },
          onError: handleError,
        },
      );
      return;
    }

    const records: AttendanceRecordInput[] = Object.entries(
      attendanceRecords,
    ).map(([studentId, r]) => ({ studentId, ...r }));

    saveAttendance.mutate(
      { records },
      {
        onSuccess: (res) => {
          handleSuccess(res);
          onSuccess?.();
        },
        onError: handleError,
      },
    );
  };

  return {
    isScored,
    maxScore,
    students,
    hasGroup: !!session.group.id,
    isLoading: isGroupLoading || isAttendanceLoading,
    // Guruh o'quvchilarini olib bo'lmadi — "o'quvchilar yo'q" deb ko'rsatilmasin.
    isGroupError,
    isGroupForbidden: isForbiddenError(groupError),
    attendanceRecords,
    toggleAttendance,
    toggleAllAttendance,
    scoredRecords,
    scoredErrors,
    invalidStudentIds,
    hasErrors,
    updateScored,
    setAllScoredPresent,
    fillCoinsForAll,
    save,
    isSaving: saveAttendance.isPending || saveResults.isPending,
  };
};

export type SessionEvaluation = ReturnType<typeof useSessionEvaluation>;
