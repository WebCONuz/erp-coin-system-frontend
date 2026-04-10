import type { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { I18nProvider } from "./i18n-provider";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "@/components/shared/toaster";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <QueryProvider>
      <ThemeProvider>
        <I18nProvider>
          {children}
          <Toaster />
        </I18nProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};
