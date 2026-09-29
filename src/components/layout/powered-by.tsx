"use client";

import { useTranslations } from "next-intl";

export const PoweredBy = () => {
  const tSidebar = useTranslations("sidebar");

  return (
    <p className="text-center text-xs text-muted-foreground">
      <span className="animate-credit-blink">{tSidebar("poweredBy")}</span>{" "}
      <span className="animate-credit-blink font-semibold text-primary">MIFA Alliance</span>
    </p>
  );
};
