"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Banknote, Building2, CircleCheck, FileText, Users } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { useDashboardStats } from "@/features/dashboard/hooks/use-dashboard-stats";
import { getApiErrorMessage } from "@/utils/api";
import { formatCurrency, formatDate } from "@/utils/format";
import type { TLeaseStatus } from "@/types/lease";
import type { TPaymentMethod } from "@/types/payment";

const LEASE_STATUS_ORDER: TLeaseStatus[] = ["active", "terminated", "expired"];
const LEASE_STATUS_COLORS = ["var(--chart-1)", "var(--chart-4)", "var(--chart-2)"];
const PAYMENT_METHOD_ORDER: TPaymentMethod[] = ["cash", "bank_transfer", "cheque", "online"];
const PAYMENT_METHOD_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-5)",
];

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

  const { data, isPending, isError, error } = useDashboardStats();

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

  const leaseStatusData = LEASE_STATUS_ORDER.map((status) => ({
    status,
    label: tLeaseStatus(status),
    count: data.leaseStatusBreakdown.find((row) => row.status === status)?.count ?? 0,
  }));

  const paymentMethodData = PAYMENT_METHOD_ORDER.map((method) => ({
    method,
    label: tMethod(method),
    total: Number(
      data.paymentMethodBreakdown.find((row) => row.method === method)?.total ?? 0,
    ),
  }));

  const trendData = data.paymentsTrend.map((point) => ({
    ...point,
    label: new Date(`${point.month}-01T00:00:00Z`).toLocaleDateString(locale, {
      month: "short",
      timeZone: "UTC",
    }),
    total: Number(point.total),
  }));

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
          <h2 className="font-semibold tracking-tight">{t("paymentsTrend")}</h2>
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

        <Card className="space-y-4">
          <h2 className="font-semibold tracking-tight">{t("leaseStatusBreakdown")}</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leaseStatusData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
                  width={32}
                  allowDecimals={false}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {leaseStatusData.map((entry, index) => (
                    <Cell key={entry.status} fill={LEASE_STATUS_COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="font-semibold tracking-tight">{t("paymentMethodBreakdown")}</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentMethodData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={entry.method} fill={PAYMENT_METHOD_COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
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
