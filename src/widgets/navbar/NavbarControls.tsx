import { Check, Languages, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "uz", label: "O'zbekcha", short: "UZ" },
  { code: "uz_cr", label: "Кирилча", short: "ЎЗ" },
  { code: "ru", label: "Русский", short: "RU" },
];

/** Til tanlash: telefonda qisqa kod, kattaroq ekranda to'liq nom. */
export function LanguageMenu() {
  const { t, i18n } = useTranslation();
  const current =
    LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 gap-1.5 px-2.5"
          aria-label={t("shell.language")}
        >
          <Languages className="size-4 text-muted-foreground" aria-hidden />
          <span className="hidden md:inline">{current.label}</span>
          <span className="md:hidden">{current.short}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className={cn(
              "cursor-pointer justify-between text-sm",
              i18n.language === lang.code && "font-medium text-primary",
            )}
            onClick={() => i18n.changeLanguage(lang.code)}
          >
            {lang.label}
            {i18n.language === lang.code && (
              <Check className="size-4" aria-hidden />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Yorug'/qorong'i rejim almashtirgichi. */
export function ThemeToggle() {
  const { t } = useTranslation();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-9 text-muted-foreground hover:text-foreground"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? t("shell.lightMode") : t("shell.darkMode")}
    >
      {isDark ? (
        <Sun className="size-4.5" aria-hidden />
      ) : (
        <Moon className="size-4.5" aria-hidden />
      )}
    </Button>
  );
}
