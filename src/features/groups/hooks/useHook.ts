import { useQuery } from "@tanstack/react-query";
import { courseKeys, groupKeys } from "../constants";
import { getAllCourses } from "../api/course.api";
import { getAllGroups } from "../api/group.api";

// COURSES
export const useCourses = (params?: Record<string, string | undefined>) => {
  return useQuery({
    queryKey: courseKeys.allCourses(params),
    queryFn: () => getAllCourses(params),
  });
};

// GROUPS
export const useGroups = (params?: Record<string, string | undefined>) => {
  return useQuery({
    queryKey: groupKeys.allGroups(params),
    queryFn: () => getAllGroups(params),
  });
};
