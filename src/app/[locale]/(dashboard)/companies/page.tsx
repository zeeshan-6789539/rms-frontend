import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RequireRole } from "@/components/layout/require-role";
import { CompaniesView } from "@/features/companies/components/companies-view";

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/companies">): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "companies" });

  return { title: t("title") };
};

const CompaniesPage = async ({ params }: PageProps<"/[locale]/companies">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <RequireRole roles={["super_admin"]}>
      <CompaniesView />
    </RequireRole>
  );
};

export default CompaniesPage;
