import { useTranslation } from "react-i18next";
import { Building2, Plus, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { TenantCard } from "./ui";
import { useAllTenants } from "../hooks";
import type { TenentType } from "../types";
import type { TenantStatusFilter } from "./TenantsFilter";

interface Props {
  onEdit: (tenant: TenentType) => void;
  onAdd: () => void;
  status: TenantStatusFilter;
  search: string;
}

const GRID = "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4";

/**
 * Markazlar ro'yxati. Backend hammasini bitta so'rovda qaytaradi, shuning
 * uchun holat va qidiruv bo'yicha filtr shu yerda (klient tomonda) bajariladi.
 */
export const TenantsGrid = ({ onEdit, onAdd, status, search }: Props) => {
  const { data, isLoading, isError, refetch, isFetching } = useAllTenants(true);
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div aria-busy="true" className={GRID}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError && !data) {
    return <ErrorState onRetry={() => refetch()} isRetrying={isFetching} />;
  }

  const all = data ?? [];

  if (!all.length) {
    return (
      <div className="rounded-2xl border bg-card">
        <EmptyState
          icon={Building2}
          title={t("admin.tenants.no_data")}
          action={
            <Button onClick={onAdd} className="gap-2">
              <Plus className="size-4" aria-hidden />
              {t("admin.tenants.create")}
            </Button>
          }
        />
      </div>
    );
  }

  const query = search.trim().toLowerCase();
  const list = all.filter(
    (tenant) =>
      (status === "active" ? tenant.isActive : !tenant.isActive) &&
      (!query ||
        tenant.name.toLowerCase().includes(query) ||
        tenant.slug?.toLowerCase().includes(query)),
  );

  if (!list.length) {
    return (
      <div className="rounded-2xl border bg-card">
        <EmptyState
          icon={SearchX}
          title={t("tenants.empty.filteredTitle")}
          description={t("tenants.empty.filteredHint")}
        />
      </div>
    );
  }

  return (
    <ul className={GRID}>
      {list.map((item) => (
        <li key={item.id}>
          <TenantCard data={item} onEdit={onEdit} />
        </li>
      ))}
    </ul>
  );
};
