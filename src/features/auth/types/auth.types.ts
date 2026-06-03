export interface LoginDto {
  phone: string;
  password: string;
}

export interface UserMe {
  id: string;
  phone: string;
  fullName: string;
  email: string | null;
  avatarUrl: string | null;
  parentPhone: string | null;
  isActive?: boolean;
  archivedAt: boolean | null;
  archivedById: string | null;
  tenantId: string;
  role: {
    id: string;
    name: string;
    displayName: string;
  };
  wallet: {
    balance: number;
  };
}

export interface ResponseUserMe {
  status: string;
  message: string;
  data: UserMe;
}
