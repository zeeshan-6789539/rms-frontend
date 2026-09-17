import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeading } from "@/components/layout/page-heading";
import { RequireRole } from "@/components/layout/require-role";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";

const DashboardPage = async ({ params }: PageProps<"/[locale]">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("dashboard");

  return (
    <div className="space-y-6">
      <PageHeading title={t("title")} description={t("subtitle")} />

      <RequireRole roles={["super_admin"]}>
        <DashboardOverview />
      </RequireRole>
    </div>
  );
};

export default DashboardPage;
