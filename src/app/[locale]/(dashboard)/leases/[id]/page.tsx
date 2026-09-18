import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RequireRole } from "@/components/layout/require-role";
import { LeaseDetailView } from "@/features/leases/components/lease-detail-view";

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/leases/[id]">): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "leases" });

  return { title: t("title") };
};

const LeaseDetailPage = async ({ params }: PageProps<"/[locale]/leases/[id]">) => {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return (
    <RequireRole roles={["client_admin"]}>
      <LeaseDetailView leaseId={id} />
    </RequireRole>
  );
};

export default LeaseDetailPage;
