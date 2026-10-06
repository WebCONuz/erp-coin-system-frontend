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
      className={cn("flex items-center justify-between py-4 px-4", className)}
    >
      <div className="text-sm text-gray-600 dark:text-gray-300">
        {totalItems && (
          <span>
            <Trans
              i18nKey="table.paginationSummary"
              values={{
                total: totalItems,
                from: (currentPage - 1) * (pageSize || 10) + 1,
                to: Math.min(currentPage * (pageSize || 10), totalItems),
              }}
              components={{ b: <b /> }}
            />
          </span>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        // className="mx-auto"
      />
    </div>
  );
};
