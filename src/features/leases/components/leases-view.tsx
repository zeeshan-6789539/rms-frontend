"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { FileText, Plus } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeading } from "@/components/layout/page-heading";
import { LeaseFormDialog } from "@/features/leases/components/lease-form-dialog";
import { LeaseStatusDialog } from "@/features/leases/components/lease-status-dialog";
import { LeasesTable } from "@/features/leases/components/leases-table";
import { UpdateLeaseRentDialog } from "@/features/leases/components/update-lease-rent-dialog";
import { useLeases } from "@/features/leases/hooks/use-leases";
import { GenerateMonthlyRentButton } from "@/features/ledger/components/generate-monthly-rent-button";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { getApiErrorMessage } from "@/utils/api";
import { emptyToUndefined } from "@/utils/string";
import { DEFAULT_PAGE_SIZE } from "@/config/pagination";
import type { ILease, ILeaseQueryParams, TLeaseStatus } from "@/types/lease";

type TLeaseStatusFilter = "all" | TLeaseStatus;

export const LeasesView = () => {
  const t = useTranslations("leases");
  const tStatus = useTranslations("leases.status");
  const tCommon = useTranslations("common");
  const tFilters = useTranslations("filters");

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TLeaseStatusFilter>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLease, setEditingLease] = useState<ILease | null>(null);
  const [statusTarget, setStatusTarget] = useState<ILease | null>(null);
  const [rentTarget, setRentTarget] = useState<ILease | null>(null);

  const debouncedSearch = useDebouncedValue(searchTerm);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleStatusChange = (value: TLeaseStatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  const params = useMemo<ILeaseQueryParams>(
    () => ({
      page,
      limit: DEFAULT_PAGE_SIZE,
      search: emptyToUndefined(debouncedSearch),
      status: statusFilter === "all" ? undefined : statusFilter,
    }),
    [page, debouncedSearch, statusFilter],
  );

  const { data, isPending, isError, error, refetch } = useLeases(params);

  const statusOptions = [
    { value: "all", label: tFilters("allStatuses") },
    { value: "active", label: tStatus("active") },
    { value: "terminated", label: tStatus("terminated") },
    { value: "expired", label: tStatus("expired") },
  ];

  const openCreateDialog = () => {
    setEditingLease(null);
    setIsFormOpen(true);
  };

  const openEditDialog = (lease: ILease) => {
    setEditingLease(lease);
    setIsFormOpen(true);
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
            onChange={(event) => handleStatusChange(event.target.value as TLeaseStatusFilter)}
            options={statusOptions}
            aria-label={tFilters("statusLabel")}
            className="w-full shrink-0 sm:w-36"
          />

          <div className="flex shrink-0 gap-2">
            <GenerateMonthlyRentButton />
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4" aria-hidden />
              {t("create")}
            </Button>
          </div>
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
            icon={<FileText className="h-6 w-6" aria-hidden />}
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
          <LeasesTable
            leases={data.items}
            onEdit={openEditDialog}
            onChangeStatus={setStatusTarget}
            onChangeRent={setRentTarget}
          />
          <Pagination meta={data.meta} onPageChange={setPage} />
        </div>
      ) : null}

      <LeaseFormDialog
        isOpen={isFormOpen}
        lease={editingLease}
        onClose={() => setIsFormOpen(false)}
      />

      <LeaseStatusDialog
        isOpen={statusTarget !== null}
        lease={statusTarget}
        onClose={() => setStatusTarget(null)}
      />

      <UpdateLeaseRentDialog
        isOpen={rentTarget !== null}
        lease={rentTarget}
        onClose={() => setRentTarget(null)}
      />
    </div>
  );
};
