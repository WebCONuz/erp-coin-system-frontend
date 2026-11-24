import {
  hashKey,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import { isClientError } from "@/ustils";
import { getActiveTenantId } from "@/features/tenants/lib";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 daqiqa "fresh"
      // 4xx (403 ruxsat yo'q, 404 topilmadi) javobini qayta so'rash natijani
      // o'zgartirmaydi — faqat xabar ko'rsatilishini bir necha soniyaga kechiktiradi.
      retry: (failureCount, error) =>
        !isClientError(error) && failureCount < 3,
      // Faol tenant har bir query hash'iga qo'shiladi: bir xil key turli
      // tenantlar uchun alohida keshlanadi (super_admin/creator tenant
      // almashtirganda boshqa tenant ma'lumoti ko'rinib qolmasligi uchun).
      // `invalidateQueries({ queryKey })` key bo'yicha moslaydi — hamma
      // tenantlardagi nusxalarga ta'sir qiladi.
      queryKeyHashFn: (queryKey) =>
        hashKey([{ tenantId: getActiveTenantId() }, ...queryKey]),
    },
  },
});
export const QueryProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
