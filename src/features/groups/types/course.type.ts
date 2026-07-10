export interface CourseItem {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseResponse {
  status: string;
  data: CourseItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// DTO --
export interface CreateCourseDto {
  title: string;
  description?: string;
}

export interface UpdateCourseDto {
  title?: string;
  description?: string;
}
