import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeading } from "@/components/layout/page-heading";
import { DashboardRouter } from "@/features/dashboard/components/dashboard-router";

const DashboardPage = async ({ params }: PageProps<"/[locale]">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("dashboard");

  return (
    <div className="space-y-6">
      <PageHeading title={t("title")} description={t("subtitle")} />

      <DashboardRouter />
    </div>
  );
};

export default DashboardPage;
