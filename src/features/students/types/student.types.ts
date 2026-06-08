export interface Student {
  id: string;
  name: string;
  class: string;
  phone: string;
  email: string;
  dob: string;
  createdAt: string;
  coin: number;
}

export interface StudentDetail {
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

export interface StudentsResponse {
  status: string;
  data: StudentDetail[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
