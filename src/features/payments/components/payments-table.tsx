"use client";

import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/utils/format";
import type { IPaymentsTableProps } from "@/features/payments/types/payment-components";

export const PaymentsTable = ({ payments }: IPaymentsTableProps) => {
  const t = useTranslations("payments");
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
        </TableRow>
      </TableHead>

      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
