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
import { TenantFormDialog } from "@/features/tenants/components/tenant-form-dialog";
import { TenantsTable } from "@/features/tenants/components/tenants-table";
import { useTenants } from "@/features/tenants/hooks/use-tenants";
import { useTenantStatus } from "@/features/tenants/hooks/use-tenant-status";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/utils/api";
import { emptyToUndefined } from "@/utils/string";
import { toStatusValue } from "@/utils/status";
import { DEFAULT_PAGE_SIZE } from "@/config/pagination";
import type { TStatusFilter } from "@/types/query-params";
import type { ITenant, ITenantQueryParams } from "@/types/tenant";

export const TenantsView = () => {
  const t = useTranslations("tenants");
  const tCommon = useTranslations("common");
  const tFilters = useTranslations("filters");
  const { showToast } = useToast();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TStatusFilter>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<ITenant | null>(null);
  const [statusTarget, setStatusTarget] = useState<ITenant | null>(null);

  const debouncedSearch = useDebouncedValue(searchTerm);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleStatusChange = (value: TStatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  const params = useMemo<ITenantQueryParams>(
    () => ({
      page,
      limit: DEFAULT_PAGE_SIZE,
      search: emptyToUndefined(debouncedSearch),
      status: toStatusValue(statusFilter),
    }),
    [page, debouncedSearch, statusFilter],
  );

  const { data, isPending, isError, error, refetch } = useTenants(params);
  const { mutate: changeStatus, isPending: isChangingStatus } = useTenantStatus();

  const statusOptions = [
    { value: "all", label: tFilters("allStatuses") },
    { value: "active", label: tCommon("active") },
    { value: "inactive", label: tCommon("deactivated") },
  ];

  const openCreateDialog = () => {
    setEditingTenant(null);
    setIsFormOpen(true);
  };

  const openEditDialog = (tenant: ITenant) => {
    setEditingTenant(tenant);
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
              ? t("restored", { name: updated.name })
              : t("deactivated", { name: updated.name }),
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
          <TenantsTable
            tenants={data.items}
            onEdit={openEditDialog}
            onToggleStatus={setStatusTarget}
          />
          <Pagination meta={data.meta} onPageChange={setPage} />
        </div>
      ) : null}

      <TenantFormDialog
        isOpen={isFormOpen}
        tenant={editingTenant}
        onClose={() => setIsFormOpen(false)}
      />

      <ConfirmDialog
        isOpen={statusTarget !== null}
        title={statusTarget?.status ? t("deactivateTitle") : t("restoreTitle")}
        description={
          statusTarget?.status
            ? t("deactivateConfirm", { name: statusTarget?.name ?? "" })
            : t("restoreConfirm", { name: statusTarget?.name ?? "" })
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
