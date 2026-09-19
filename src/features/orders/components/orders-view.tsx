"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ClipboardList, RefreshCw } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeading } from "@/components/layout/page-heading";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { OrderDetailModal } from "@/features/orders/components/order-detail-modal";
import { OrdersTable } from "@/features/orders/components/orders-table";
import { useOrders } from "@/features/orders/hooks/use-orders";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { DEFAULT_PAGE_SIZE } from "@/config/pagination";
import { ORDER_STATUS_UPDATE_ROLES, ORDER_STATUSES } from "@/config/order-status";
import type { TOrderStatus } from "@/config/order-status";
import { getApiErrorMessage } from "@/utils/api";
import { emptyToUndefined } from "@/utils/string";
import type { IOrderQueryParams } from "@/types/order";

const ALL_STATUSES = "all";

export const OrdersView = () => {
  const t = useTranslations("orders");
  const tStatus = useTranslations("orders.statuses");
  const tCommon = useTranslations("common");
  const tFilters = useTranslations("filters");

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TOrderStatus | typeof ALL_STATUSES>(
    ALL_STATUSES,
  );
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [viewTargetId, setViewTargetId] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(searchTerm);
  const { data: currentUser } = useCurrentUser();

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleStatusChange = (value: TOrderStatus | typeof ALL_STATUSES) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter(ALL_STATUSES);
    setFrom("");
    setTo("");
    setPage(1);
  };

  const params = useMemo<IOrderQueryParams>(
    () => ({
      page,
      limit: DEFAULT_PAGE_SIZE,
      search: emptyToUndefined(debouncedSearch),
      status: statusFilter === ALL_STATUSES ? undefined : statusFilter,
      from: from ? new Date(from).toISOString() : undefined,
      to: to ? new Date(to).toISOString() : undefined,
    }),
    [page, debouncedSearch, statusFilter, from, to],
  );

  const { data, isPending, isError, error, refetch, isFetching } = useOrders(params);

  // Derived from the live query cache so a status change reflects immediately
  // in the open modal, instead of the stale snapshot captured at click time
  const viewOrder = data?.items.find((order) => order.id === viewTargetId) ?? null;

  const statusOptions = [
    { value: ALL_STATUSES, label: tFilters("allStatuses") },
    ...ORDER_STATUSES.map((status) => ({ value: status, label: tStatus(status) })),
  ];

  const canUpdateStatus = Boolean(
    currentUser && (ORDER_STATUS_UPDATE_ROLES as readonly string[]).includes(currentUser.role),
  );

  return (
    <div className="space-y-4">
      <PageHeading title={t("title")} description={t("subtitle")}>
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            value={searchTerm}
            onChange={handleSearchChange}
            label={tFilters("searchLabel")}
            placeholder={t("searchPlaceholder")}
            className="w-full shrink-0 sm:w-48"
          />

          <Select
            value={statusFilter}
            onChange={(value) =>
              handleStatusChange(value as TOrderStatus | typeof ALL_STATUSES)
            }
            options={statusOptions}
            aria-label={tFilters("statusLabel")}
            className="w-full shrink-0 sm:w-40"
          />

          <Input
            type="datetime-local"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            aria-label={t("fields.from")}
            className="w-full shrink-0 sm:w-48"
          />

          <Input
            type="datetime-local"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            aria-label={t("fields.to")}
            className="w-full shrink-0 sm:w-48"
          />

          <Button variant="outline" onClick={handleClearFilters} className="shrink-0">
            {t("clearFilters")}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            aria-label={tCommon("retry")}
            className="shrink-0"
          >
            <RefreshCw
              className={isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"}
              aria-hidden
            />
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
            icon={<ClipboardList className="h-6 w-6" aria-hidden />}
          />
        </Card>
      ) : null}

      {data && data.items.length > 0 ? (
        <div className="space-y-4">
          <OrdersTable
            orders={data.items}
            onView={(order) => setViewTargetId(order.id)}
          />
          <Pagination meta={data.meta} onPageChange={setPage} />
        </div>
      ) : null}

      <OrderDetailModal
        order={viewOrder}
        canUpdateStatus={canUpdateStatus}
        onClose={() => setViewTargetId(null)}
      />
    </div>
  );
};
