"use client";

import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeading } from "@/components/layout/page-heading";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { ClientDashboardOverview } from "@/features/dashboard/components/client-dashboard-overview";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { GenerateMonthlyRentButton } from "@/features/ledger/components/generate-monthly-rent-button";
import { getApiErrorMessage } from "@/utils/api";

// Dispatches to the platform (super_admin) or company (client_admin) dashboard —
// a single gate here avoids stacking two RequireRole checks for one route
export const DashboardRouter = () => {
  const t = useTranslations("account");
  const tDashboard = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const { data: user, isPending, isError, error } = useCurrentUser();

  const heading = (
    <PageHeading title={tDashboard("title")} description={tDashboard("subtitle")}>
      {user?.role === "super_admin" ? <GenerateMonthlyRentButton /> : null}
    </PageHeading>
  );

  if (isPending) {
    return (
      <div className="space-y-6">
        {heading}
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        {heading}
        <Alert>{getApiErrorMessage(error, tCommon("error"))}</Alert>
      </div>
    );
  }

  if (user?.role === "super_admin") {
    return (
      <div className="space-y-6">
        {heading}
        <DashboardOverview />
      </div>
    );
  }

  if (user?.role === "client_admin") {
    return (
      <div className="space-y-6">
        {heading}
        <ClientDashboardOverview />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {heading}
      <Alert variant="info">{t("noAccess")}</Alert>
    </div>
  );
};
