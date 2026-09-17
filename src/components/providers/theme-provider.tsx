"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { IThemeProviderProps } from "@/types/providers";

export const ThemeProvider = ({ children }: IThemeProviderProps) => (
  <NextThemesProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    {children}
  </NextThemesProvider>
);
