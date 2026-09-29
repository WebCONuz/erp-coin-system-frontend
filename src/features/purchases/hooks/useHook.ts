import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { dashboardKeys } from "@/features/dashboard/constants";
import { rewardKeys } from "@/features/market/constants";
import { studentKeys } from "@/features/students/constants";
import { getAllPurchases, updatePurchaseStatus } from "../api";
import { purchaseKeys } from "../constants";
import type { UpdatePurchaseStatusDto } from "../types";

// `explicitParams` — URL'ga bog'lanmagan joylar uchun (o'quvchi profilidagi
// tab, studentning "Xaridlarim" ro'yxati). Aks holda admin "Buyurtmalar"
// sahifasining ?status / ?page parametrlari o'qiladi.
export const usePurchases = (
  explicitParams?: Record<string, string | undefined>,
  options?: { enabled?: boolean },
) => {
  const [searchParams] = useSearchParams();
  const params = explicitParams ?? {
    status: searchParams.get("status") || undefined,
    // Sovg'alar ro'yxatidagi "Band" sonidan kelinganda.
    rewardId: searchParams.get("rewardId") || undefined,
    page: searchParams.get("page") || undefined,
    limit: "10",
  };

  return useQuery({
    queryKey: purchaseKeys.allPurchases(params),
    queryFn: () => getAllPurchases(params),
    enabled: options?.enabled ?? true,
  });
};

export const useUpdatePurchaseStatus = () => {
  const queryClient = useQueryClient();

  const invalidatePurchases = () =>
    queryClient.invalidateQueries({ queryKey: purchaseKeys.allPurchases() });

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePurchaseStatusDto }) =>
      updatePurchaseStatus(id, data),
    onSuccess: (_, { data }) => {
      invalidatePurchases();
      // Dashboard'dagi "kutilayotgan / topshirilishi kerak" hisoblagichlari.
      queryClient.invalidateQueries({ queryKey: dashboardKeys.admin() });

      // Bekor qilishda coin o'quvchiga, sovg'a zaxirasi do'konga qaytadi.
      if (data.status === "cancelled") {
        queryClient.invalidateQueries({ queryKey: rewardKeys.allRewards() });
        queryClient.invalidateQueries({ queryKey: studentKeys.allStudents() });
        queryClient.invalidateQueries({ queryKey: ["one-student-by-id"] });
      }
    },
    onError: (error: any) => {
      // 409 — holat shu orada boshqa so'rov bilan o'zgargan: ro'yxatni yangilaymiz.
      if (error?.status === 409) invalidatePurchases();
    },
  });
};
