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
