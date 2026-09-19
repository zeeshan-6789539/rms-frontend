"use client";

import { useLocale, useTranslations } from "next-intl";
import { Eye } from "lucide-react";
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
import { ORDER_STATUS_BADGE_VARIANT } from "@/config/order-status";
import { formatCurrency, formatDateTime } from "@/utils/format";
import type { IOrdersTableProps } from "@/features/orders/types/order-components";

export const OrdersTable = ({ orders, onView }: IOrdersTableProps) => {
  const t = useTranslations("orders");
  const tStatus = useTranslations("orders.statuses");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  return (
    <Table>
      <TableHead>
        <TableRow className="hover:bg-transparent">
          <TableHeaderCell>{t("fields.order")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.placedAt")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.items")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.total")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.status")}</TableHeaderCell>
          <TableHeaderCell className="text-end">{tCommon("actions")}</TableHeaderCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">
              #{order.id.slice(-8).toUpperCase()}
            </TableCell>
            <TableCell className="whitespace-nowrap text-muted-foreground">
              {formatDateTime(order.createdAt, locale)}
            </TableCell>
            <TableCell>
              {order.items.reduce((sum, item) => sum + item.quantity, 0)}
            </TableCell>
            <TableCell>{formatCurrency(order.total, locale)}</TableCell>
            <TableCell>
              <Badge variant={ORDER_STATUS_BADGE_VARIANT[order.status]}>
                {tStatus(order.status)}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView(order)}
                  aria-label={t("view")}
                  title={t("view")}
                >
                  <Eye className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
