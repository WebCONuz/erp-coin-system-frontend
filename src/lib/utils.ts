import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const FILE_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3031";

/**
 * Backend nisbiy yo'l qaytaradigan avatarUrl/imageUrl kabi maydonlarni
 * to'liq URL'ga aylantiradi (backend hujjatiga ko'ra ular host'siz keladi).
 */
export function getFileUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  return `${FILE_BASE_URL}${path}`;
}
