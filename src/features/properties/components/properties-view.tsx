"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Building2, Plus } from "lucide-react";
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
import { PropertiesTable } from "@/features/properties/components/properties-table";
import { PropertyFormDialog } from "@/features/properties/components/property-form-dialog";
import { useProperties } from "@/features/properties/hooks/use-properties";
import { usePropertyStatus } from "@/features/properties/hooks/use-property-status";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/utils/api";
import { emptyToUndefined } from "@/utils/string";
import { toStatusValue } from "@/utils/status";
import { DEFAULT_PAGE_SIZE } from "@/config/pagination";
import type { IProperty, IPropertyQueryParams } from "@/types/property";
import type { TStatusFilter } from "@/types/query-params";

export const PropertiesView = () => {
  const t = useTranslations("properties");
  const tCommon = useTranslations("common");
  const tFilters = useTranslations("filters");
  const { showToast } = useToast();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TStatusFilter>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<IProperty | null>(null);
  const [statusTarget, setStatusTarget] = useState<IProperty | null>(null);

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

  const params = useMemo<IPropertyQueryParams>(
    () => ({
      page,
      limit: DEFAULT_PAGE_SIZE,
      search: emptyToUndefined(debouncedSearch),
      status: toStatusValue(statusFilter),
    }),
    [page, debouncedSearch, statusFilter],
  );

  const { data, isPending, isError, error, refetch } = useProperties(params);
  const { mutate: changeStatus, isPending: isChangingStatus } = usePropertyStatus();

  const statusOptions = [
    { value: "all", label: tFilters("allStatuses") },
    { value: "active", label: tCommon("active") },
    { value: "inactive", label: tCommon("deactivated") },
  ];

  const openCreateDialog = () => {
    setEditingProperty(null);
    setIsFormOpen(true);
  };

  const openEditDialog = (property: IProperty) => {
    setEditingProperty(property);
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
    <div className="space-y-6">
      <PageHeading title={t("title")} description={t("subtitle")}>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4" aria-hidden />
          {t("create")}
        </Button>
      </PageHeading>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={searchTerm}
          onChange={handleSearchChange}
          label={tFilters("searchLabel")}
          placeholder={t("searchPlaceholder")}
          className="w-full sm:max-w-xs"
        />

        <Select
          value={statusFilter}
          onChange={(event) => handleStatusChange(event.target.value as TStatusFilter)}
          options={statusOptions}
          aria-label={tFilters("statusLabel")}
          className="w-full sm:w-44"
        />
      </div>

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
            icon={<Building2 className="h-6 w-6" aria-hidden />}
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
          <PropertiesTable
            properties={data.items}
            onEdit={openEditDialog}
            onToggleStatus={setStatusTarget}
          />
          <Pagination meta={data.meta} onPageChange={setPage} />
        </div>
      ) : null}

      <PropertyFormDialog
        isOpen={isFormOpen}
        property={editingProperty}
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
