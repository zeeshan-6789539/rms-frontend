"use client";

import { useLocale, useTranslations } from "next-intl";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import { ORDER_STATUS_BADGE_VARIANT, ORDER_STATUS_TRANSITIONS } from "@/config/order-status";
import type { TOrderStatus } from "@/config/order-status";
import { useUpdateOrderStatus } from "@/features/orders/hooks/use-update-order-status";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/utils/api";
import { cn } from "@/utils/cn";
import { formatCurrency, formatDateTime } from "@/utils/format";
import type { IOrdersTableProps } from "@/features/orders/types/order-components";
import type { IOrder } from "@/types/order";

export const OrdersTable = ({ orders, canUpdateStatus, onView }: IOrdersTableProps) => {
  const t = useTranslations("orders");
  const tStatus = useTranslations("orders.statuses");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { showToast } = useToast();
  const { mutate: updateStatus, isPending, variables } = useUpdateOrderStatus();

  const handleStatusChange = (order: IOrder, status: string) => {
    if (status === order.status) return;

    updateStatus(
      { id: order.id, payload: { status: status as TOrderStatus } },
      {
        onSuccess: () => showToast(t("statusUpdated")),
        onError: (mutationError) =>
          showToast(getApiErrorMessage(mutationError, tCommon("error")), "danger"),
      },
    );
  };

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
        {orders.map((order) => {
          const nextStatuses = ORDER_STATUS_TRANSITIONS[order.status];
          const statusOptions = [
            { value: order.status, label: tStatus(order.status) },
            ...nextStatuses.map((status) => ({ value: status, label: tStatus(status) })),
          ];
          const isUpdatingThisOrder = isPending && variables?.id === order.id;
          const isCancelled = order.status === "cancelled";

          return (
            <TableRow
              key={order.id}
              className={cn(isCancelled && "text-muted-foreground line-through")}
            >
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
                <div className="flex items-center justify-end gap-2">
                  {canUpdateStatus && nextStatuses.length > 0 ? (
                    <Select
                      value={order.status}
                      onChange={(status) => handleStatusChange(order, status)}
                      options={statusOptions}
                      disabled={isUpdatingThisOrder}
                      aria-label={t("fields.status")}
                      className="w-36"
                    />
                  ) : null}

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
          );
        })}
      </TableBody>
    </Table>
  );
};
