import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginFormValues } from "../../schema";
import { useAuth } from "../../hooks/useLogin";

export const LoginDesktop = () => {
  const { login, isLoginLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  return (
    <div className="hidden min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative flex flex-col justify-between overflow-hidden bg-linear-to-br from-primary via-[#6d46c4] to-[#4c2f96] p-12 text-white">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 -translate-x-1/3 translate-y-1/3 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex items-center gap-2.5">
          <img src="/logo.png" alt="BB-Coin" className="h-9 w-9" />
          <span className="text-lg font-semibold">BB-Coin System</span>
        </div>

        <div className="relative max-w-md space-y-4">
          <h1 className="text-4xl leading-tight font-semibold">
            O'quv markazingizni bitta platformada boshqaring
          </h1>
          <p className="text-white/70">
            Guruhlar, talabalar, o'qituvchilar va tanga iqtisodiyotini yagona
            admin panelidan nazorat qiling.
          </p>
        </div>

        <p className="relative text-sm text-white/50">
          © {new Date().getFullYear()} BB-Coin System
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold">Tizimga kirish</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Davom etish uchun hisobingizga kiring
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* PHONE */}
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">
                Telefon raqami
              </Label>
              <Input
                type="tel"
                placeholder="+998(00) 000-00-00"
                {...register("phone")}
                className="h-10 border-border/50 bg-muted/40 focus-visible:ring-1"
              />
              {errors.phone && (
                <p className="text-xs text-destructive">
                  {errors.phone.message}
                </p>
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
                  className="h-10 border-border/50 bg-muted/40 pr-9 focus-visible:ring-1"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
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
              className="mt-2 h-10 w-full"
              disabled={isLoginLoading}
            >
              {isLoginLoading ? "Yuklanmoqda..." : "Kirish"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
