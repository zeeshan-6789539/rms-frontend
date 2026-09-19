"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CircleDollarSign, PackageSearch, TrendingUp } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { RevenueTrendChart } from "@/features/dashboard/components/revenue-trend-chart";
import type { IDailyRevenuePoint } from "@/features/dashboard/types/shop-dashboard-components";
import { useOrders } from "@/features/orders/hooks/use-orders";
import { useProducts } from "@/features/products/hooks/use-products";
import { MAX_PAGE_SIZE } from "@/config/pagination";
import { getApiErrorMessage } from "@/utils/api";
import { formatCurrency } from "@/utils/format";
import type { IOrder } from "@/types/order";

// Statuses that represent real revenue — cancelled/refunded/failed orders don't count
const REVENUE_STATUSES = new Set(["pending", "processing", "paid", "shipped", "delivered"]);

const getMonthRange = (): { from: string; to: string } => {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);

  return { from: from.toISOString(), to: now.toISOString() };
};

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const sumRevenue = (orders: IOrder[]): number =>
  orders
    .filter((order) => REVENUE_STATUSES.has(order.status))
    .reduce((sum, order) => sum + order.total, 0);

const buildDailySeries = (orders: IOrder[]): IDailyRevenuePoint[] => {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const totals = new Array<number>(daysInMonth).fill(0);

  orders
    .filter((order) => REVENUE_STATUSES.has(order.status))
    .forEach((order) => {
      const day = new Date(order.createdAt).getDate();
      totals[day - 1] += order.total;
    });

  return totals.map((revenue, index) => ({ day: index + 1, revenue }));
};

// Note: monthOrders/activeProducts are capped at MAX_PAGE_SIZE (100), so shops
// with more orders or products than that in a month will see an undercount.
export const ShopDashboardOverview = () => {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const { from, to } = useMemo(() => getMonthRange(), []);

  const monthOrders = useOrders({ page: 1, limit: MAX_PAGE_SIZE, from, to });
  const activeProducts = useProducts({ page: 1, limit: MAX_PAGE_SIZE, status: true });

  const isPending = monthOrders.isPending || activeProducts.isPending;
  const failedQuery = [monthOrders, activeProducts].find((query) => query.isError);

  if (isPending) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (failedQuery?.isError) {
    return <Alert>{getApiErrorMessage(failedQuery.error, tCommon("error"))}</Alert>;
  }

  const orders = monthOrders.data?.items ?? [];
  const products = activeProducts.data?.items ?? [];
  const now = new Date();

  const todayRevenue = sumRevenue(
    orders.filter((order) => isSameDay(new Date(order.createdAt), now)),
  );
  const monthRevenue = sumRevenue(orders);
  const stockValue = products.reduce(
    (sum, product) => sum + product.sellPrice * product.remainingStock,
    0,
  );
  const dailySeries = buildDailySeries(orders);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label={t("shop.todayRevenue")}
          value={formatCurrency(todayRevenue, locale)}
          icon={<CircleDollarSign className="h-5 w-5" aria-hidden />}
        />
        <StatCard
          label={t("shop.monthRevenue")}
          value={formatCurrency(monthRevenue, locale)}
          icon={<TrendingUp className="h-5 w-5" aria-hidden />}
        />
        <StatCard
          label={t("shop.stockValue")}
          value={formatCurrency(stockValue, locale)}
          hint={t("shop.stockValueHint")}
          icon={<PackageSearch className="h-5 w-5" aria-hidden />}
        />
      </div>

      <Card className="space-y-3">
        <h2 className="font-semibold tracking-tight">{t("shop.revenueTrend")}</h2>
        <RevenueTrendChart
          points={dailySeries}
          ariaLabel={t("shop.revenueTrend")}
          formatTooltip={(point) =>
            t("shop.revenueTrendTooltip", {
              day: point.day,
              amount: formatCurrency(point.revenue, locale),
            })
          }
        />
      </Card>
    </div>
  );
};
