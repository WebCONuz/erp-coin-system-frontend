import { Trans } from "react-i18next";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/ui/pagination";

interface TablePaginationProps {
  totalItems?: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const TablePagination = ({
  totalItems,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  className,
}: TablePaginationProps) => {
  return (
    <div
      className={cn(
        "flex flex-col-reverse items-center gap-3 px-1 py-4 sm:flex-row sm:justify-between",
        className,
      )}
    >
      <div className="text-sm text-muted-foreground tabular-nums">
        {!!totalItems && (
          <span>
            <Trans
              i18nKey="table.paginationSummary"
              values={{
                total: totalItems,
                from: (currentPage - 1) * (pageSize || 10) + 1,
                to: Math.min(currentPage * (pageSize || 10), totalItems),
              }}
              components={{ b: <b className="font-medium text-foreground" /> }}
            />
          </span>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};
