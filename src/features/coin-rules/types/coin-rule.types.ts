export type CoinRuleDirection = "earn" | "deduct";
export type CoinRuleTriggerType = "auto" | "manual";
export type CoinRuleSourceType =
  | "attendance"
  | "homework"
  | "competition"
  | "bonus"
  | "penalty";

export interface CoinRule {
  id: string;
  name: string;
  description?: string | null;
  coinAmount: number;
  direction: CoinRuleDirection;
  triggerType: CoinRuleTriggerType;
  sourceType: CoinRuleSourceType | null;
  groupId: string | null;
  isActive: boolean;
  // Tenant bilan avtomatik yaratilgan asosiy qoida ("Davomat", "Uyga vazifa").
  // Faqat backend belgilaydi — POST/PATCH body'da yuborilsa 400 qaytadi.
  isBuiltIn: boolean;
  createdAt: string;
}

export interface CoinRulesResponse {
  data: CoinRule[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateCoinRuleDto {
  name: string;
  coinAmount: number;
  direction: CoinRuleDirection;
  triggerType: CoinRuleTriggerType;
  sourceType?: CoinRuleSourceType;
  description?: string;
  groupId?: string;
}

export interface UpdateCoinRuleDto {
  name?: string;
  coinAmount?: number;
  direction?: CoinRuleDirection;
  triggerType?: CoinRuleTriggerType;
  sourceType?: CoinRuleSourceType;
  description?: string;
  isActive?: boolean;
  groupId?: string;
}
