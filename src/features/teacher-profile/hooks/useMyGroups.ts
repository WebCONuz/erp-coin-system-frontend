import { useQuery } from "@tanstack/react-query";
import { getMyTaughtGroups } from "../api";
import { teacherSelfKeys } from "../constants";

export const useMyTaughtGroups = () => {
  return useQuery({
    queryKey: teacherSelfKeys.myGroups(),
    queryFn: getMyTaughtGroups,
  });
};
