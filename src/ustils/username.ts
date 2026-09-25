import { z } from "zod";

// Backend qoidasi: kichik harfga keltirilgandan keyin 3–30 belgi, a-z 0-9 _ .
export const USERNAME_REGEX = /^[a-z0-9_.]{3,30}$/;
const USERNAME_MAX = 30;

export const normalizeUsername = (value: string) => value.trim().toLowerCase();

export const createUsernameSchema = (t: (key: string) => string) =>
  z
    .string()
    .transform(normalizeUsername)
    .refine((value) => USERNAME_REGEX.test(value), {
      message: t("username.invalid"),
    });

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", ғ: "g", д: "d", е: "e", ё: "yo", ж: "j",
  з: "z", и: "i", й: "y", к: "k", қ: "q", л: "l", м: "m", н: "n", о: "o",
  п: "p", р: "r", с: "s", т: "t", у: "u", ў: "o", ф: "f", х: "x", ҳ: "h",
  ц: "ts", ч: "ch", ш: "sh", щ: "sh", ъ: "", ы: "i", ь: "", э: "e", ю: "yu",
  я: "ya",
};

/**
 * Ism-familiyadan username taklif qiladi: "Ali Valiyev" → "ali.valiyev".
 * Kirill harflari lotinga o'giriladi. Taklif 3 belgidan qisqa bo'lsa "" qaytadi.
 */
export const suggestUsername = (fullName: string) => {
  const latin = fullName
    .toLowerCase()
    .split("")
    .map((ch) => CYRILLIC_TO_LATIN[ch] ?? ch)
    .join("");

  const username = latin
    .replace(/['‘’ʻʼ`]/g, "")
    .trim()
    .replace(/\s+/g, ".")
    .replace(/[^a-z0-9_.]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, USERNAME_MAX)
    .replace(/\.+$/, "");

  return username.length >= 3 ? username : "";
};

// Axios interceptor `error.response` ni reject qiladi: { status, data: { message } }
type ApiErrorResponse = { status?: number; data?: { message?: unknown } };

export const getApiErrorStatus = (error: unknown) =>
  (error as ApiErrorResponse | undefined)?.status;

export const getApiErrorMessage = (error: unknown): string | undefined => {
  const message = (error as ApiErrorResponse | undefined)?.data?.message;
  if (Array.isArray(message)) return message.join(", ");
  return typeof message === "string" ? message : undefined;
};

/**
 * `409` javobida qaysi maydon band ekanini aniqlaydi (username yoki telefon),
 * shunda xatoni toast o'rniga input ostida ko'rsatish mumkin.
 */
export const getUserConflictField = (
  error: unknown,
): "username" | "phone" | null => {
  if (getApiErrorStatus(error) !== 409) return null;
  const message = (getApiErrorMessage(error) ?? "").toLowerCase();
  if (message.includes("username")) return "username";
  if (message.includes("telefon") || message.includes("phone")) return "phone";
  return null;
};
