"use client";

import { useLocale, useTranslations } from "next-intl";
import { Check, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ICartCatalogProps } from "@/features/cart/types/cart-components";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/format";

export const CartCatalog = ({
  products,
  cartQuantityById,
  categoryLabelBySubcategoryId,
  onAdd,
}: ICartCatalogProps) => {
  const t = useTranslations("cart");
  const locale = useLocale();

  return (
    <div className="grid max-h-[70vh] auto-rows-fr grid-cols-2 gap-3 overflow-y-auto p-1 sm:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => {
        const inCart = cartQuantityById.get(product.id) ?? 0;
        const isOutOfStock = product.remainingStock <= 0;
        const isMaxedOut = !isOutOfStock && inCart >= product.remainingStock;

        return (
          <div
            key={product.id}
            className={cn(
              "flex flex-col justify-between gap-3 rounded-card border border-border bg-card p-4 shadow-sm transition-colors",
              isOutOfStock && "border-danger/30 bg-danger-soft/40",
            )}
          >
            <div className="space-y-1">
              <p className="truncate font-medium text-foreground" title={product.name}>
                {product.name}
              </p>
              <p
                className="truncate text-xs text-muted-foreground"
                title={categoryLabelBySubcategoryId.get(product.subcategoryId) ?? undefined}
              >
                {categoryLabelBySubcategoryId.get(product.subcategoryId) ?? "—"}
              </p>
              <p className="text-lg font-semibold text-foreground">
                {formatCurrency(product.sellPrice, locale)}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2">
              {isOutOfStock ? (
                <Badge variant="danger">{t("outOfStock")}</Badge>
              ) : (
                <span className="text-xs text-muted-foreground">
                  {t("fields.stock")}: {product.remainingStock}
                </span>
              )}

              <Button
                variant={isMaxedOut ? "soft" : "outline"}
                size="sm"
                onClick={() => onAdd(product)}
                disabled={isOutOfStock || isMaxedOut}
              >
                {isMaxedOut ? (
                  <Check className="h-4 w-4" aria-hidden />
                ) : (
                  <Plus className="h-4 w-4" aria-hidden />
                )}
                {isMaxedOut ? t("added") : t("add")}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
