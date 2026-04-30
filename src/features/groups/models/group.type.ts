export interface Group {
  id: string;
  name: string;
  maxStudents?: number;
  isActive: boolean;
  archivedAt: string | null;
  createdAt: string;
  courseId: string;
  tenantId: string;
  studentCount: number;
}

export interface Course {
  id: string;
  title: string;
  tenantId?: string;
}
