"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { BookText, Plus } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeading } from "@/components/layout/page-heading";
import { useLeaseOptions } from "@/features/leases/hooks/use-lease-options";
import { GenerateMonthlyRentButton } from "@/features/ledger/components/generate-monthly-rent-button";
import { LedgerEntryFormDialog } from "@/features/ledger/components/ledger-entry-form-dialog";
import { LedgerTable } from "@/features/ledger/components/ledger-table";
import { useLedgerEntries } from "@/features/ledger/hooks/use-ledger-entries";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { getApiErrorMessage } from "@/utils/api";
import { emptyToUndefined } from "@/utils/string";
import { DEFAULT_PAGE_SIZE } from "@/config/pagination";
import type { ILedgerQueryParams } from "@/types/ledger";

export const LedgerView = () => {
  const t = useTranslations("ledger");
  const tCommon = useTranslations("common");
  const tFilters = useTranslations("filters");

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [leaseFilter, setLeaseFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(searchTerm);
  const { options: leaseOptions } = useLeaseOptions();

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleLeaseChange = (value: string) => {
    setLeaseFilter(value);
    setPage(1);
  };

  const params = useMemo<ILedgerQueryParams>(
    () => ({
      page,
      limit: DEFAULT_PAGE_SIZE,
      search: emptyToUndefined(debouncedSearch),
      leaseId: emptyToUndefined(leaseFilter),
    }),
    [page, debouncedSearch, leaseFilter],
  );

  const { data, isPending, isError, error, refetch } = useLedgerEntries(params);

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
            value={leaseFilter}
            onChange={(event) => handleLeaseChange(event.target.value)}
            options={[{ value: "", label: t("allLeases") }, ...leaseOptions]}
            aria-label={t("fields.lease")}
            className="w-full shrink-0 sm:w-44"
          />

          <div className="flex shrink-0 gap-2">
            <GenerateMonthlyRentButton />
            <Button onClick={() => setIsFormOpen(true)}>
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
            icon={<BookText className="h-6 w-6" aria-hidden />}
            action={
              <Button size="sm" onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4" aria-hidden />
                {t("create")}
              </Button>
            }
          />
        </Card>
      ) : null}

      {data && data.items.length > 0 ? (
        <div className="space-y-4">
          <LedgerTable entries={data.items} />
          <Pagination meta={data.meta} onPageChange={setPage} />
        </div>
      ) : null}

      <LedgerEntryFormDialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
};
