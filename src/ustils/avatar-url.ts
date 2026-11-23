import { z } from "zod";

export const AVATAR_URL_MAX = 500;

/**
 * Backend faqat ikki ko'rinishni qabul qiladi: tizimga yuklangan fayl
 * (`/uploads/avatars/...`) yoki tashqi `https://...` rasm.
 */
export const isValidAvatarUrl = (value: string) =>
  value.startsWith("/uploads/avatars/") || /^https:\/\/\S+$/.test(value);

/** Sovg'a rasmi: tizimga yuklangan fayl (`/uploads/...`) yoki `https://...`. */
export const isValidImageUrl = (value: string) =>
  value.startsWith("/uploads/") || /^https:\/\/\S+$/.test(value);

/** Bo'sh qiymat — maydon yuborilmaydi. */
export const createAvatarUrlSchema = (t: (key: string) => string) =>
  z
    .string()
    .trim()
    .max(AVATAR_URL_MAX, t("validation.avatarUrlMax"))
    .refine((value) => !value || isValidAvatarUrl(value), {
      message: t("validation.avatarUrlInvalid"),
    })
    .optional()
    .or(z.literal(""));
