import type { routing } from "@/i18n/routing";

export type TLocale = (typeof routing.locales)[number];

export type TDirection = "ltr" | "rtl";

export interface ILocaleOption {
  value: TLocale;
  direction: TDirection;
}
