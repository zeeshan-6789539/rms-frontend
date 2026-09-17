"use client";

import { useLocale, useTranslations } from "next-intl";
import { Banknote, Pencil, RefreshCw } from "lucide-react";
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
import { formatCurrency, formatDate } from "@/utils/format";
import type { TBadgeVariant } from "@/types/ui";
import type { TLeaseStatus } from "@/types/lease";
import type { ILeasesTableProps } from "@/features/leases/types/lease-components";

const STATUS_VARIANT: Record<TLeaseStatus, TBadgeVariant> = {
  active: "success",
  terminated: "danger",
  expired: "muted",
};

export const LeasesTable = ({
  leases,
  onEdit,
  onChangeStatus,
  onChangeRent,
}: ILeasesTableProps) => {
  const t = useTranslations("leases");
  const tStatus = useTranslations("leases.status");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  return (
    <Table>
      <TableHead>
        <TableRow className="hover:bg-transparent">
          <TableHeaderCell>{t("fields.property")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.tenant")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.status")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.term")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.currentRent")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.outstandingBalance")}</TableHeaderCell>
          <TableHeaderCell className="text-end">{tCommon("actions")}</TableHeaderCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {leases.map((lease) => (
          <TableRow key={lease.id}>
            <TableCell>
              <p className="font-medium">{lease.propertyName}</p>
            </TableCell>

            <TableCell className="text-muted-foreground">{lease.tenantName}</TableCell>

            <TableCell>
              <Badge variant={STATUS_VARIANT[lease.status]}>{tStatus(lease.status)}</Badge>
            </TableCell>

            <TableCell className="whitespace-nowrap text-muted-foreground">
              {formatDate(lease.startDate, locale)} – {formatDate(lease.endDate, locale)}
            </TableCell>

            <TableCell className="text-muted-foreground">
              {lease.currentRent ? formatCurrency(Number(lease.currentRent), locale) : "—"}
            </TableCell>

            <TableCell
              className={
                Number(lease.outstandingBalance) > 0 ? "font-medium text-danger" : "text-muted-foreground"
              }
            >
              {formatCurrency(Number(lease.outstandingBalance), locale)}
            </TableCell>

            <TableCell>
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(lease)}
                  aria-label={t("edit")}
                  title={t("edit")}
                >
                  <Pencil className="h-4 w-4" aria-hidden />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onChangeRent(lease)}
                  aria-label={t("changeRent")}
                  title={t("changeRent")}
                >
                  <Banknote className="h-4 w-4" aria-hidden />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onChangeStatus(lease)}
                  aria-label={t("changeStatus")}
                  title={t("changeStatus")}
                >
                  <RefreshCw className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
