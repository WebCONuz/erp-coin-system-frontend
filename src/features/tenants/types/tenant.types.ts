export type TenentType = {
  id: string;
  name: string;
  slug: string;
  plan: string;
  isActive: true;
  createdAt: string;
  _count: {
    users: number;
    groups: number;
  };
};

export type TenantResponse = {
  status: string;
  data: TenentType[];
};
