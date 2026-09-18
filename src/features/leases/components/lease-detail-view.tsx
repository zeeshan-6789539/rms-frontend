"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  Banknote,
  CreditCard,
  Download,
  FileQuestion,
  FileText,
  Pencil,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { Link } from "@/i18n/navigation";
import { LeaseFormDialog } from "@/features/leases/components/lease-form-dialog";
import { LeaseStatusDialog } from "@/features/leases/components/lease-status-dialog";
import { UpdateLeaseRentDialog } from "@/features/leases/components/update-lease-rent-dialog";
import { useLease } from "@/features/leases/hooks/use-lease";
import { LedgerEntryFormDialog } from "@/features/ledger/components/ledger-entry-form-dialog";
import { LedgerTable } from "@/features/ledger/components/ledger-table";
import { useLedgerEntries } from "@/features/ledger/hooks/use-ledger-entries";
import { PaymentFormDialog } from "@/features/payments/components/payment-form-dialog";
import { usePayments } from "@/features/payments/hooks/use-payments";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { getApiErrorMessage } from "@/utils/api";
import { formatCurrency, formatDate } from "@/utils/format";
import { generateInvoicePdf } from "@/utils/invoice-pdf";
import { generateLedgerPdf } from "@/utils/ledger-pdf";
import { getPeriodRange } from "@/utils/period";
import { buildPdfFileName, openPdfInNewTab } from "@/utils/pdf";
import { PERIOD_PDF_LABELS } from "@/utils/pdf-labels";
import { matchesSearch } from "@/utils/string";
import { MAX_PAGE_SIZE } from "@/config/pagination";
import type { TBadgeVariant } from "@/types/ui";
import type { TLeaseStatus } from "@/types/lease";
import type { ILedgerQueryParams } from "@/types/ledger";
import type { IPaymentQueryParams } from "@/types/payment";
import type { TPeriodFilter } from "@/types/query-params";
import type { ILeaseDetailViewProps } from "@/features/leases/types/lease-components";

const STATUS_VARIANT: Record<TLeaseStatus, TBadgeVariant> = {
  active: "success",
  terminated: "danger",
  expired: "muted",
};

const PERIOD_FILTERS: readonly TPeriodFilter[] = [
  "all",
  "current_month",
  "last_month",
  "last_3_months",
  "last_6_months",
];

