import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RequireRole } from "@/components/layout/require-role";
import { TenantsView } from "@/features/tenants/components/tenants-view";

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/tenants">): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tenants" });

  return { title: t("title") };
};

const TenantsPage = async ({ params }: PageProps<"/[locale]/tenants">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <RequireRole roles={["client_admin"]}>
      <TenantsView />
    </RequireRole>
  );
};

export default TenantsPage;
