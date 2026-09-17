"use client";

import { useLocale, useTranslations } from "next-intl";
import { Pencil, Power, RotateCcw } from "lucide-react";
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
import { formatDate } from "@/utils/format";
import type { ITenantsTableProps } from "@/features/tenants/types/tenant-components";

export const TenantsTable = ({ tenants, onEdit, onToggleStatus }: ITenantsTableProps) => {
  const t = useTranslations("tenants");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  return (
    <Table>
      <TableHead>
        <TableRow className="hover:bg-transparent">
          <TableHeaderCell>{t("fields.name")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.contact")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.status")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.createdAt")}</TableHeaderCell>
          <TableHeaderCell className="text-end">{tCommon("actions")}</TableHeaderCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {tenants.map((tenant) => (
          <TableRow key={tenant.id}>
            <TableCell>
              <p className="font-medium">{tenant.name}</p>
            </TableCell>

            <TableCell className="text-muted-foreground">
              <div className="space-y-0.5">
                <p>{tenant.email ?? "—"}</p>
                <p className="text-xs">{tenant.phone ?? "—"}</p>
              </div>
            </TableCell>

            <TableCell>
              <Badge variant={tenant.status ? "success" : "muted"}>
                {tenant.status ? tCommon("active") : tCommon("deactivated")}
              </Badge>
            </TableCell>

            <TableCell className="whitespace-nowrap text-muted-foreground">
              {formatDate(tenant.createdAt, locale)}
            </TableCell>

            <TableCell>
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(tenant)}
                  aria-label={t("edit")}
                  title={t("edit")}
                >
                  <Pencil className="h-4 w-4" aria-hidden />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleStatus(tenant)}
                  aria-label={tenant.status ? t("deactivate") : t("restore")}
                  title={tenant.status ? t("deactivate") : t("restore")}
                >
                  {tenant.status ? (
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
