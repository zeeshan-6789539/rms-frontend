"use client";

import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";

export const PoweredBy = () => {
  const tSidebar = useTranslations("sidebar");

  return (
    <div className="text-center text-xs text-muted-foreground">
      <p>
        <span className="animate-credit-blink">{tSidebar("poweredBy")}</span>{" "}
        <span className="animate-credit-blink font-semibold text-primary">{siteConfig.poweredByName}</span>
      </p>
      <a href="tel:+923296789539" className="mt-0.5 inline-block hover:text-primary">
        0329 6789539
      </a>
    </div>
  );
};
