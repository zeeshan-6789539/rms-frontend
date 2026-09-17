import type { TDirection, TLocale } from "@/types/locale";

const RTL_LOCALES: readonly TLocale[] = ["ur"];

export const getDirection = (locale: TLocale): TDirection =>
  RTL_LOCALES.includes(locale) ? "rtl" : "ltr";

export const isRtl = (locale: TLocale): boolean => getDirection(locale) === "rtl";
