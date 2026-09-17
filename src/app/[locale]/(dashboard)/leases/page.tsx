import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RequireRole } from "@/components/layout/require-role";
import { LeasesView } from "@/features/leases/components/leases-view";

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/leases">): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "leases" });

  return { title: t("title") };
};

const LeasesPage = async ({ params }: PageProps<"/[locale]/leases">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <RequireRole roles={["client_admin"]}>
      <LeasesView />
    </RequireRole>
  );
};

export default LeasesPage;
