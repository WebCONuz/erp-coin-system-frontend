import type { IOption } from "@/components/controls";

export const coinRuleKeys = {
  allCoinRules: (params?: Record<string, any>) => [
    "all-coin-rules",
    params ?? {},
  ],
  oneCoinRuleById: (id: string) => ["one-coin-rule-by-id", id],
} as const;

export const directionOptions: IOption[] = [
  { value: "earn", label: "Mukofot (+)" },
  { value: "deduct", label: "Jarima (-)" },
];

export const triggerTypeOptions: IOption[] = [
  { value: "auto", label: "Avtomatik" },
  { value: "manual", label: "Qo'lda" },
];

export const sourceTypeOptions: IOption[] = [
  { value: "attendance", label: "Davomat" },
  { value: "homework", label: "Uy vazifasi" },
  { value: "competition", label: "Musobaqa" },
  { value: "bonus", label: "Bonus" },
  { value: "penalty", label: "Jarima" },
];

export const sourceTypeLabels: Record<string, string> = {
  attendance: "Davomat",
  homework: "Uy vazifasi",
  competition: "Musobaqa",
  bonus: "Bonus",
  penalty: "Jarima",
};

export const ALL_GROUPS_VALUE = "all";
