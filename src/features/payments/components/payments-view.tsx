"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { CreditCard, Plus } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeading } from "@/components/layout/page-heading";
import { PaymentFormDialog } from "@/features/payments/components/payment-form-dialog";
import { PaymentsTable } from "@/features/payments/components/payments-table";
import { usePayments } from "@/features/payments/hooks/use-payments";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { getApiErrorMessage } from "@/utils/api";
import { emptyToUndefined } from "@/utils/string";
import { DEFAULT_PAGE_SIZE } from "@/config/pagination";
import type { IPaymentQueryParams } from "@/types/payment";

export const PaymentsView = () => {
  const t = useTranslations("payments");
  const tCommon = useTranslations("common");
  const tFilters = useTranslations("filters");

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(searchTerm);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const params = useMemo<IPaymentQueryParams>(
    () => ({
      page,
      limit: DEFAULT_PAGE_SIZE,
      search: emptyToUndefined(debouncedSearch),
    }),
    [page, debouncedSearch],
  );

  const { data, isPending, isError, error, refetch } = usePayments(params);

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

          <Button className="shrink-0" onClick={() => setIsFormOpen(true)}>
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
            icon={<CreditCard className="h-6 w-6" aria-hidden />}
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
          <PaymentsTable payments={data.items} />
          <Pagination meta={data.meta} onPageChange={setPage} />
        </div>
      ) : null}

      <PaymentFormDialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
};
