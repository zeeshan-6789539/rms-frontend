"use client";

import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IPaginationProps } from "@/types/pagination";

export const Pagination = ({ meta, onPageChange }: IPaginationProps) => {
  const t = useTranslations("pagination");

  const firstItem = meta.totalItems === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const lastItem = Math.min(meta.page * meta.limit, meta.totalItems);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        {t("summary", {
          from: firstItem,
          to: lastItem,
          total: meta.totalItems,
        })}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(meta.page - 1)}
          disabled={!meta.hasPreviousPage}
          aria-label={t("previous")}
        >
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
          {t("previous")}
        </Button>

        <span className="text-sm text-muted-foreground">
          {t("pageOf", { page: meta.page, totalPages: Math.max(meta.totalPages, 1) })}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(meta.page + 1)}
          disabled={!meta.hasNextPage}
          aria-label={t("next")}
        >
          {t("next")}
          <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
        </Button>
      </div>
    </div>
  );
};
