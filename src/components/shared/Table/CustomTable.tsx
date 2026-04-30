import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

interface CustomTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  loading?: boolean;
  pageSize?: number;
  currentPage?: number;
  className?: string;
  bodyClass?: string;
  headerClass?: string;
  rowsClassName?: string;
  onRowClick?: (row: T) => void;
  isCheckable?: boolean;
  selectedRows?: T[];
  setSelectedRows?: Dispatch<SetStateAction<T[]>>;
}

export const CustomTable = <T,>({
  data,
  columns,
  loading = false,
  pageSize,
  currentPage,
  className,
  bodyClass,
  headerClass,
  rowsClassName,
  onRowClick,
  isCheckable = false,
  selectedRows,
  setSelectedRows,
}: CustomTableProps<T>) => {
  const [isHeaderChecked, setIsHeaderChecked] = useState(false);
  const [isHeaderIndeterminate, setIsHeaderIndeterminate] = useState(false);

  useEffect(() => {
    if (!selectedRows?.length) {
      setIsHeaderChecked(false);
      setIsHeaderIndeterminate(false);
      return;
    }

    if (selectedRows.length === data.length) {
      setIsHeaderChecked(true);
      setIsHeaderIndeterminate(false);
      return;
    }

    setIsHeaderChecked(true);
    setIsHeaderIndeterminate(true);
  }, [selectedRows, data]);

  const handleHeaderCheckboxChange = () => {
    if (!setSelectedRows) return;

    if (isHeaderChecked || isHeaderIndeterminate) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...data]);
    }
  };

  const handleRowCheckboxChange = (row: T) => {
    if (!setSelectedRows) return;

    setSelectedRows((prev) => {
      const exists = prev.some((item) => item === row);
      return exists ? prev.filter((item) => item !== row) : [...prev, row];
    });
  };

  const table = useReactTable<T>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const columnCount =
    columns.length + (isCheckable ? 1 : 0) + (currentPage && pageSize ? 1 : 0);

  const renderBody = () => {
    if (loading) {
      return (
        <>
          <TableRow>
            <TableCell colSpan={columnCount} className="h-1 p-0!">
              <div className="progress" />
            </TableCell>
          </TableRow>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index} className="bg-white">
              {isCheckable && (
                <TableCell className="px-4 py-6">
                  <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
                </TableCell>
              )}
              {columns.map((_, colIndex) => (
                <TableCell key={colIndex} className="px-4 py-6">
                  <div className="h-4 rounded bg-gray-200 animate-pulse" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </>
      );
    }

    const rows = table.getRowModel().rows;

    if (!rows.length) {
      return (
        <TableRow>
          <TableCell
            colSpan={columnCount}
            className="px-4 py-6 text-center text-gray-500"
          >
            Ma'lumot mavjud emas!
          </TableCell>
        </TableRow>
      );
    }

    return rows.map((row) => (
      <TableRow
        key={row.id}
        onClick={() => onRowClick?.(row.original)}
        className={cn(
          "bg-background",
          onRowClick && "cursor-pointer hover:bg-[#2ED0FF1A]",
          rowsClassName
        )}
      >
        {isCheckable && (
          <TableCell className="px-4 py-6">
            <Checkbox
              checked={selectedRows?.includes(row.original)}
              onCheckedChange={() => handleRowCheckboxChange(row.original)}
              onClick={(e) => e.stopPropagation()}
            />
          </TableCell>
        )}
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id} className="px-4 py-6">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <Table className={cn("rounded-xl overflow-hidden", className)}>
      <TableHeader className={cn("bg-bg-primary dark:bg-black", headerClass)}>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {isCheckable && (
              <TableHead className="w-2.5 px-4 py-4">
                <Checkbox
                  isMinusIcon
                  checked={isHeaderChecked}
                  onCheckedChange={handleHeaderCheckboxChange}
                  className="border-gray-300 bg-white"
                />
              </TableHead>
            )}
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} className="px-4 py-4 font-semibold">
                {!header.isPlaceholder &&
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody className={bodyClass}>{renderBody()}</TableBody>

      {table
        .getFooterGroups()
        .some((group) =>
          group.headers.some(
            (header) => !header.isPlaceholder && header.column.columnDef.footer
          )
        ) && (
        <tfoot className="border-t border-gray-100 bg-gray-50/50">
          {table.getFooterGroups().map((footerGroup) => (
            <TableRow key={footerGroup.id}>
              {isCheckable && <TableCell />}
              {footerGroup.headers.map((header) => (
                <TableCell
                  key={header.id}
                  className="px-4 py-4 font-semibold text-gray-900"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </tfoot>
      )}
    </Table>
  );
};
