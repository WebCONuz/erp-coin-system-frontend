export interface TeacherGroupItem {
  id: string;
  name: string;
  maxStudents: number;
  isActive: boolean;
  course: { id: string; title: string };
  /**
   * Guruhning asosiy o'qituvchisi. Teacher guruhga sessiya yoki dars jadvali
   * orqali biriktirilgan bo'lishi ham mumkin — shunda `teacher.id` joriy
   * foydalanuvchidan farq qiladi. Backend hali qaytarmasligi mumkin.
   */
  teacher?: { id: string; fullName?: string };
  _count: { students: number };
}
