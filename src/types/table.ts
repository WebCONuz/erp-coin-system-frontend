export interface ColumnDef<T> {
  header: string | React.ReactNode;
  accessorKey: keyof T | "actions";
  render?: (row: T) => React.ReactNode;
}
