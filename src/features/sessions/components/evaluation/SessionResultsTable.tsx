import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { numberDecimalMask, numberMask } from "@/ustils/mask-number";
import { MAX_COIN_AMOUNT, MAX_RESULT_NOTE_LENGTH } from "../../constants";
import type { SessionEvaluation } from "../../hooks";
import { EVALUATION_TONES, type EvaluationTone } from "./tones";

interface Props {
  evaluation: SessionEvaluation;
  disabled: boolean;
  tone: EvaluationTone;
}

/** Ko'pi bilan 2 ta kasr xonasi (backend qoidasi). */
const maskScore = (value: string, prev: string) => {
  const masked = numberDecimalMask(value);
  const [, decimals = ""] = masked.split(",");
  return decimals.length > 2 ? prev : masked;
};

const maskCoin = (value: string) => {
  const masked = numberMask(value);
  if (!masked) return "";
  return String(Math.min(Number(masked), MAX_COIN_AMOUNT));
};

export const SessionResultsTable = ({ evaluation, disabled, tone }: Props) => {
  const { t } = useTranslation();
  const styles = EVALUATION_TONES[tone];
  const [bulkCoin, setBulkCoin] = useState("");
  const {
    students,
    maxScore,
    scoredRecords,
    scoredErrors,
    invalidStudentIds,
    updateScored,
    setAllScoredPresent,
    fillCoinsForAll,
  } = evaluation;

  const recordValues = Object.values(scoredRecords);
  const allPresent =
    recordValues.length > 0 && recordValues.every((r) => r.isPresent);
  const somePresent = recordValues.some((r) => r.isPresent);

  return (
    <div className="space-y-3">
      {!disabled && (
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("text-sm", styles.muted)}>
            {t("sessions.results.coinForAll")}
          </span>
          <Input
            inputMode="numeric"
            value={bulkCoin}
            onChange={(e) => setBulkCoin(maskCoin(e.target.value))}
            placeholder="0"
            className="h-8 w-24"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!bulkCoin}
            onClick={() => fillCoinsForAll(bulkCoin)}
          >
            {t("sessions.results.applyToAll")}
          </Button>
        </div>
      )}

      <div className={styles.table}>
        <table className="w-full text-sm">
          <thead className={styles.thead}>
            <tr>
              <th className={cn(styles.th, "text-left")}>
                {t("common.student")}
              </th>
              <th className={cn(styles.th, "text-left")}>
                {t("common.phone")}
              </th>
              <th className={cn(styles.th, "text-center")}>
                <div className="flex items-center justify-center gap-2">
                  <Checkbox
                    isMinusIcon={somePresent && !allPresent}
                    checked={allPresent}
                    disabled={disabled}
                    onCheckedChange={() => setAllScoredPresent(!allPresent)}
                  />
                  {t("sessions.attendance.present")}
                </div>
              </th>
              <th className={cn(styles.th, "text-left whitespace-nowrap")}>
                {t("sessions.results.score")}
                {maxScore !== null && (
                  <span className={cn("font-normal", styles.muted)}>
                    {" "}
                    / {maxScore}
                  </span>
                )}
              </th>
              <th className={cn(styles.th, "text-left")}>
                {t("sessions.results.coin")}
              </th>
              <th className={cn(styles.th, "text-left")}>
                {t("sessions.results.note")}
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const record = scoredRecords[student.id];
              if (!record) return null;

              const scoreError = scoredErrors[student.id]?.score;
              const isInvalid =
                !!scoreError || invalidStudentIds.includes(student.id);
              const inputsDisabled = disabled || !record.isPresent;

              return (
                <tr
                  key={student.id}
                  className={cn(
                    styles.row,
                    "align-top",
                    isInvalid && "bg-red-50 dark:bg-red-950/20",
                  )}
                >
                  <td className={cn("px-4 py-2.5 min-w-40", styles.text)}>
                    {student.fullName}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-2.5 whitespace-nowrap",
                      styles.muted,
                    )}
                  >
                    {student.phone}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <Checkbox
                      checked={record.isPresent}
                      disabled={disabled}
                      onCheckedChange={() =>
                        updateScored(student.id, {
                          isPresent: !record.isPresent,
                        })
                      }
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      inputMode="decimal"
                      value={record.score}
                      disabled={inputsDisabled}
                      aria-invalid={isInvalid || undefined}
                      placeholder="—"
                      onChange={(e) =>
                        updateScored(student.id, {
                          score: maskScore(e.target.value, record.score),
                        })
                      }
                      className="h-8 w-24"
                    />
                    {scoreError && (
                      <p className="mt-1 max-w-32 text-xs text-destructive">
                        {scoreError}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      inputMode="numeric"
                      value={record.coinAmount}
                      disabled={inputsDisabled}
                      placeholder="0"
                      onChange={(e) =>
                        updateScored(student.id, {
                          coinAmount: maskCoin(e.target.value),
                        })
                      }
                      className="h-8 w-24"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      value={record.note}
                      disabled={disabled}
                      maxLength={MAX_RESULT_NOTE_LENGTH}
                      placeholder={t("sessions.results.notePlaceholder")}
                      onChange={(e) =>
                        updateScored(student.id, { note: e.target.value })
                      }
                      className="h-8 min-w-40"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
