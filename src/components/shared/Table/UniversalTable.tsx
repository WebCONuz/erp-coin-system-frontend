import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ColumnDef } from "@/types";

interface UniversalTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function UniversalTable<T extends { id: string | number }>({
  data,
  columns,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: UniversalTableProps<T>) {
  if (isLoading)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Yuklanmoqda...
      </div>
    );

  return (
    <div className="w-full bg-card text-card-foreground rounded-lg shadow-sm border border-border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-12 text-muted-foreground font-semibold">
              №
            </TableHead>
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className="font-semibold text-muted-foreground"
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow
                key={row.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="text-foreground">
                  {rowIndex + 1}
                </TableCell>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} className="text-foreground">
                    {column.render
                      ? column.render(row)
                      : (row[column.accessorKey as keyof T] as React.ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="h-24 text-center text-muted-foreground"
              >
                Ma'lumot topilmadi.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Part */}
      <div className="flex items-center justify-center space-x-2 py-4 border-t border-border bg-card">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="border-border text-foreground hover:bg-muted"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "ghost"}
              size="sm"
              onClick={() => onPageChange(i + 1)}
              className={`w-8 h-8 p-0 ${
                currentPage === i + 1
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {i + 1}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="border-border text-foreground hover:bg-muted"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
