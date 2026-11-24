import { APP_LOGO, APP_NAME } from "@/assets/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  CalendarCheck,
  Coins,
  Eye,
  EyeOff,
  Gift,
  Loader2,
  LockKeyhole,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LanguageMenu, ThemeToggle } from "@/widgets/navbar/NavbarControls";
import { createLoginSchema, type LoginFormValues } from "../../schema";
import { useAuth } from "../../hooks/useLogin";

const POINTS = [
  { key: "attendance", icon: CalendarCheck },
  { key: "coins", icon: Coins },
  { key: "market", icon: Gift },
] as const;

export const LoginDesktop = () => {
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
    // `h-dvh overflow-hidden` — sahifa doim bitta ekranga sig'adi, tashqi scroll yo'q.
    <div className="hidden h-dvh w-full overflow-hidden bg-background lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      {/* Brend paneli — har ikki rejimda ham "tun" yuzasi */}
      <aside className="relative m-3 flex min-h-0 flex-col overflow-hidden rounded-[28px] bg-sidebar p-10 text-white xl:px-14 xl:py-12">
        {/* Nozik nuqtali to'r + yorug'lik dog'i */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1.2px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-24 size-105 rounded-full bg-sidebar-primary/25 blur-3xl"
        />

        <div className="relative flex items-center gap-3">
          <img
            src={APP_LOGO}
            alt=""
            className="size-10 rounded-xl bg-white/10 p-1"
          />
          <span className="font-heading text-xl font-semibold tracking-tight">
            {APP_NAME}
          </span>
        </div>

        <div className="relative mt-[clamp(1.5rem,6vh,4.5rem)] max-w-xl shrink-0">
          <h1 className="text-4xl leading-[1.1] font-semibold tracking-tight text-balance xl:text-5xl">
            {t("login.hero.title")}
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70 xl:text-lg">
            {t("login.hero.description")}
          </p>

          <ul className="mt-[clamp(1.25rem,4vh,2.25rem)] space-y-3">
            {POINTS.map(({ key, icon: Icon }) => (
              <li key={key} className="flex items-center gap-3.5">
                <span
                  className={
                    key === "coins"
                      ? "flex size-9 shrink-0 items-center justify-center rounded-xl bg-coin/15 text-coin"
                      : "flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sidebar-primary"
                  }
                >
                  <Icon className="size-4.5" aria-hidden />
                </span>
                <span className="text-[15px] text-white/85">
                  {t(`login.hero.points.${key}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Rasm qolgan bo'sh joyni egallaydi va ekran pastligida kichrayadi. */}
        <div className="relative flex min-h-0 flex-1 items-end pt-6">
          <img
            src="/pc_auth.png"
            alt=""
            draggable={false}
            className="max-h-full w-full max-w-140 object-contain object-bottom-left select-none"
          />
        </div>
        <div className="relative shrink-0">
          <p className="mt-5 text-sm text-white/45">
            © {new Date().getFullYear()} {APP_NAME}
          </p>
        </div>
      </aside>

      {/* Forma paneli */}
      {/* Juda past ekranlarda (masalan, zoom) scroll faqat shu panel ichida. */}
      <main className="relative flex min-h-0 flex-col overflow-y-auto px-8 py-6 xl:px-16">
        <div className="flex shrink-0 items-center justify-end gap-1">
          <LanguageMenu />
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center py-6">
          <div className="w-full max-w-105">
            <div className="mb-9">
              <h2 className="text-3xl font-semibold tracking-tight">
                {t("login.title")}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {t("login.subtitle")}
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              {/* USERNAME */}
              <div className="space-y-2">
                <Label htmlFor="login-username" className="text-sm font-medium">
                  {t("username.label")}
                </Label>
                <div className="relative">
                  <UserRound
                    className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    id="login-username"
                    type="text"
                    autoComplete="username"
                    autoCapitalize="none"
                    autoFocus
                    placeholder={t("username.placeholder")}
                    aria-invalid={!!errors.username}
                    aria-describedby="login-username-hint"
                    {...register("username")}
                    className="h-12 rounded-xl bg-card pl-11 text-[15px]"
                  />
                </div>
                {errors.username ? (
                  <p
                    id="login-username-hint"
                    role="alert"
                    className="text-xs text-destructive"
                  >
                    {errors.username.message}
                  </p>
                ) : (
                  <p
                    id="login-username-hint"
                    className="text-xs leading-relaxed text-muted-foreground"
                  >
                    {t("login.legacyHint")}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="login-password"
                    className="text-sm font-medium"
                  >
                    {t("login.password")}
                  </Label>
                  <a
                    href="/forgot-password"
                    className="rounded-sm text-sm font-medium text-primary hover:underline"
                  >
                    {t("login.forgotPassword")}
                  </a>
                </div>
                <div className="relative">
                  <LockKeyhole
                    className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "login-password-error" : undefined
                    }
                    {...register("password")}
                    className="h-12 rounded-xl bg-card pr-12 pl-11 text-[15px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={
                      showPassword
                        ? t("login.hidePassword")
                        : t("login.showPassword")
                    }
                    aria-pressed={showPassword}
                    className="absolute top-1/2 right-1.5 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4.5" aria-hidden />
                    ) : (
                      <Eye className="size-4.5" aria-hidden />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p
                    id="login-password-error"
                    role="alert"
                    className="text-xs text-destructive"
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* SUBMIT */}
              <Button
                type="submit"
                className="group mt-3 h-12 w-full rounded-xl text-[15px] font-semibold"
                disabled={isLoginLoading}
              >
                {isLoginLoading ? (
                  <>
                    <Loader2 className="size-4.5 animate-spin" aria-hidden />
                    {t("login.loading")}
                  </>
                ) : (
                  <>
                    {t("login.submit")}
                    <ArrowRight
                      className="size-4.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
