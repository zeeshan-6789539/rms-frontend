"use client";

import { useLocale, useTranslations } from "next-intl";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ICartLinesProps } from "@/features/cart/types/cart-components";
import { formatCurrency } from "@/utils/format";

export const CartLines = ({ items, onQuantityChange, onRemove }: ICartLinesProps) => {
  const t = useTranslations("cart");
  const locale = useLocale();

  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">{t("empty")}</p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {items.map((item) => (
        <li key={item.product.id} className="flex items-center gap-3 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{item.product.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(item.product.sellPrice, locale)}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onQuantityChange(item.product.id, item.quantity - 1)}
              aria-label={t("decreaseQuantity")}
            >
              <Minus className="h-3.5 w-3.5" aria-hidden />
            </Button>

            <Input
              type="number"
              min={1}
              max={item.product.remainingStock}
              value={item.quantity}
              onChange={(event) =>
                onQuantityChange(item.product.id, Number(event.target.value))
              }
              className="h-9 w-14 text-center"
            />

            <Button
              variant="outline"
              size="icon"
              onClick={() => onQuantityChange(item.product.id, item.quantity + 1)}
              disabled={item.quantity >= item.product.remainingStock}
              aria-label={t("increaseQuantity")}
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
            </Button>
          </div>

          <p className="w-20 shrink-0 text-end text-sm font-medium">
            {formatCurrency(item.product.sellPrice * item.quantity, locale)}
          </p>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.product.id)}
            aria-label={t("remove")}
          >
            <Trash2 className="h-4 w-4 text-danger" aria-hidden />
          </Button>
        </li>
      ))}
    </ul>
  );
};
