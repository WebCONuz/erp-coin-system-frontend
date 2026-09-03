import { useSearchParams } from "react-router-dom";
import { useRewardCategories } from "../../hooks";

export const StudentCategorySidebar = ({
  totalCount,
}: {
  totalCount: number;
}) => {
  const { data: categories } = useRewardCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get("category") ?? "all";

  const select = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === "all") next.delete("category");
    else next.set("category", value);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-3">
      <h3 className="font-display text-sm font-semibold text-ink px-2 pt-1 pb-2">
        Kategoriyalar
      </h3>

      <button
        type="button"
        onClick={() => select("all")}
        className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
          active === "all"
            ? "bg-forest text-paper"
            : "text-ink-soft hover:bg-paper-soft"
        }`}
      >
        Barchasi
        <span
          className={active === "all" ? "text-paper/70" : "text-ink-soft/60"}
        >
          {totalCount}
        </span>
      </button>

      {(categories ?? []).map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => select(cat.id)}
          className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
            active === cat.id
              ? "bg-forest text-paper"
              : "text-ink-soft hover:bg-paper-soft"
          }`}
        >
          <span className="truncate">{cat.name}</span>
          <span
            className={`shrink-0 ${active === cat.id ? "text-paper/70" : "text-ink-soft/60"}`}
          >
            {cat._count?.rewards ?? 0}
          </span>
        </button>
      ))}
    </div>
  );
};
