"use client";

import { useLocale, useTranslations } from "next-intl";
import { Eye, Package, Pencil, Power, RotateCcw } from "lucide-react";
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
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";
import { formatCurrency, formatNumber } from "@/utils/format";
import type { IProductsTableProps } from "@/features/products/types/product-components";

const LOW_STOCK_THRESHOLD = 5;

export const ProductsTable = ({
  products,
  categoryLabelBySubcategoryId,
  onEdit,
  onToggleStatus,
}: IProductsTableProps) => {
  const t = useTranslations("products");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  return (
    <Table>
      <TableHead>
        <TableRow className="hover:bg-transparent">
          <TableHeaderCell>{t("fields.product")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.category")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.price")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.stock")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.status")}</TableHeaderCell>
          <TableHeaderCell className="text-end">{tCommon("actions")}</TableHeaderCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {products.map((product) => {
          const isOutOfStock = product.remainingStock <= 0;
          const isLowStock =
            !isOutOfStock && product.remainingStock <= LOW_STOCK_THRESHOLD;

          return (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary-soft-foreground">
                    <Package className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0 space-y-0.5">
                    <p className="truncate font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("fields.sku")} #{product.sku}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-muted-foreground">
                {categoryLabelBySubcategoryId.get(product.subcategoryId) ?? "—"}
              </TableCell>

              <TableCell>{formatCurrency(product.sellPrice, locale)}</TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{formatNumber(product.remainingStock, locale)}</span>
                  {isOutOfStock ? (
                    <Badge variant="danger">{t("outOfStock")}</Badge>
                  ) : null}
                  {isLowStock ? <Badge variant="warning">{t("lowStock")}</Badge> : null}
                </div>
              </TableCell>

              <TableCell>
                <Badge variant={product.status ? "success" : "muted"}>
                  {product.status ? tCommon("active") : tCommon("deactivated")}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/products/${product.id}`}
                    aria-label={t("view")}
                    title={t("view")}
                    className={cn(
                      "inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors",
                      "hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Eye className="h-4 w-4" aria-hidden />
                  </Link>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(product)}
                    aria-label={t("edit")}
                    title={t("edit")}
                  >
                    <Pencil className="h-4 w-4" aria-hidden />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleStatus(product)}
                    aria-label={product.status ? t("deactivate") : t("restore")}
                    title={product.status ? t("deactivate") : t("restore")}
                  >
                    {product.status ? (
                      <Power className="h-4 w-4 text-danger" aria-hidden />
                    ) : (
                      <RotateCcw className="h-4 w-4 text-success" aria-hidden />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
