import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TENANT_KEY } from "@/features/tenants/constants";
import { invalidateScheduleCaches } from "@/features/plans/hooks";
import { holidayKeys } from "../constants";
import { createHoliday, deleteHoliday, getHolidays } from "../api";
import type { CreateHolidayDto } from "../types";

export const useHolidays = (params: { from: string; to: string }) => {
  const tenantId = localStorage.getItem(TENANT_KEY) ?? undefined;
  return useQuery({
    queryKey: holidayKeys.allHolidays({ ...params, tenantId }),
    queryFn: () => getHolidays(params),
  });
};

// Dam olish kuni qo'shilsa/o'chirilsa backend kelajakdagi tekshirilmagan
// jadval darslarini o'chiradi/qaytaradi — kalendar va sessiyalar ham yangilansin.
export const useCreateHoliday = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateHolidayDto) => createHoliday(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: holidayKeys.allHolidays() });
      invalidateScheduleCaches(queryClient);
    },
  });
};

export const useDeleteHoliday = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteHoliday(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: holidayKeys.allHolidays() });
      invalidateScheduleCaches(queryClient);
    },
  });
};
