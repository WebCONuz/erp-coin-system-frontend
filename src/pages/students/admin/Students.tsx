import { StudentDataFilter, StudentList } from "@/features/students/components";

const Students = () => {
  const searchData = (val: string) => console.log(val);
  const changePhone = (val: string) => console.log("Phone:", val);
  const classFilter = (val: string) => console.log("Class filter:", val);
  const clearFilters = () => console.log("Filters cleared");
  const openAddStudent = () => console.log("O'quvchi qo'shish modalini ochish");
  const importExel = () => console.log("Excel import");

  return (
    <div className="flex flex-col gap-y-6">
      <StudentDataFilter
        onSearch={searchData}
        onPhoneChange={changePhone}
        onClassFilter={classFilter}
        onClear={clearFilters}
        onAddStudent={openAddStudent}
        onImportExcel={importExel}
      />
      <StudentList />
    </div>
  );
};

export default Students;
