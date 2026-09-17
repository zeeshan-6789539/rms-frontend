import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import type { IAppProvidersProps } from "@/types/providers";

export const AppProviders = ({ children }: IAppProvidersProps) => (
  <ThemeProvider>
    <QueryProvider>
      <ToastProvider>{children}</ToastProvider>
    </QueryProvider>
  </ThemeProvider>
);
