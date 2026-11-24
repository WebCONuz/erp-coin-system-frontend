import { useEffect, useEffectEvent } from "react";
import { useSearchParams } from "react-router-dom";

export type FilterParams = Record<string, string | null | undefined>;

/**
 * Filtr qiymatlarini URL search param'lariga yozadi.
 *
 * - Hammasi bitta `setSearchParams` chaqiruvida: alohida effect'lar bir xil
 *   render snapshot'idan foydalanib, bir-birining o'zgarishini ustidan yozardi.
 * - Faqat qiymatlar o'zgarganda ishlaydi va URL allaqachon mos bo'lsa hech
 *   narsa qilmaydi, shuning uchun sahifa yangilanganda `?page` saqlanadi.
 *   Filtr haqiqatan o'zgarganda `page` o'chiriladi (1-sahifaga qaytadi).
 * - Bo'sh qiymat (`""`, `null`, `undefined`) param'ni o'chiradi.
 */
export const useSyncFiltersToUrl = (params: FilterParams) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramsKey = JSON.stringify(params);

  const sync = useEffectEvent(() => {
    const changed = Object.entries(params)
      .map(([key, value]) => [key, value || null] as const)
      .filter(([key, value]) => (searchParams.get(key) ?? null) !== value);
    if (!changed.length) return;

    const next = new URLSearchParams(searchParams);
    for (const [key, value] of changed) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    next.delete("page");
    setSearchParams(next, { replace: true });
  });

  useEffect(() => {
    sync();
  }, [paramsKey]);
};
