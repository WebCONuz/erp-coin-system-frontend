export interface TeacherGroupItem {
  id: string;
  name: string;
  maxStudents: number;
  isActive: boolean;
  course: { id: string; title: string };
  _count: { students: number };
}
