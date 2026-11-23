import { useCallback, useRef } from "react";
import { createIdempotencyKey, shouldKeepIdempotencyKey } from "@/ustils";

/**
 * Bitta amal (forma / tugma) uchun `Idempotency-Key`. Kalit birinchi
 * so'rovda yaratiladi va amal muvaffaqiyatli tugaguncha (yoki qayta
 * yuborish ma'nosiz bo'lgan xatogacha) o'zgarmaydi — tugmani ikki marta
 * bosish yoki tarmoq xatosidan keyingi qayta urinish coinni ikki marta
 * bermaydi. Mutatsiyada: `mutationFn` ichida `getKey()`, `onSettled` da `settle(error)`.
 *
 * `scope` — amal nimaga tegishli (masalan sovg'a ID'si). Boshqa scope bilan
 * chaqirilsa yangi kalit olinadi: boshqa URL'ga eski kalit `422` beradi.
 */
export const useIdempotencyKey = () => {
  const keyRef = useRef<{ key: string; scope?: string } | null>(null);

  const getKey = useCallback((scope?: string) => {
    if (!keyRef.current || keyRef.current.scope !== scope) {
      keyRef.current = { key: createIdempotencyKey(), scope };
    }
    return keyRef.current.key;
  }, []);

  const settle = useCallback((error?: unknown) => {
    if (!error || !shouldKeepIdempotencyKey(error)) keyRef.current = null;
  }, []);

  return { getKey, settle };
};
