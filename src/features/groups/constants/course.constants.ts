export const courseKeys = {
  allCourses: (params?: Record<string, any>) => ["all-courses", params ?? {}],
  oneCourseById: (id: string) => ["one-course-by-id", id],
} as const;
