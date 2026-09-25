import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLoginSchema, type LoginFormValues } from "../../schema";
import { useAuth } from "../../hooks/useLogin";

export const LoginMobile = () => {
  const { t } = useTranslation();
  const { login, isLoginLoading } = useAuth();
  const loginSchema = useMemo(() => createLoginSchema(t), [t]);
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
          {t("login.title")}
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
        {/* USERNAME */}
        <div className="space-y-1.5">
          <Label className="text-xs text-paper/70">{t("username.label")}</Label>
          <Input
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            placeholder={t("username.placeholder")}
            {...register("username")}
            className="h-12 rounded-2xl border-none bg-paper px-4 text-ink placeholder:text-ink-soft/60 focus-visible:ring-2 focus-visible:ring-gold/60"
          />
          {errors.username ? (
            <p className="text-xs text-bloom">{errors.username.message}</p>
          ) : (
            <p className="text-[11px] leading-snug text-paper/50">
              {t("login.legacyHint")}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="space-y-1.5">
          <Label className="text-xs text-paper/70">{t("login.password")}</Label>
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
          {isLoginLoading ? t("login.loading") : t("login.submit")}
        </Button>

        <div className="pt-1 text-center">
          <a
            // href="/forgot-password"
            className="text-sm text-paper/70 transition-colors hover:text-gold-soft"
          >
            {t("login.resetPassword")}
          </a>
        </div>
      </form>
    </div>
  );
};
