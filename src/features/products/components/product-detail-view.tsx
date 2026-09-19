"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, Package } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@/i18n/navigation";
import { ProductStatRow } from "@/features/products/components/product-stat-row";
import { useProduct } from "@/features/products/hooks/use-product";
import { useProductPriceHistory } from "@/features/products/hooks/use-product-price-history";
import type { IProductDetailViewProps } from "@/features/products/types/product-components";
import { getApiErrorMessage } from "@/utils/api";
import { formatCurrency, formatDateTime } from "@/utils/format";

export const ProductDetailView = ({ productId }: IProductDetailViewProps) => {
  const t = useTranslations("products");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const { data: product, isPending, isError, error } = useProduct(productId);
  const { data: priceHistory, isPending: isHistoryPending } =
    useProductPriceHistory(productId);

  if (isPending) return <Skeleton className="h-96" />;

  if (isError || !product) {
    return <Alert>{getApiErrorMessage(error, tCommon("error"))}</Alert>;
  }

  return (
    <div className="space-y-4">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
        {t("backToList")}
      </Link>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary-soft-foreground">
              <Package className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">{product.name}</h1>
              <p className="text-sm text-muted-foreground">
                {t("fields.sku")} #{product.sku}
              </p>
            </div>
          </div>
          <Badge variant={product.status ? "success" : "muted"}>
            {product.status ? tCommon("active") : tCommon("deactivated")}
          </Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ProductStatRow
            label={t("fields.sellPrice")}
            value={formatCurrency(product.sellPrice, locale)}
          />
          <ProductStatRow
            label={t("fields.purchasePrice")}
            value={formatCurrency(product.purchasePrice, locale)}
          />
          <ProductStatRow
            label={t("fields.remainingStock")}
            value={String(product.remainingStock)}
          />
          <ProductStatRow
            label={t("fields.createdAt")}
            value={formatDateTime(product.createdAt, locale)}
          />
          <ProductStatRow
            label={t("fields.updatedAt")}
            value={formatDateTime(product.updatedAt, locale)}
          />
        </div>
      </Card>

      <Card className="space-y-4 p-0">
        <div className="px-5 pt-5">
          <h2 className="font-semibold tracking-tight">{t("priceHistory")}</h2>
        </div>

        {isHistoryPending ? (
          <div className="p-5">
            <Skeleton className="h-40" />
          </div>
        ) : (
          <Table className="border-0 shadow-none">
            <TableHead>
              <TableRow className="hover:bg-transparent">
                <TableHeaderCell>{t("fields.sellPrice")}</TableHeaderCell>
                <TableHeaderCell>{t("fields.purchasePrice")}</TableHeaderCell>
                <TableHeaderCell>{t("fields.effectiveFrom")}</TableHeaderCell>
                <TableHeaderCell>{t("fields.effectiveTo")}</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(priceHistory ?? []).map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{formatCurrency(entry.sellPrice, locale)}</TableCell>
                  <TableCell>{formatCurrency(entry.purchasePrice, locale)}</TableCell>
                  <TableCell>{formatDateTime(entry.effectiveFrom, locale)}</TableCell>
                  <TableCell>
                    {entry.effectiveTo ? (
                      formatDateTime(entry.effectiveTo, locale)
                    ) : (
                      <Badge variant="success">{t("current")}</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};
