/**
 * Coin tranzaksiyasi manbalari. Backend yangi tur qo'shishi mumkin —
 * shuning uchun ixtiyoriy string ham qabul qilinadi.
 */
export type CoinSourceType =
  | "bonus"
  | "manual"
  | "attendance"
  | "late"
  | "homework"
  | "competition"
  | "exam"
  | "purchase"
  | "penalty"
  | (string & {});

/**
 * Bekor qilish endi **teskari yozuv** (storno) bilan: asl yozuv tarixda qoladi,
 * ustiga miqdori bir xil, yo'nalishi qarama-qarshi yozuv qo'shiladi.
 * (`GET /coin-transactions/history`, `GET /coin-transactions/my-history`)
 */
export interface CoinReversalFields {
  /** Bu yozuv teskari yozuv bo'lsa — qaysi tranzaksiyani bekor qilgani. */
  reversalOfId?: string | null;
  /** Bu yozuv bekor qilingan bo'lsa — unga yozilgan teskari yozuv. */
  reversal?: { id: string; createdAt: string } | null;
  /** Xarid yoki xaridni bekor qilish tranzaksiyasi bo'lsa — xarid ID'si. */
  purchaseId?: string | null;
  sessionId?: string | null;
  groupId?: string | null;
  ruleId?: string | null;
  tenantId?: string;
}

export type CoinTxState = "normal" | "reversal" | "reversed";

export const getCoinTxState = (tx: CoinReversalFields): CoinTxState =>
  tx.reversalOfId ? "reversal" : tx.reversal ? "reversed" : "normal";

/** Sessiya tekshiruvi (yo'qlama/natija) orqali yoziladigan coin turlari. */
const SESSION_COIN_SOURCE_TYPES = [
  "attendance",
  "late",
  "homework",
  "exam",
  "competition",
];

/**
 * "Bekor qilish" tugmasi faqat oddiy (teskari ham, bekor qilingan ham emas),
 * xarid bo'lmagan va sessiyaga bog'lanmagan yozuvlarda ko'rsatiladi.
 * Xarid → xaridning o'zini bekor qilish, sessiya coini → yo'qlamani o'zgartirish.
 * Backend baribir tekshiradi; `sessionId` javobda kelmasa turi bo'yicha taxmin qilinadi.
 */
export const canCancelCoinTx = (
  tx: CoinReversalFields & { sourceType: string },
) => {
  if (getCoinTxState(tx) !== "normal") return false;
  if (tx.sourceType === "purchase" || tx.purchaseId) return false;
  if (tx.sessionId) return false;
  if (tx.sessionId === undefined)
    return !SESSION_COIN_SOURCE_TYPES.includes(tx.sourceType);
  return true;
};
