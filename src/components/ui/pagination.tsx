import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showFirstLast = false,
  showPrevNext = true,
  maxVisiblePages = 3,
}: PaginationProps) => {
  const getVisiblePages = () => {
    const pages: number[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let start = Math.max(1, currentPage - halfVisible);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    // Adjust start if we're at the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const showStartDots = visiblePages[0] > 1;
  const showEndDots = visiblePages[visiblePages.length - 1] < totalPages;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {/* First Page Button */}
      {showFirstLast && totalPages > 1 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
          <ChevronLeft className="h-4 w-4 -ml-2" />
        </Button>
      )}

      {/* Previous Page Button */}
      {showPrevNext && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {/* Start Dots */}
      {showStartDots && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            className="h-8 w-8 p-0 border"
          >
            1
          </Button>
          <div className="flex items-center justify-center w-8 h-8">
            <MoreHorizontal className="h-4 w-4 text-gray-400" />
          </div>
        </>
      )}

      {/* Visible Pages */}
      {visiblePages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
          className={cn(
            "h-8 w-8 p-0 border",
            currentPage === page &&
              "bg-[#EDF8E2] hover:bg-[#EDF8E2]/90 text-[#115D5D] border border-[#C6EAA0]"
          )}
        >
          {page}
        </Button>
      ))}

      {/* End Dots */}
      {showEndDots && (
        <>
          <div className="flex items-center justify-center w-8 h-8">
            <MoreHorizontal className="h-4 w-4 text-gray-400" />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            className="h-8 w-8 p-0 border"
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* Next Page Button */}
      {showPrevNext && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* Last Page Button */}
      {showFirstLast && totalPages > 1 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
          <ChevronRight className="h-4 w-4 -ml-2" />
        </Button>
      )}
    </div>
  );
};

// Pagination with page info display
export const PaginationWithInfo = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps & {
  totalItems?: number;
  itemsPerPage?: number;
}) => {
  return (
    <div className={cn("flex items-center justify-end", className)}>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};
