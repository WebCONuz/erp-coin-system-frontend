export interface Group {
  id: string;
  name: string;
  maxStudents: number;
}

interface Role {
  id: string;
  name: string;
  displayName: string;
}

export interface Teacher {
  id: string;
  phone: string;
  fullName: string;
  email: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  role: Role;
  taughtGroups: Group[];
}

export interface TeacherResponse {
  status: string;
  data: Teacher[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
