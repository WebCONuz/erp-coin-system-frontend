import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { groupKeys } from "@/features/groups/constants";
import { studentKeys } from "@/features/students/constants";
import {
  useTeacherCoinLimit,
  useTenantSettings,
} from "@/features/tenant-settings/hooks";
import {
  getApiErrorData,
  isForbiddenError,
  translateApiError,
} from "@/ustils";
import {
  MAX_COIN_AMOUNT,
  MAX_RESULT_NOTE_LENGTH,
  resolveAttendanceStatus,
} from "../constants";
import { hasSessionStarted } from "../utils";
import { useSaveAttendance, useSaveResults, useSessionRoster } from "./useHook";
import type {
  AttendanceRecordInput,
  AttendanceStatus,
  ResultRecordInput,
  RosterStudent,
  SaveAttendanceResponse,
  SessionItem,
} from "../types";

export type AttendanceLocalRecord = {
  status: AttendanceStatus;
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

export type EvaluationStudent = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  /** O'quvchi dars sanasidan keyin guruhdan chiqarilgan bo'lsa. */
  leftAt: string | null;
};

const buildAttendanceRecords = (roster: RosterStudent[]) => {
  const records: Record<string, AttendanceLocalRecord> = {};
  roster.forEach(({ student, record }) => {
    records[student.id] = {
      // Yozuvi yo'q o'quvchi — avvalgidek "kelmadi" dan boshlanadi.
      status: resolveAttendanceStatus(record) ?? "absent",
      homeworkDone: record?.homeworkDone ?? false,
    };
  });
  return records;
};

