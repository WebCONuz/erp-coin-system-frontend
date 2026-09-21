import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginFormValues } from "../../schema";
import { useAuth } from "../../hooks/useLogin";

export const LoginMobile = () => {
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
    <div className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-forest px-6 py-10 lg:hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-[-10%] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-[-15%] h-64 w-64 rounded-full bg-forest-light/40 blur-3xl" />

      <div className="relative flex flex-col items-center text-center">
        <img
          src="/mobile_auth_logo.png"
          alt="BB-Coin"
          className="h-24 w-24 drop-shadow-[0_8px_24px_rgba(237,162,59,0.35)]"
        />
        <h1 className="font-display mt-2 text-2xl font-semibold text-paper">
          BB-Coin
        </h1>
        <p className="font-display text-lg font-medium text-gold-soft">
          Tizimga kirish
        </p>
      </div>

      <img
        src="/mobile_auth.png"
        alt=""
        className="relative mx-auto mt-4 w-full max-w-70"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative mt-6 space-y-4"
      >
        {/* PHONE */}
        <div className="space-y-1.5">
          <Label className="text-xs text-paper/70">Telefon raqami</Label>
          <Input
            type="tel"
            placeholder="+998(00) 000-00-00"
            {...register("phone")}
            className="h-12 rounded-2xl border-none bg-paper px-4 text-ink placeholder:text-ink-soft/60 focus-visible:ring-2 focus-visible:ring-gold/60"
          />
          {errors.phone && (
            <p className="text-xs text-bloom">{errors.phone.message}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="space-y-1.5">
          <Label className="text-xs text-paper/70">Parol</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className="h-12 rounded-2xl border-none bg-paper px-4 pr-11 text-ink placeholder:text-ink-soft/60 focus-visible:ring-2 focus-visible:ring-gold/60"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-ink-soft transition-colors hover:text-ink"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-bloom">{errors.password.message}</p>
          )}
        </div>

        {/* SUBMIT */}
        <Button
          type="submit"
          disabled={isLoginLoading}
          className="mt-2 h-12 w-full rounded-2xl bg-gold text-base font-semibold text-forest-deep hover:bg-gold/90"
        >
          {isLoginLoading ? "Yuklanmoqda..." : "Kirish"}
        </Button>

        <div className="pt-1 text-center">
          <a
            // href="/forgot-password"
            className="text-sm text-paper/70 transition-colors hover:text-gold-soft"
          >
            Parolni tiklash
          </a>
        </div>
      </form>
    </div>
  );
};
