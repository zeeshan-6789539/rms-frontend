"use client";

import { useLocale, useTranslations } from "next-intl";
import { Power, RotateCcw } from "lucide-react";
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
import { cn } from "@/utils/cn";
import { formatCurrency, formatDate } from "@/utils/format";
import type { IPaymentsTableProps } from "@/features/payments/types/payment-components";

export const PaymentsTable = ({ payments, onToggleStatus }: IPaymentsTableProps) => {
  const t = useTranslations("payments");
  const tCommon = useTranslations("common");
  const tMethod = useTranslations("payments.methods");
  const locale = useLocale();

  return (
    <Table>
      <TableHead>
        <TableRow className="hover:bg-transparent">
          <TableHeaderCell>{t("fields.property")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.tenant")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.amountPaid")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.paymentDate")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.paymentMethod")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.referenceNumber")}</TableHeaderCell>
          <TableHeaderCell className="text-end">{tCommon("actions")}</TableHeaderCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id} className={cn(!payment.status && "line-through opacity-60")}>
            <TableCell>
              <p className="font-medium">{payment.propertyName}</p>
            </TableCell>

            <TableCell className="text-muted-foreground">{payment.tenantName}</TableCell>

            <TableCell className="font-medium text-success">
              {formatCurrency(Number(payment.amountPaid), locale)}
            </TableCell>

            <TableCell className="whitespace-nowrap text-muted-foreground">
              {formatDate(payment.paymentDate, locale)}
            </TableCell>

            <TableCell>
              <Badge variant="info">{tMethod(payment.paymentMethod)}</Badge>
            </TableCell>

            <TableCell className="text-muted-foreground">
              {payment.referenceNumber ?? payment.receiptNumber ?? "—"}
            </TableCell>

            <TableCell>
              <div className="flex items-center justify-end gap-1 no-underline">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleStatus(payment)}
                  aria-label={payment.status ? t("deactivate") : t("restore")}
                  title={payment.status ? t("deactivate") : t("restore")}
                >
                  {payment.status ? (
                    <Power className="h-4 w-4 text-danger" aria-hidden />
                  ) : (
                    <RotateCcw className="h-4 w-4 text-success" aria-hidden />
                  )}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
