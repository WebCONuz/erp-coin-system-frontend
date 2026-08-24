import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { roomKeys } from "../constants";
import { createRoom, deleteRoom, getAllRooms, updateRoom } from "../api";
import type { CreateRoomDto, UpdateRoomDto } from "../types";

export const useRooms = () => {
  const [searchParams] = useSearchParams();
  const params = {
    search: searchParams.get("search") || undefined,
    isActive:
      searchParams.get("status") === "archive"
        ? "false"
        : searchParams.get("status") === "active"
          ? "true"
          : undefined,
    page: searchParams.get("page") || undefined,
  };

  return useQuery({
    queryKey: roomKeys.allRooms(params),
    queryFn: () => getAllRooms(params),
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoomDto) => createRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.allRooms() });
    },
  });
};

export const useUpdateRoom = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRoomDto) => updateRoom(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.allRooms() });
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.allRooms() });
    },
  });
};
