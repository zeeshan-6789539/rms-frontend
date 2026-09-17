"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import type { TLocale } from "@/types/locale";

export const LanguageSwitcher = () => {
  const t = useTranslations("language");
  const locale = useLocale() as TLocale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const nextLocale = routing.locales.find((item) => item !== locale) ?? locale;

  const handleSwitch = () => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSwitch}
      disabled={isPending}
      aria-label={t("label")}
      title={t("label")}
    >
      <Languages className="h-4 w-4" aria-hidden />
      <span>{t(nextLocale)}</span>
    </Button>
  );
};
