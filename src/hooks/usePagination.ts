import { useState, useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

interface UsePaginationProps {
  initialPageSize?: number;
  totalItems?: number;
  queryParam?: string;
}

interface UsePaginationReturn {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

export const usePagination = ({
  initialPageSize = 10,
  totalItems = 0,
  queryParam = "page",
}: UsePaginationProps = {}): UsePaginationReturn => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current page from URL query or default to 1
  const currentPageFromQuery = useMemo(() => {
    const page = parseInt(searchParams.get(queryParam) || "1", 10);
    return isNaN(page) ? 1 : Math.max(1, page);
  }, [searchParams, queryParam]);

  const [currentPage, setCurrentPageState] = useState(currentPageFromQuery);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Calculate totalPages safely
  const totalPages = useMemo(
    () => (totalItems > 0 ? Math.max(1, Math.ceil(totalItems / pageSize)) : 1),
    [totalItems, pageSize],
  );

  const startIndex = useMemo(
    () => (currentPage - 1) * pageSize,
    [currentPage, pageSize],
  );
  const endIndex = useMemo(
    () => (totalItems > 0 ? Math.min(startIndex + pageSize, totalItems) : 0),
    [startIndex, pageSize, totalItems],
  );

  // Update URL when page changes
  const setPage = useCallback(
    (page: number) => {
      // Only set page if totalPages is valid
      if (totalPages <= 0) {
        return;
      }

      const newPage = Math.max(1, Math.min(page, totalPages));

      if (newPage === currentPage) {
        return;
      }
      setCurrentPageState(newPage);
      // Update URL query parameter - ALWAYS keep page in URL
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(queryParam, newPage.toString()); // Always set, even for page=1
      setSearchParams(newSearchParams);
    },
    [totalPages, searchParams, queryParam, currentPage, setSearchParams],
  );

  // Sync with URL changes - only when URL actually changes
  useEffect(() => {
    const pageFromQuery = currentPageFromQuery;
    if (
      pageFromQuery !== currentPage &&
      pageFromQuery > 0 &&
      pageFromQuery <= totalPages
    ) {
      setCurrentPageState(pageFromQuery);
    }
  }, [currentPageFromQuery, currentPage, totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  }, [currentPage, totalPages, setPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  }, [currentPage, setPage]);

  const firstPage = useCallback(() => {
    setPage(1);
  }, [setPage]);

  const lastPage = useCallback(() => {
    setPage(totalPages);
  }, [totalPages, setPage]);

  const canGoNext = currentPage < totalPages;
  const canGoPrev = currentPage > 1;

  return {
    currentPage,
    pageSize,
    totalPages,
    startIndex,
    endIndex,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    canGoNext,
    canGoPrev,
  };
};
