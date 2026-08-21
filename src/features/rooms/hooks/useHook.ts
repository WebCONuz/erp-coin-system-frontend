import { useQuery } from "@tanstack/react-query";
import { roomKeys } from "../constants";
import { getAllRooms } from "../api";

export const useRooms = (params?: Record<string, string | undefined>) => {
  return useQuery({
    queryKey: roomKeys.allRooms(params),
    queryFn: () => getAllRooms(params),
  });
};
