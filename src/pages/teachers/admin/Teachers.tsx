import { TeracherList } from "@/features/teachers/components";
import { TeacherDataFilter } from "@/features/teachers/components/TeacherDataFilter";

const Teachers = () => {
  const searchData = (val: string) => console.log(val);
  const exportTeacherData = () => console.log("exportTeacherData");
  const addTeacher = () => console.log("O'qituvchi qo'shish modalini ochish");
  const importExel = () => console.log("Excel import");

  return (
    <>
      <TeacherDataFilter
        addTeacher={addTeacher}
        exportTeacherData={exportTeacherData}
        importExcel={importExel}
        onSearch={searchData}
      />
      <TeracherList />
    </>
  );
};

export default Teachers;
