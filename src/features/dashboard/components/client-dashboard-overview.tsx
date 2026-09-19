"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { Banknote, Building2, CircleCheck, FileText, Users } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { Link } from "@/i18n/navigation";
import { useDashboardStats } from "@/features/dashboard/hooks/use-dashboard-stats";
import { getApiErrorMessage } from "@/utils/api";
import { formatCurrency, formatDate, formatNumber } from "@/utils/format";
import type { TBadgeVariant, ISelectOption } from "@/types/ui";
import type { TLeaseStatus } from "@/types/lease";
import type { TDashboardTrendRange } from "@/types/dashboard-stats";

const STATUS_VARIANT: Record<TLeaseStatus, TBadgeVariant> = {
  active: "success",
  terminated: "danger",
  expired: "muted",
};

const ASSIGNED_COLOR = "var(--chart-1)";
const VACANT_COLOR = "var(--muted-foreground)";

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "0.5rem",
  color: "var(--foreground)",
  fontSize: "0.75rem",
};

export const ClientDashboardOverview = () => {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const tLeaseStatus = useTranslations("leases.status");
  const tMethod = useTranslations("payments.methods");
  const locale = useLocale();
  const [trendRange, setTrendRange] = useState<TDashboardTrendRange>("6m");

  const trendRangeOptions: ISelectOption[] = [
    { value: "6m", label: t("trendRange.sixMonths") },
    { value: "1y", label: t("trendRange.oneYear") },
    { value: "all", label: t("trendRange.all") },
  ];

  const { data, isPending, isError, error } = useDashboardStats(trendRange);

  if (isPending) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-28" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return <Alert>{getApiErrorMessage(error, tCommon("error"))}</Alert>;
  }

  const trendData = data.paymentsTrend.map((point) => ({
    ...point,
    label: new Date(`${point.month}-01T00:00:00Z`).toLocaleDateString(locale, {
      month: "short",
      year: trendRange === "all" ? "2-digit" : undefined,
      timeZone: "UTC",
    }),
    total: Number(point.total),
  }));

  const vacantProperties = Math.max(data.totals.properties - data.totals.assignedProperties, 0);
  const propertyAssignmentData = [
    { key: "assigned", label: t("propertyAssignment.assigned"), value: data.totals.assignedProperties, color: ASSIGNED_COLOR },
    { key: "vacant", label: t("propertyAssignment.vacant"), value: vacantProperties, color: VACANT_COLOR },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label={t("stats.tenants")}
          value={String(data.totals.tenants)}
          hint={t("stats.activeTenantsHint", { count: data.totals.activeTenants })}
          icon={<Users className="h-5 w-5" aria-hidden />}
        />
        <StatCard
          label={t("stats.properties")}
          value={String(data.totals.properties)}
          icon={<Building2 className="h-5 w-5" aria-hidden />}
        />
        <StatCard
          label={t("stats.activeLeases")}
          value={String(data.totals.activeLeases)}
          icon={<FileText className="h-5 w-5" aria-hidden />}
        />
        <StatCard
          label={t("stats.paymentsThisMonth")}
          value={formatCurrency(Number(data.totals.paymentsThisMonthTotal), locale)}
          hint={t("stats.paymentsThisMonthCount", { count: data.totals.paymentsThisMonthCount })}
          icon={<Banknote className="h-5 w-5" aria-hidden />}
        />
        <StatCard
          label={t("stats.paymentsLastMonth")}
          value={formatCurrency(Number(data.totals.paymentsLastMonthTotal), locale)}
          icon={<CircleCheck className="h-5 w-5" aria-hidden />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold tracking-tight">{t("paymentsTrend")}</h2>
            <Select
              value={trendRange}
              onChange={(event) => setTrendRange(event.target.value as TDashboardTrendRange)}
              options={trendRangeOptions}
              aria-label={t("trendRangeLabel")}
              className="w-36"
            />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="paymentsTrendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="label"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                  tickFormatter={(value: number) => formatCurrency(value, locale)}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => formatCurrency(Number(value), locale)}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#paymentsTrendFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col space-y-4">
          <h2 className="font-semibold tracking-tight">{t("propertyAssignmentBreakdown")}</h2>
          {data.totals.properties === 0 ? (
            <p className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              {t("noProperties")}
            </p>
          ) : (
            <div className="flex flex-1 flex-wrap items-center justify-center gap-6">
              <div className="relative h-48 w-48 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value, name) => [formatNumber(Number(value ?? 0), locale), String(name)]}
                    />
                    <Pie
                      data={propertyAssignmentData}
                      dataKey="value"
                      nameKey="label"
                      innerRadius="70%"
                      outerRadius="100%"
                      paddingAngle={vacantProperties > 0 ? 3 : 0}
                      stroke="none"
                    >
                      {propertyAssignmentData.map((entry) => (
                        <Cell key={entry.key} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-semibold tracking-tight">
                    {formatNumber(data.totals.properties, locale)}
                  </span>
                  <span className="text-xs text-muted-foreground">{t("stats.properties")}</span>
                </div>
              </div>

              <ul className="space-y-2">
                {propertyAssignmentData.map((entry) => (
                  <li key={entry.key} className="flex items-center gap-2 text-sm">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: entry.color }}
                      aria-hidden
                    />
                    <span className="text-muted-foreground">{entry.label}</span>
                    <span className="font-medium">{formatNumber(entry.value, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        <Card className="space-y-4">
          <h2 className="font-semibold tracking-tight">{t("outstandingLeases")}</h2>

          {data.outstandingLeases.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("noOutstandingLeases")}</p>
          ) : (
            <ul className="divide-y divide-border">
              {data.outstandingLeases.map((lease) => (
                <li key={lease.id}>
                  <Link
                    href={`/leases/${lease.id}`}
                    className="flex items-center justify-between gap-3 py-2.5 hover:opacity-80"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{lease.tenantName}</p>
                      <p className="truncate text-xs text-muted-foreground">{lease.propertyName}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-sm font-medium text-danger">
                        {formatCurrency(Number(lease.outstandingBalance), locale)}
                      </span>
                      <Badge variant={STATUS_VARIANT[lease.status]}>
                        {tLeaseStatus(lease.status)}
                      </Badge>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold tracking-tight">{t("recentPayments")}</h2>
          </div>

          {data.recentPayments.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("noPayments")}</p>
          ) : (
            <ul className="divide-y divide-border">
              {data.recentPayments.map((payment) => (
                <li
                  key={payment.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{payment.tenantName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {payment.propertyName}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-sm font-medium text-success">
                      {formatCurrency(Number(payment.amountPaid), locale)}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="info">{tMethod(payment.paymentMethod)}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(payment.paymentDate, locale)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
};
