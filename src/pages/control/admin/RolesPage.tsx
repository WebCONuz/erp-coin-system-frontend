import { CustomTable, TablePagination } from "@/components/shared/table";
import { roles } from "@/features/controls/constants";
import { useRoleTable } from "@/features/controls/hooks";

const RolesPage = () => {
  const { columns } = useRoleTable();
  return (
    <div className="flex flex-col">
      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10">
        <CustomTable
          data={roles ?? []}
          columns={columns}
          bodyClass="px-4 py-6"
          className="border-0 bg-background"
        />
      </div>
      <TablePagination
        totalItems={1}
        currentPage={1}
        totalPages={1}
        pageSize={10}
        onPageChange={() => console.log("+++")}
      />
    </div>
  );
};

export default RolesPage;
