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
import type { ILedgerTableProps } from "@/features/ledger/types/ledger-components";

export const LedgerTable = ({ entries }: ILedgerTableProps) => {
  const t = useTranslations("ledger");
  const tEntryType = useTranslations("ledger.entryTypes");
  const locale = useLocale();

  return (
    <Table>
      <TableHead>
        <TableRow className="hover:bg-transparent">
          <TableHeaderCell>{t("fields.property")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.tenant")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.entryType")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.description")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.amount")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.runningBalance")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.date")}</TableHeaderCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {entries.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell>
              <p className="font-medium">{entry.propertyName}</p>
            </TableCell>

            <TableCell className="text-muted-foreground">{entry.tenantName}</TableCell>

            <TableCell>
              <Badge variant={entry.transactionType === "credit" ? "success" : "warning"}>
                {tEntryType(entry.entryType)}
              </Badge>
            </TableCell>

            <TableCell className="max-w-xs truncate text-muted-foreground">
              {entry.description ?? "—"}
            </TableCell>

            <TableCell
              className={entry.transactionType === "credit" ? "text-success" : "text-danger"}
            >
              {entry.transactionType === "credit" ? "−" : "+"}
              {formatCurrency(Number(entry.amount), locale)}
            </TableCell>

            <TableCell className="font-medium">
              {entry.runningBalance !== null
                ? formatCurrency(Number(entry.runningBalance), locale)
                : "—"}
            </TableCell>

            <TableCell className="whitespace-nowrap text-muted-foreground">
              {formatDate(entry.dueDate ?? entry.createdAt, locale)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
