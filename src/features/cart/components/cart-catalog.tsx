"use client";

import { useLocale, useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import type { ICartCatalogProps } from "@/features/cart/types/cart-components";
import { formatCurrency } from "@/utils/format";

export const CartCatalog = ({
  products,
  cartQuantityById,
  onAdd,
}: ICartCatalogProps) => {
  const t = useTranslations("cart");
  const locale = useLocale();

  return (
    <Table>
      <TableHead>
        <TableRow className="hover:bg-transparent">
          <TableHeaderCell>{t("fields.product")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.price")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.stock")}</TableHeaderCell>
          <TableHeaderCell className="text-end">{t("add")}</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {products.map((product) => {
          const inCart = cartQuantityById.get(product.id) ?? 0;
          const isOutOfStock = product.remainingStock <= 0;
          const isMaxedOut = !isOutOfStock && inCart >= product.remainingStock;

          return (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{formatCurrency(product.sellPrice, locale)}</TableCell>
              <TableCell>
                {isOutOfStock ? (
                  <Badge variant="danger">{t("outOfStock")}</Badge>
                ) : (
                  product.remainingStock
                )}
              </TableCell>
              <TableCell className="text-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAdd(product)}
                  disabled={isOutOfStock || isMaxedOut}
                >
                  <Plus className="h-4 w-4" aria-hidden />
                  {t("add")}
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
