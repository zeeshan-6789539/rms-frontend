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
import type { ILedgerTableProps } from "@/features/ledger/types/ledger-components";

export const LedgerTable = ({ entries, onToggleStatus }: ILedgerTableProps) => {
  const t = useTranslations("ledger");
  const tCommon = useTranslations("common");
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
          <TableHeaderCell className="text-end">{tCommon("actions")}</TableHeaderCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {entries.map((entry) => (
          <TableRow key={entry.id} className={cn(!entry.status && "line-through opacity-60")}>
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

            <TableCell>
              <div className="flex items-center justify-end gap-1 no-underline">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleStatus(entry)}
                  aria-label={entry.status ? t("deactivate") : t("restore")}
                  title={entry.status ? t("deactivate") : t("restore")}
                >
                  {entry.status ? (
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
