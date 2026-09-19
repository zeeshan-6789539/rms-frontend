import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RequireRole } from "@/components/layout/require-role";
import { ProductsView } from "@/features/products/components/products-view";

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/products">): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });

  return { title: t("title") };
};

const ProductsPage = async ({ params }: PageProps<"/[locale]/products">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <RequireRole roles={["client_admin", "manager", "staff"]}>
      <ProductsView />
    </RequireRole>
  );
};

export default ProductsPage;
