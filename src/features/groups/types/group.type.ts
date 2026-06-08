export interface GroupItem {
  id: string;
  name: string;
  maxStudents: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  course: {
    id: string;
    title: string;
  };
  teacher: {
    id: string;
    fullName: string;
    phone: string;
  };
  _count: {
    students: number;
  };
}

export interface GroupResponse {
  status: string;
  data: GroupItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GroupStudent {
  id: string;
  joinedAt: string;
  addedById: string;
  student: {
    id: string;
    fullName: string;
    phone: string;
  };
}
export interface GroupDetail {
  id: string;
  name: string;
  maxStudents: number;
  createdAt: string;
  updatedAt: string;
  course: {
    id: string;
    title: string;
    description?: string;
  };
  teacher: {
    id: string;
    fullName: string;
    phone: string;
  };
  students: GroupStudent[];
}

export interface StudentUser {
  id: string;
  phone: string;
  fullName: string;
  email: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  role: {
    id: string;
    name: string;
    displayName: string;
  };
  wallet: {
    id: string;
    balance: number;
    updatedAt: string;
    userId: string;
  };
}

export interface StudentsListResponse {
  status: string;
  data: StudentUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// --- DTO ---

export interface CreateGroupDto {
  name: string;
  maxStudents: number;
  courseId: string;
  teacherId: string;
}

export interface UpdateGroupDto {
  name?: string;
  maxStudents?: number;
  courseId?: string;
  teacherId?: string;
}

export interface UpdateResponse {
  id: string;
  updatedAt: string;
}

export interface AddStudentDto {
  studentId: string;
}

export interface BulkAddStudentsDto {
  studentIds: string[];
}

export interface BulkAddStudentsResponse {
  message: string;
  summary: {
    totalRequested: number;
    brandNewAdded: number;
    restoredFromDeleted: number;
    skippedAlreadyActive: number;
  };
}
