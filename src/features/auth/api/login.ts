import { api } from "@/app/libs";

export interface LoginDto {
  email: string;
  password: string;
}

export const login = async (data: LoginDto) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};
