import { SubjectHeader } from "@/features/controls/components/header";
import { EmployeeCard } from "@/features/controls/components/ui";
import { employees } from "@/features/controls/constants";

const EmployeesPage = () => {
  return (
    <div className="space-y-6">
      <SubjectHeader />
      <div className="grid grid-cols-4 gap-5">
        {employees.map((item) => (
          <EmployeeCard data={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default EmployeesPage;
