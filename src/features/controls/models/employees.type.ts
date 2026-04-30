interface Group {
  id: number;
  name: string;
}

interface Tenant {
  id: number;
  name: string;
  isActive: boolean;
}

export interface Employee {
  id: number;
  phone: string;
  fullName: string;
  avatarUrl: string;
  isActive: boolean;
  taughtGroups: Group[];
  tenant: Tenant;
}
