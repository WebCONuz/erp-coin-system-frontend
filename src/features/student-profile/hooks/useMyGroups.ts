import { useQuery } from "@tanstack/react-query";
import { getMyGroups } from "../api";
import { studentSelfKeys } from "../constants";

export const useMyGroups = () => {
  return useQuery({
    queryKey: studentSelfKeys.myGroups(),
    queryFn: getMyGroups,
  });
};
