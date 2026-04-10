import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../lib";
import { useLogin } from "../hooks/useLogin";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export const LoginForm = () => {
  const { mutate, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    mutate(data);
  };

  return (
    <Card className="w-full max-w-md border-border/40 shadow-none">
      <CardContent className="py-4 px-7">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-4 justify-center">
          <img src="/logo.png" alt="logo" className="w-4" />
          <span className="text-sm font-semibold text-yellow-400">
            BB-Coin System
          </span>
        </div>

        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-medium mb-1">Tizimga kirish</h2>
          <p className="text-sm text-muted-foreground">
            Davom etish uchun hisobingizga kiring
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* EMAIL */}
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Email</Label>
            <Input
              type="text"
              placeholder="example@mail.com"
              {...register("email")}
              className="h-10 bg-muted/40 border-border/50 focus-visible:ring-1"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground">Parol</Label>
              <a
                href="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Parolni unutdingizmi?
              </a>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className="h-10 bg-muted/40 border-border/50 focus-visible:ring-1 pr-9"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* SUBMIT */}
          <Button
            type="submit"
            className="w-full h-9 mt-2"
            disabled={isPending}
          >
            {isPending ? "Yuklanmoqda..." : "Kirish"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
