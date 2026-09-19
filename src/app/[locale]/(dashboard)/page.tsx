import { setRequestLocale } from "next-intl/server";
import { DashboardRouter } from "@/features/dashboard/components/dashboard-router";

const DashboardPage = async ({ params }: PageProps<"/[locale]">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DashboardRouter />;
};

export default DashboardPage;
