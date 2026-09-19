import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeading } from "@/components/layout/page-heading";
import { RequireRole } from "@/components/layout/require-role";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { ShopDashboardOverview } from "@/features/dashboard/components/shop-dashboard-overview";

const DashboardPage = async ({ params }: PageProps<"/[locale]">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("dashboard");

  return (
    <div className="space-y-6">
      <PageHeading title={t("title")} description={t("subtitle")} />

      <RequireRole roles={["super_admin"]} fallback={null}>
        <DashboardOverview />
      </RequireRole>

      <RequireRole roles={["client_admin", "manager", "staff"]} fallback={null}>
        <ShopDashboardOverview />
      </RequireRole>
    </div>
  );
};

export default DashboardPage;
