import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type {
  CourseItem,
  CourseResponse,
  CreateCourseDto,
  UpdateCourseDto,
  UpdateResponse,
} from "../types";

export const getAllCourses = async (
  params?: Record<string, string | undefined>,
): Promise<CourseResponse> => {
  const res = await request.get<CourseResponse>(ENDPOINTS.COURSES, {
    params,
  });
  return res.data;
};

export const createCourse = async (
  data: CreateCourseDto,
): Promise<CourseItem> => {
  const response = await request.post<CourseItem>(ENDPOINTS.COURSES, data);
  return response.data;
};

export const updateCourse = async (
  courseId: string,
  data: UpdateCourseDto,
): Promise<UpdateResponse> => {
  const response = await request.patch<UpdateResponse>(
    `${ENDPOINTS.COURSES}/${courseId}`,
    data,
  );
  return response.data;
};
