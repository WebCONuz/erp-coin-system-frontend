import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@/types";
import { UniversalTable } from "@/components/shared/table";
import { mockTeachers } from "../constants/teacher.mock";
import type { Teacher } from "../models";

export const TeracherList = () => {
  const columns: ColumnDef<Teacher>[] = [
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
    {
      header: "Fanlar",
      accessorKey: "subjects",
      render: (s) => (
        <div className="flex items-center gap-2">
          {s.subjects.map((item, index) => (
            <span
              key={index}
              className="border border-border py-px px-1.5 rounded-3xl bg-gray-50 dark:bg-black"
            >
              {item}
            </span>
          ))}
        </div>
      ),
    },
    { header: "Telefon", accessorKey: "phone" },
    { header: "Email", accessorKey: "email" },
    { header: "Tug'ilgan sana", accessorKey: "birthday" },
    { header: "Yaratilgan sana", accessorKey: "createdAt" },
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
      data={mockTeachers}
      columns={columns}
      currentPage={1}
      totalPages={5}
      onPageChange={(p) => console.log(p)}
    />
  );
};
