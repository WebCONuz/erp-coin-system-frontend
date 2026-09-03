export interface TeacherTaughtGroup {
  id: string;
  name: string;
  maxStudents: number;
  course: { id: string; title: string };
  _count: { students: number };
}

export interface TeacherProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  role: { id: string; name: string; displayName: string };
  taughtGroups: TeacherTaughtGroup[];
}

export interface UpdateMyProfileDto {
  email?: string;
  avatarUrl?: string;
}
