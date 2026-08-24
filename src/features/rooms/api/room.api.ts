import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { CreateRoomDto, Room, RoomsResponse, UpdateRoomDto } from "../types";

export const getAllRooms = async (
  params?: Record<string, string | undefined>,
): Promise<RoomsResponse> => {
  const res = await request.get<RoomsResponse>(ENDPOINTS.ROOMS, { params });
  return res.data;
};

export const getRoomById = async (id: string): Promise<Room> => {
  const res = await request.get<Room>(`${ENDPOINTS.ROOMS}/${id}`);
  return res.data;
};

export const createRoom = async (data: CreateRoomDto): Promise<Room> => {
  const res = await request.post<Room>(ENDPOINTS.ROOMS, data);
  return res.data;
};

export const updateRoom = async (
  id: string,
  data: UpdateRoomDto,
): Promise<Room> => {
  const res = await request.patch<Room>(`${ENDPOINTS.ROOMS}/${id}`, data);
  return res.data;
};

export const deleteRoom = async (id: string): Promise<{ message: string }> => {
  const res = await request.delete<{ message: string }>(
    `${ENDPOINTS.ROOMS}/${id}`,
  );
  return res.data;
};
