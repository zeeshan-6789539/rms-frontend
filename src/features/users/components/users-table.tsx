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
import { formatDateTime } from "@/utils/format";
import { getInitials } from "@/utils/string";
import type { IUsersTableProps } from "@/features/users/types/user-components";

export const UsersTable = ({
  users,
  companyNameById,
  currentUserId,
  onEdit,
  onToggleStatus,
}: IUsersTableProps) => {
  const t = useTranslations("users");
  const tCommon = useTranslations("common");
  const tRoles = useTranslations("account.roles");
  const locale = useLocale();

  return (
    <Table>
      <TableHead>
        <TableRow className="hover:bg-transparent">
          <TableHeaderCell>{t("fields.user")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.role")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.company")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.status")}</TableHeaderCell>
          <TableHeaderCell>{t("fields.lastLoginAt")}</TableHeaderCell>
          <TableHeaderCell className="text-end">{tCommon("actions")}</TableHeaderCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {users.map((user) => {
          const isCurrentUser = user.id === currentUserId;

          return (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary-soft-foreground">
                    {getInitials(user.firstName, user.lastName)}
                  </span>
                  <div className="min-w-0 space-y-0.5">
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                      {isCurrentUser ? (
                        <span className="ms-2 text-xs font-normal text-muted-foreground">
                          {t("you")}
                        </span>
                      ) : null}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.username} · {user.email}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <Badge variant={user.role === "super_admin" ? "info" : "muted"}>
                  {tRoles(user.role)}
                </Badge>
              </TableCell>

              <TableCell className="text-muted-foreground">
                {user.companyId
                  ? (companyNameById.get(user.companyId) ?? user.companyId)
                  : t("platformLevel")}
              </TableCell>

              <TableCell>
                <Badge variant={user.status ? "success" : "muted"}>
                  {user.status ? tCommon("active") : tCommon("deactivated")}
                </Badge>
              </TableCell>

              <TableCell className="whitespace-nowrap text-muted-foreground">
                {user.lastLoginAt ? formatDateTime(user.lastLoginAt, locale) : "—"}
              </TableCell>

              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(user)}
                    aria-label={t("edit")}
                    title={t("edit")}
                  >
                    <Pencil className="h-4 w-4" aria-hidden />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleStatus(user)}
                    disabled={isCurrentUser}
                    aria-label={user.status ? t("deactivate") : t("restore")}
                    title={isCurrentUser ? t("cannotEditSelf") : undefined}
                  >
                    {user.status ? (
                      <Power className="h-4 w-4 text-danger" aria-hidden />
                    ) : (
                      <RotateCcw className="h-4 w-4 text-success" aria-hidden />
                    )}
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
