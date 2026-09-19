"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsHydrated } from "@/hooks/use-is-hydrated";
import { cn } from "@/utils/cn";
import type { IDrawerProps, TDrawerSize } from "@/types/drawer";

const sizeClasses: Record<TDrawerSize, string> = {
  md: "max-w-md",
  lg: "max-w-2xl",
};

export const Drawer = ({
  isOpen,
  title,
  description,
  size = "md",
  onClose,
  children,
  footer,
}: IDrawerProps) => {
  const t = useTranslations("common");
  const isHydrated = useIsHydrated();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    const frame = requestAnimationFrame(() => setIsVisible(true));

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(frame);
      setIsVisible(false);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !isHydrated) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-overlay backdrop-blur-sm">
      <div onClick={onClose} aria-hidden className="absolute inset-0" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={cn(
          "absolute inset-y-0 end-0 flex w-full flex-col border-s border-border bg-card shadow-lg transition-transform duration-300 ease-in-out",
          isVisible ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full",
          sizeClasses[size],
        )}
      >
        <div className="flex items-start gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0 space-y-1">
            <h2 id="drawer-title" className="text-lg font-semibold tracking-tight">
              {title}
            </h2>
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label={t("close")}
            className="ms-auto shrink-0"
          >
            <X className="h-4 w-4" aria-hidden />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer ? (
          <div className="flex flex-wrap justify-end gap-2 border-t border-border px-5 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
};
