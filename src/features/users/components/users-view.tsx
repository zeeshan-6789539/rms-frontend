"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Users } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeading } from "@/components/layout/page-heading";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useCompanyOptions } from "@/features/companies/hooks/use-company-options";
import { UserFormDialog } from "@/features/users/components/user-form-dialog";
import { UsersTable } from "@/features/users/components/users-table";
import { useUsers } from "@/features/users/hooks/use-users";
import { useUserStatus } from "@/features/users/hooks/use-user-status";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_PAGE_SIZE } from "@/config/pagination";
import { USER_ROLES } from "@/config/roles";
import { getApiErrorMessage } from "@/utils/api";
import { emptyToUndefined } from "@/utils/string";
import { toStatusValue } from "@/utils/status";
import type { TStatusFilter } from "@/types/query-params";
import type { IUser, IUserQueryParams, TUserRole } from "@/types/user";

const ALL_ROLES = "all";

export const UsersView = () => {
  const t = useTranslations("users");
  const tCommon = useTranslations("common");
  const tFilters = useTranslations("filters");
  const tRoles = useTranslations("account.roles");
  const { showToast } = useToast();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TStatusFilter>("all");
  const [roleFilter, setRoleFilter] = useState<TUserRole | typeof ALL_ROLES>(ALL_ROLES);
  const [companyFilter, setCompanyFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [statusTarget, setStatusTarget] = useState<IUser | null>(null);

  const debouncedSearch = useDebouncedValue(searchTerm);

  // A narrower result set can have fewer pages than the one currently shown
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleStatusChange = (value: TStatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleRoleChange = (value: TUserRole | typeof ALL_ROLES) => {
    setRoleFilter(value);
    setPage(1);
  };

  const handleCompanyChange = (value: string) => {
    setCompanyFilter(value);
    setPage(1);
  };

  const params = useMemo<IUserQueryParams>(
    () => ({
      page,
      limit: DEFAULT_PAGE_SIZE,
      search: emptyToUndefined(debouncedSearch),
      status: toStatusValue(statusFilter),
      role: roleFilter === ALL_ROLES ? undefined : roleFilter,
      companyId: emptyToUndefined(companyFilter),
    }),
    [page, debouncedSearch, statusFilter, roleFilter, companyFilter],
  );

  const { data, isPending, isError, error, refetch } = useUsers(params);
  const { options: companyOptions, nameById } = useCompanyOptions();
  const { data: currentUser } = useCurrentUser();
  const { mutate: changeStatus, isPending: isChangingStatus } = useUserStatus();

  const statusOptions = [
    { value: "all", label: tFilters("allStatuses") },
    { value: "active", label: tCommon("active") },
    { value: "inactive", label: tCommon("deactivated") },
  ];

  const roleOptions = [
    { value: ALL_ROLES, label: tFilters("allRoles") },
    ...USER_ROLES.map((role) => ({ value: role, label: tRoles(role) })),
  ];

  const companyFilterOptions = [
    { value: "", label: tFilters("allCompanies") },
    ...companyOptions,
  ];

  const openCreateDialog = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const openEditDialog = (user: IUser) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleConfirmStatus = () => {
    if (!statusTarget) return;

    changeStatus(
      { id: statusTarget.id, nextStatus: !statusTarget.status },
      {
        onSuccess: (updated) => {
          showToast(
            updated.status
              ? t("restored", { name: updated.username })
              : t("deactivated", { name: updated.username }),
          );
          setStatusTarget(null);
        },
        onError: (mutationError) =>
          showToast(getApiErrorMessage(mutationError, tCommon("error")), "danger"),
      },
    );
  };

  return (
    <div className="space-y-4">
      <PageHeading title={t("title")}>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          <SearchInput
            value={searchTerm}
            onChange={handleSearchChange}
            label={tFilters("searchLabel")}
            placeholder={t("searchPlaceholder")}
            className="w-full shrink-0 sm:w-56"
          />

          <Select
            value={roleFilter}
            onChange={(event) =>
              handleRoleChange(event.target.value as TUserRole | typeof ALL_ROLES)
            }
            options={roleOptions}
            aria-label={tFilters("roleLabel")}
            className="w-full shrink-0 sm:w-36"
          />

          <Select
            value={companyFilter}
            onChange={(event) => handleCompanyChange(event.target.value)}
            options={companyFilterOptions}
            aria-label={tFilters("companyLabel")}
            className="w-full shrink-0 sm:w-44"
          />

          <Select
            value={statusFilter}
            onChange={(event) => handleStatusChange(event.target.value as TStatusFilter)}
            options={statusOptions}
            aria-label={tFilters("statusLabel")}
            className="w-full shrink-0 sm:w-36"
          />

          <Button className="shrink-0" onClick={openCreateDialog}>
            <Plus className="h-4 w-4" aria-hidden />
            {t("create")}
          </Button>
        </div>
      </PageHeading>

      {isPending ? <Skeleton className="h-72" /> : null}

      {isError ? (
        <Alert>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>{getApiErrorMessage(error, tCommon("error"))}</span>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              {tCommon("retry")}
            </Button>
          </div>
        </Alert>
      ) : null}

      {data && data.items.length === 0 ? (
        <Card className="p-0">
          <EmptyState
            title={t("emptyTitle")}
            description={t("emptySubtitle")}
            icon={<Users className="h-6 w-6" aria-hidden />}
            action={
              <Button size="sm" onClick={openCreateDialog}>
                <Plus className="h-4 w-4" aria-hidden />
                {t("create")}
              </Button>
            }
          />
        </Card>
      ) : null}

      {data && data.items.length > 0 ? (
        <div className="space-y-4">
          <UsersTable
            users={data.items}
            companyNameById={nameById}
            currentUserId={currentUser?.id}
            onEdit={openEditDialog}
            onToggleStatus={setStatusTarget}
          />
          <Pagination meta={data.meta} onPageChange={setPage} />
        </div>
      ) : null}

      <UserFormDialog
        isOpen={isFormOpen}
        user={editingUser}
        onClose={() => setIsFormOpen(false)}
      />

      <ConfirmDialog
        isOpen={statusTarget !== null}
        title={statusTarget?.status ? t("deactivateTitle") : t("restoreTitle")}
        description={
          statusTarget?.status
            ? t("deactivateConfirm", { name: statusTarget?.username ?? "" })
            : t("restoreConfirm", { name: statusTarget?.username ?? "" })
        }
        confirmLabel={statusTarget?.status ? t("deactivate") : t("restore")}
        isDestructive={statusTarget?.status ?? false}
        isPending={isChangingStatus}
        onConfirm={handleConfirmStatus}
        onClose={() => setStatusTarget(null)}
      />
    </div>
  );
};
