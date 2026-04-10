import { useMutation } from "@tanstack/react-query";
import { login } from "../api/login";
import { useAuthStore } from "../models/useAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.user);
      toast.success("Welcome back");
      navigate("/admin");
    },
    onError: () => {
      toast.error("Invalid credentials");
      navigate("/admin"); // olib tashlanadi
    },
  });
};
