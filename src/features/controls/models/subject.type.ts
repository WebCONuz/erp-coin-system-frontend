export interface Group {
  id: number;
  name: string;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  groups: Group[];
  color: string;
}
