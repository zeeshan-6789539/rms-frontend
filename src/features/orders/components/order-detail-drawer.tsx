"use client";

import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Drawer } from "@/components/ui/drawer";
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
import { SendBillForm } from "@/features/orders/components/send-bill-form";
import { useUpdateOrderStatus } from "@/features/orders/hooks/use-update-order-status";
import type { IOrderDetailDrawerProps } from "@/features/orders/types/order-components";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/utils/api";
import { formatCurrency, formatDateTime } from "@/utils/format";
import type { TOrderStatus } from "@/config/order-status";

export const OrderDetailDrawer = ({
  order,
  canUpdateStatus,
  onClose,
}: IOrderDetailDrawerProps) => {
  const t = useTranslations("orders");
  const tStatus = useTranslations("orders.statuses");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { showToast } = useToast();
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const nextStatuses = order ? ORDER_STATUS_TRANSITIONS[order.status] : [];
  const statusOptions = order
    ? [
        { value: order.status, label: tStatus(order.status) },
        ...nextStatuses.map((status) => ({ value: status, label: tStatus(status) })),
      ]
    : [];

  const handleStatusChange = (status: string) => {
    if (!order || status === order.status) return;

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
    <Drawer
      isOpen={order !== null}
      title={order ? t("orderRef", { ref: order.id.slice(-8).toUpperCase() }) : ""}
      description={order ? formatDateTime(order.createdAt, locale) : undefined}
      size="lg"
      onClose={onClose}
    >
      {order ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge variant={ORDER_STATUS_BADGE_VARIANT[order.status]}>
              {tStatus(order.status)}
            </Badge>

            {canUpdateStatus && nextStatuses.length > 0 ? (
              <Select
                value={order.status}
                onChange={handleStatusChange}
                options={statusOptions}
                disabled={isPending}
                aria-label={t("fields.status")}
                className="w-48"
              />
            ) : null}
          </div>

          <SendBillForm key={order.id} order={order} />

          <Table className="border-0 shadow-none" tableClassName="min-w-0">
            <TableHead>
              <TableRow className="hover:bg-transparent">
                <TableHeaderCell>{t("fields.product")}</TableHeaderCell>
                <TableHeaderCell>{t("fields.quantity")}</TableHeaderCell>
                <TableHeaderCell>{t("fields.unitPrice")}</TableHeaderCell>
                <TableHeaderCell className="text-end">
                  {t("fields.lineTotal")}
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.productName ?? t("removedProduct")}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{formatCurrency(item.price, locale)}</TableCell>
                  <TableCell className="text-end">
                    {formatCurrency(item.price * item.quantity, locale)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
            <span className="text-sm text-muted-foreground">{t("fields.total")}</span>
            <span className="text-lg font-semibold">
              {formatCurrency(order.total, locale)}
            </span>
          </div>
        </div>
      ) : null}
    </Drawer>
  );
};
