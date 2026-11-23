import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getAuditLogs } from "../api";
import { AUDIT_LOGS_PAGE_SIZE, auditLogKeys } from "../constants";
import type { AuditActionType, AuditLogsParams } from "../types";

// `explicitParams` — URL'ga bog'lanmagan joylar uchun (masalan o'quvchi
// profilidagi "Tarix" tab'i: `{ entityId }`). Aks holda audit log sahifasining
// ?actionType / ?entityType / ?fromDate / ?toDate / ?page parametrlari o'qiladi.
export const useAuditLogs = (
  explicitParams?: AuditLogsParams,
  options?: { enabled?: boolean },
) => {
  const [searchParams] = useSearchParams();
  const params: AuditLogsParams = explicitParams ?? {
    actionType:
      (searchParams.get("actionType") as AuditActionType | null) || undefined,
    entityType: searchParams.get("entityType") || undefined,
    userId: searchParams.get("userId") || undefined,
    fromDate: searchParams.get("fromDate") || undefined,
    toDate: searchParams.get("toDate") || undefined,
    page: searchParams.get("page") || undefined,
    limit: String(AUDIT_LOGS_PAGE_SIZE),
  };

  return useQuery({
    queryKey: auditLogKeys.allAuditLogs({ ...params }),
    queryFn: () => getAuditLogs(params),
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
    // Audit — jonli jurnal: yozuvlar boshqa sahifalardagi (yo'qlama, coin, xarid …)
    // va boshqa userlar/qurilmalardagi amallardan keladi, ularning hammasini
    // invalidatsiya qilib bo'lmaydi. Global 5 daqiqalik `staleTime` o'rniga har
    // ochilganda / oynaga qaytilganda qayta so'raladi.
    staleTime: 0,
  });
};