const buildScoredRecords = (roster: RosterStudent[]) => {
  const records: Record<string, ScoredLocalRecord> = {};
  roster.forEach(({ student, record, coinAwarded }) => {
    // Yozuvi yo'q o'quvchi uchun: qatnashgan, ball bo'sh, coin 0.
    records[student.id] = {
      isPresent: record?.isPresent ?? true,
      score:
        record?.score !== null && record?.score !== undefined
          ? String(record.score).replace(".", ",")
          : "",
      coinAmount: String(Math.max(coinAwarded ?? 0, 0)),
      note: record?.note ?? "",
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
 *   - `attendance`: Holat (keldi/kechikdi/sababli/sababsiz) + Uy vazifasi → POST /sessions/:id/attendance
 *   - `scored`:     Keldi + Ball + Coin + Izoh → POST /sessions/:id/results
 *
 * O'quvchilar ro'yxati `GET /sessions/:id/roster` dan — faqat dars sanasida
 * guruh a'zosi bo'lganlar (aks holda backend `STUDENTS_NOT_IN_GROUP`).
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
    data: roster,
    isLoading,
    isError: isRosterError,
    error: rosterError,
  } = useSessionRoster(session.id);
  const saveAttendance = useSaveAttendance(session.id);
  const saveResults = useSaveResults(session.id);

  // "Dars boshlandimi" — tenant timezone bo'yicha (backend ham shunday hisoblaydi).
  const { data: tenantSettings } = useTenantSettings();
  const hasStarted = hasSessionStarted(session, tenantSettings?.timezone);

  // Teacher uchun natija coini tenant limitidan oshmasin (bittasi oshsa butun so'rov rad etiladi).
  const { limit: teacherCoinLimit } = useTeacherCoinLimit();
  const maxCoinAmount =
    teacherCoinLimit !== null
      ? Math.min(teacherCoinLimit, MAX_COIN_AMOUNT)
      : MAX_COIN_AMOUNT;

  const students = useMemo<EvaluationStudent[]>(
    () =>
      roster?.students.map(({ student, leftAt }) => ({
        id: student.id,
        fullName: student.fullName,
        avatarUrl: student.avatarUrl,
        leftAt,
      })) ?? [],
    [roster],
  );

  const [attendanceRecords, setAttendanceRecords] = useState<
    Record<string, AttendanceLocalRecord>
  >({});
  const [scoredRecords, setScoredRecords] = useState<
    Record<string, ScoredLocalRecord>
  >({});
  /** Backend xato qaytargan o'quvchilar (masalan SCORE_EXCEEDS_MAX). */
  const [invalidStudentIds, setInvalidStudentIds] = useState<string[]>([]);

  // Roster (qayta) kelganda inputlar undan to'ldiriladi. Effect o'rniga render
  // paytida sozlanadi (react.dev: "adjusting state when a prop changes").
  const [prefilledFrom, setPrefilledFrom] = useState<typeof roster>();

  if (roster && prefilledFrom !== roster) {
    setPrefilledFrom(roster);
    setAttendanceRecords(buildAttendanceRecords(roster.students));
    setScoredRecords(buildScoredRecords(roster.students));
    setInvalidStudentIds([]);
  }

  const isDisabled = readOnly || !hasStarted;

  // ─── Attendance rejimi ────────────────────────────────────────────────────
  const setAttendanceStatus = (studentId: string, status: AttendanceStatus) => {
    if (isDisabled) return;
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }));
    setInvalidStudentIds((prev) => prev.filter((id) => id !== studentId));
  };

  const toggleHomework = (studentId: string) => {
    if (isDisabled) return;
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        homeworkDone: !prev[studentId].homeworkDone,
      },
    }));
  };

  const setAllAttendanceStatus = (status: AttendanceStatus) => {
    if (isDisabled) return;
    setAttendanceRecords((prev) => {
      const next: Record<string, AttendanceLocalRecord> = {};
      for (const [studentId, record] of Object.entries(prev)) {
        next[studentId] = { ...record, status };
      }
      return next;
    });
  };

  const setAllHomework = (value: boolean) => {
    if (isDisabled) return;
    setAttendanceRecords((prev) => {
      const next: Record<string, AttendanceLocalRecord> = {};
      for (const [studentId, record] of Object.entries(prev)) {
        next[studentId] = { ...record, homeworkDone: value };
      }
      return next;
    });
  };

  // ─── Scored rejimi ────────────────────────────────────────────────────────
  const updateScored = (
    studentId: string,
    patch: Partial<ScoredLocalRecord>,
  ) => {
    if (isDisabled) return;
    setScoredRecords((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], ...patch },
    }));
    setInvalidStudentIds((prev) => prev.filter((id) => id !== studentId));
  };

  const setAllScoredPresent = (value: boolean) => {
    if (isDisabled) return;
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
    if (isDisabled) return;
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

  // Saqlash bitta tranzaksiyada — xatodan keyin hech kim saqlanmaydi, formani
  // o'zgarishsiz qayta yuborish xavfsiz.
  const handleError = (error: unknown) => {
    const data = getApiErrorData(error);
    const studentIds = [
      ...(data?.studentIds ?? []),
      ...(data?.studentId ? [data.studentId] : []),
    ];
    const names = studentIds
      .map((id) => nameById.get(id))
      .filter(Boolean)
      .join(", ");
    const message = translateApiError(error, t);

    toast.error(names ? `${message}: ${names}` : message);
    setInvalidStudentIds(studentIds);
  };

  const save = (onSuccess?: () => void) => {
    // Backend baribir `SESSION_NOT_STARTED` qaytaradi — so'rovni yubormaymiz.
    if (!hasStarted) {
      toast.error(t("sessions.evaluation.notStartedHint"));
      return;
    }

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
            ? Math.min(Number(r.coinAmount) || 0, maxCoinAmount)
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

    // Yangi format: faqat `status` (isPresent yuborilmaydi — mos kelmaslik xavfi yo'q).
    const records: AttendanceRecordInput[] = Object.entries(
      attendanceRecords,
    ).map(([studentId, r]) => ({
      studentId,
      status: r.status,
      homeworkDone: r.homeworkDone,
    }));

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
    maxCoinAmount,
    teacherCoinLimit,
    students,
    hasGroup: !!session.group.id,
    /** Dars hali boshlanmagan — yo'qlama qo'yib bo'lmaydi. */
    hasStarted,
    isLoading,
    // Ro'yxatni olib bo'lmadi — "o'quvchilar yo'q" deb ko'rsatilmasin.
    isRosterError,
    isRosterForbidden: isForbiddenError(rosterError),
    attendanceRecords,
    setAttendanceStatus,
    toggleHomework,
    setAllAttendanceStatus,
    setAllHomework,
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
