import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RequireRole } from "@/components/layout/require-role";
import { PaymentsView } from "@/features/payments/components/payments-view";

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/payments">): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "payments" });

  return { title: t("title") };
};

const PaymentsPage = async ({ params }: PageProps<"/[locale]/payments">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <RequireRole roles={["client_admin"]}>
      <PaymentsView />
    </RequireRole>
  );
};

export default PaymentsPage;
