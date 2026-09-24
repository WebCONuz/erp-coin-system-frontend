import type { IOption } from "@/components/controls";

export const coinRuleKeys = {
  allCoinRules: (params?: Record<string, any>) => [
    "all-coin-rules",
    params ?? {},
  ],
  oneCoinRuleById: (id: string) => ["one-coin-rule-by-id", id],
} as const;

export const getDirectionOptions = (t: (key: string) => string): IOption[] => [
  { value: "earn", label: t("coinRules.direction.earn") },
  { value: "deduct", label: t("coinRules.direction.deduct") },
];

export const getTriggerTypeOptions = (
  t: (key: string) => string,
): IOption[] => [
  { value: "auto", label: t("coinRules.triggerType.auto") },
  { value: "manual", label: t("coinRules.triggerType.manual") },
];

export const getSourceTypeOptions = (t: (key: string) => string): IOption[] => [
  { value: "attendance", label: t("coinRules.sourceType.attendance") },
  { value: "homework", label: t("coinRules.sourceType.homework") },
  { value: "competition", label: t("coinRules.sourceType.competition") },
  { value: "bonus", label: t("coinRules.sourceType.bonus") },
  { value: "penalty", label: t("coinRules.sourceType.penalty") },
];

export const getSourceTypeLabels = (
  t: (key: string) => string,
): Record<string, string> => ({
  attendance: t("coinRules.sourceType.attendance"),
  homework: t("coinRules.sourceType.homework"),
  competition: t("coinRules.sourceType.competition"),
  bonus: t("coinRules.sourceType.bonus"),
  penalty: t("coinRules.sourceType.penalty"),
});

export const ALL_GROUPS_VALUE = "all";

// Har bir tenantda bu turdagi umumiy (groupId siz) auto "earn" qoida asosiy
// qoida sifatida allaqachon mavjud — yangisi faqat guruhga bog'lanib yaratiladi.
export const BUILT_IN_SOURCE_TYPES = ["attendance", "homework"] as const;

export const requiresGroupForAutoRule = (values: {
  triggerType?: string;
  direction?: string;
  sourceType?: string;
}) =>
  values.triggerType === "auto" &&
  values.direction === "earn" &&
  BUILT_IN_SOURCE_TYPES.some((s) => s === values.sourceType);
