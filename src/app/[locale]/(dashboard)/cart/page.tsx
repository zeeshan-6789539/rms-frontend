import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RequireRole } from "@/components/layout/require-role";
import { CartView } from "@/features/cart/components/cart-view";

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/cart">): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cart" });

  return { title: t("title") };
};

const CartPage = async ({ params }: PageProps<"/[locale]/cart">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <RequireRole roles={["client_admin", "manager", "staff"]}>
      <CartView />
    </RequireRole>
  );
};

export default CartPage;
