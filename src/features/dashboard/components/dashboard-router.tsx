"use client";

import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { ClientDashboardOverview } from "@/features/dashboard/components/client-dashboard-overview";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { getApiErrorMessage } from "@/utils/api";

// Dispatches to the platform (super_admin) or company (client_admin) dashboard —
// a single gate here avoids stacking two RequireRole checks for one route
export const DashboardRouter = () => {
  const t = useTranslations("account");
  const tCommon = useTranslations("common");
  const { data: user, isPending, isError, error } = useCurrentUser();

  if (isPending) return <Skeleton className="h-64" />;

  if (isError) return <Alert>{getApiErrorMessage(error, tCommon("error"))}</Alert>;

  if (user?.role === "super_admin") return <DashboardOverview />;

  if (user?.role === "client_admin") return <ClientDashboardOverview />;

  return <Alert variant="info">{t("noAccess")}</Alert>;
};
