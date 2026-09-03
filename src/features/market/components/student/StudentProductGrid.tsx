import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Gift, SearchIcon } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { usePurchaseReward } from "../../hooks";
import { StudentProductCard } from "./StudentProductCard";
import type { Reward } from "../../types";

export const StudentProductGrid = ({ rewards }: { rewards: Reward[] }) => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const purchaseReward = usePurchaseReward();

  const balance = user?.wallet?.balance ?? 0;
  const search = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("category");

  const filtered = rewards
    .filter((r) => !categoryId || r.categoryId === categoryId)
    .filter(
      (r) => !search || r.title.toLowerCase().includes(search.toLowerCase()),
    );

  const handleSearch = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("search", value);
    else next.delete("search");
    setSearchParams(next, { replace: true });
  };

  const handleBuy = (reward: Reward) => {
    if (!window.confirm(`"${reward.title}" ni sotib olishni tasdiqlaysizmi?`))
      return;

    purchaseReward.mutate(reward.id, {
      onSuccess: (res) => toast.success(res.message),
      onError: (error: any) =>
        toast.error(error?.data?.message || "Xatolik yuz berdi"),
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">
          {filtered.length} ta sovg'a topildi
        </p>
        <div className="relative">
          <SearchIcon
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/50"
          />
          <input
            defaultValue={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Sovg'a qidirish..."
            className="w-64 rounded-xl border border-ink/10 bg-white pl-9 pr-3 py-2 text-sm text-ink placeholder:text-ink-soft/50 outline-none focus:border-gold/50"
          />
        </div>
      </div>

      {!filtered.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-ink/10 bg-white">
          <Gift size={22} className="text-ink-soft/50 mb-2" />
          <p className="text-sm font-medium text-ink">Sovg'alar topilmadi</p>
          <p className="text-xs text-ink-soft mt-1 max-w-xs">
            Boshqa kategoriya yoki qidiruvni tanlab ko'ring.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {filtered.map((reward) => (
            <StudentProductCard
              key={reward.id}
              product={reward}
              balance={balance}
              onBuy={handleBuy}
              isBuying={purchaseReward.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
};
