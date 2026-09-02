export interface MyGroupItem {
  membershipId: string;
  joinedAt: string;
  membershipActive: boolean;
  id: string;
  name: string;
  isActive: boolean;
  course: { id: string; title: string };
  teacher: { id: string; fullName: string; phone: string };
  _count: { students: number };
}