export const LeaseDetailView = ({ leaseId }: ILeaseDetailViewProps) => {
  const t = useTranslations("leases");
  const tStatus = useTranslations("leases.status");
  const tLedger = useTranslations("ledger");
  const tEntryType = useTranslations("ledger.entryTypes");
  const tPayments = useTranslations("payments");
  const tMethod = useTranslations("payments.methods");
  const tCommon = useTranslations("common");
  const tFilters = useTranslations("filters");
  const locale = useLocale();

  const [ledgerSearch, setLedgerSearch] = useState("");
  const [ledgerPeriod, setLedgerPeriod] = useState<TPeriodFilter>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isRentOpen, setIsRentOpen] = useState(false);
  const [isChargeOpen, setIsChargeOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const debouncedLedgerSearch = useDebouncedValue(ledgerSearch).trim().toLowerCase();

  const { data: lease, isPending, isError, error, refetch } = useLease(leaseId);

  const ledgerParams = useMemo<ILedgerQueryParams>(
    () => ({ page: 1, limit: MAX_PAGE_SIZE, leaseId }),
    [leaseId],
  );
  const paymentsParams = useMemo<IPaymentQueryParams>(
    () => ({ page: 1, limit: MAX_PAGE_SIZE, leaseId }),
    [leaseId],
  );

  const { data: ledgerData, isPending: isLedgerPending } = useLedgerEntries(
    ledgerParams,
    Boolean(lease),
  );
  const { data: paymentsData } = usePayments(paymentsParams, Boolean(lease));

  const ledgerEntries = useMemo(() => ledgerData?.items ?? [], [ledgerData]);
  const payments = useMemo(() => paymentsData?.items ?? [], [paymentsData]);

  const paymentByPaymentId = useMemo(
    () => new Map(payments.map((payment) => [payment.id, payment])),
    [payments],
  );

  const filteredLedgerEntries = useMemo(() => {
    const range = getPeriodRange(ledgerPeriod);

    return ledgerEntries
      .filter((entry) => {
        if (range) {
          const entryDate = new Date(entry.dueDate ?? entry.createdAt);
          if (entryDate < range.start || entryDate >= range.end) return false;
        }

        const linkedPayment = entry.paymentId ? paymentByPaymentId.get(entry.paymentId) : undefined;
        return matchesSearch(
          debouncedLedgerSearch,
          tEntryType(entry.entryType),
          entry.amount,
          entry.description,
          linkedPayment ? tMethod(linkedPayment.paymentMethod) : undefined,
          linkedPayment?.receiptNumber,
        );
      })
      // Newest first, by the same date each row displays — not insertion order
      .sort(
        (a, b) =>
          new Date(b.dueDate ?? b.createdAt).getTime() - new Date(a.dueDate ?? a.createdAt).getTime(),
      );
  }, [ledgerEntries, ledgerPeriod, debouncedLedgerSearch, paymentByPaymentId, tEntryType, tMethod]);

  const periodOptions = PERIOD_FILTERS.map((value) => ({
    value,
    label: t(`periods.${value}`),
  }));

  if (isPending) {
    return <Skeleton className="h-96" />;
  }

  if (isError) {
    return (
      <Alert>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>{getApiErrorMessage(error, tCommon("error"))}</span>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            {tCommon("retry")}
          </Button>
        </div>
      </Alert>
    );
  }

  if (!lease) {
    return (
      <Card className="p-0">
        <EmptyState
          title={t("notFoundTitle")}
          description={t("notFoundSubtitle")}
          icon={<FileQuestion className="h-6 w-6" aria-hidden />}
          action={
            <Link href="/leases">
              <Button size="sm" variant="outline">
                <ArrowLeft className="h-4 w-4" aria-hidden />
                {t("backToList")}
              </Button>
            </Link>
          }
        />
      </Card>
    );
  }

  const handleDownloadInvoice = () => {
    openPdfInNewTab(generateInvoicePdf(lease, ledgerEntries), buildPdfFileName(lease.tenantName));
  };

  const handleDownloadLedgerPdf = () => {
    openPdfInNewTab(
      generateLedgerPdf(
        lease,
        filteredLedgerEntries,
        paymentByPaymentId,
        PERIOD_PDF_LABELS[ledgerPeriod],
        debouncedLedgerSearch,
      ),
      buildPdfFileName(lease.tenantName),
    );
  };

  return (
    <div className="space-y-6">
      <Link
        href="/leases"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
        {t("backToList")}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{lease.propertyName}</h1>
            <Badge variant={STATUS_VARIANT[lease.status]}>{tStatus(lease.status)}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{lease.tenantName}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsChargeOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden />
            {tLedger("create")}
          </Button>
          <Button size="sm" onClick={() => setIsPaymentOpen(true)}>
            <CreditCard className="h-4 w-4" aria-hidden />
            {tPayments("create")}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsFormOpen(true)}>
            <Pencil className="h-4 w-4" aria-hidden />
            {t("edit")}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsRentOpen(true)}>
            <Banknote className="h-4 w-4" aria-hidden />
            {t("changeRent")}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsStatusOpen(true)}>
            <RefreshCw className="h-4 w-4" aria-hidden />
            {t("changeStatus")}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t("fields.term")}
          value={`${formatDate(lease.startDate, locale)} – ${formatDate(lease.endDate, locale)}`}
        />
        <StatCard
          label={t("fields.currentRent")}
          value={lease.currentRent ? formatCurrency(Number(lease.currentRent), locale) : "—"}
        />
        <StatCard
          label={t("fields.advanceAmount")}
          value={formatCurrency(Number(lease.advanceAmount), locale)}
        />
        <StatCard
          label={t("fields.outstandingBalance")}
          value={formatCurrency(Number(lease.outstandingBalance), locale)}
        />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight">{t("ledgerSection")}</h2>

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={ledgerPeriod}
              onChange={(event) => setLedgerPeriod(event.target.value as TPeriodFilter)}
              options={periodOptions}
              aria-label={tFilters("periodLabel")}
              className="w-full sm:w-40"
            />
            <SearchInput
              value={ledgerSearch}
              onChange={setLedgerSearch}
              label={tFilters("searchLabel")}
              placeholder={t("searchLedgerPlaceholder")}
              className="w-full sm:w-56"
            />
            <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
              <FileText className="h-4 w-4" aria-hidden />
              {t("invoicePdf")}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadLedgerPdf}>
              <Download className="h-4 w-4" aria-hidden />
              {t("ledgerPdf")}
            </Button>
          </div>
        </div>

        {isLedgerPending ? <Skeleton className="h-48" /> : null}

        {!isLedgerPending && filteredLedgerEntries.length === 0 ? (
          <Card className="p-0">
            <EmptyState title={t("emptyTitle")} description={t("emptySubtitle")} />
          </Card>
        ) : null}

        {!isLedgerPending && filteredLedgerEntries.length > 0 ? (
          <LedgerTable entries={filteredLedgerEntries} />
        ) : null}
      </div>

      <LeaseFormDialog isOpen={isFormOpen} lease={lease} onClose={() => setIsFormOpen(false)} />

      <LeaseStatusDialog
        isOpen={isStatusOpen}
        lease={lease}
        onClose={() => setIsStatusOpen(false)}
      />

      <UpdateLeaseRentDialog
        isOpen={isRentOpen}
        lease={lease}
        onClose={() => setIsRentOpen(false)}
      />

      <LedgerEntryFormDialog
        isOpen={isChargeOpen}
        onClose={() => setIsChargeOpen(false)}
        defaultLeaseId={lease.id}
        defaultLeaseLabel={`${lease.propertyName} – ${lease.tenantName}`}
      />

      <PaymentFormDialog
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        defaultLeaseId={lease.id}
        defaultLeaseLabel={`${lease.propertyName} – ${lease.tenantName}`}
      />
    </div>
  );
};
