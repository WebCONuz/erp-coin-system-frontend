import { Eye, Pencil, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Student } from "../models";
import type { ColumnDef } from "@/types";
import { UniversalTable } from "@/components/shared/table";
import { mockStudents } from "../constants/student.mock";

export const StudentList = () => {
  const columns: ColumnDef<Student>[] = [
    {
      header: "Nomi",
      accessorKey: "name",
      render: (s) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white">
            {s.name.charAt(0)}
          </div>
          <span>{s.name}</span>
        </div>
      ),
    },
    { header: "Sinf", accessorKey: "class" },
    { header: "Telefon", accessorKey: "phone" },
    { header: "Email", accessorKey: "email" },
    { header: "Tug'ilgan sana", accessorKey: "dob" },
    {
      header: "Coin",
      accessorKey: "coin",
      render: (s) => (
        <div className="flex items-center gap-4">
          <span
            className={`font-bold ${
              s.coin > 0 ? "text-green-500" : "text-orange-500"
            } flex items-center gap-1 text-sm`}
          >
            <div
              className={`w-4 h-4 ${
                s.coin > 0 ? "bg-green-500" : "bg-orange-400"
              } rounded-full text-[10px] text-white flex items-center justify-center font-bold`}
            >
              $
            </div>
            {s.coin}
          </span>
          <div className="flex border rounded-md">
            <button className="px-1 text-red-500 border-r hover:bg-gray-50">
              <Minus size={14} />
            </button>
            <button className="px-1 text-green-500 hover:bg-gray-50">
              <Plus size={14} />
            </button>
          </div>
        </div>
      ),
    },
    {
      header: <div className="text-end pr-3">Amallar</div>,
      accessorKey: "actions",
      render: () => (
        <div className="flex gap-1 justify-end">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500">
            <Pencil size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <UniversalTable
      data={mockStudents}
      columns={columns}
      currentPage={1}
      totalPages={5}
      onPageChange={(p) => console.log(p)}
    />
  );
};
