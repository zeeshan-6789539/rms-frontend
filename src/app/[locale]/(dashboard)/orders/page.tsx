import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RequireRole } from "@/components/layout/require-role";
import { OrdersView } from "@/features/orders/components/orders-view";

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/orders">): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "orders" });

  return { title: t("title") };
};

const OrdersPage = async ({ params }: PageProps<"/[locale]/orders">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <RequireRole roles={["client_admin", "manager", "staff"]}>
      <OrdersView />
    </RequireRole>
  );
};

export default OrdersPage;
