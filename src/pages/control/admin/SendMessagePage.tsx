import { UniversalTable } from "@/components/shared/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { mockStudents } from "@/features/students/constants/student.mock";
import type { Student } from "@/features/students/models";
import type { ColumnDef } from "@/types";

const SendMessagePage = () => {
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
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 flex flex-col">
        <UniversalTable
          data={mockStudents}
          columns={columns}
          currentPage={1}
          totalPages={5}
          onPageChange={(p) => console.log(p)}
        />
      </div>
      <div className="col-span-1">
        <p className="mb-1 font-semibold text-lg">Xarbar matni:</p>
        <Textarea className="h-80" />
        <div className="flex justify-end mt-4">
          <Button className="bg-primary h-12 px-4 text-lg">Yuborish</Button>
        </div>
      </div>
    </div>
  );
};

export default SendMessagePage;
