import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { isClientError } from "@/ustils";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 daqiqa "fresh"
      // 4xx (403 ruxsat yo'q, 404 topilmadi) javobini qayta so'rash natijani
      // o'zgartirmaydi — faqat xabar ko'rsatilishini bir necha soniyaga kechiktiradi.
      retry: (failureCount, error) =>
        !isClientError(error) && failureCount < 3,
    },
  },
});
export const QueryProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
