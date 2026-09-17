import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RequireRole } from "@/components/layout/require-role";
import { LedgerView } from "@/features/ledger/components/ledger-view";

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/ledger">): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ledger" });

  return { title: t("title") };
};

const LedgerPage = async ({ params }: PageProps<"/[locale]/ledger">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <RequireRole roles={["client_admin"]}>
      <LedgerView />
    </RequireRole>
  );
};

export default LedgerPage;
