import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RequireRole } from "@/components/layout/require-role";
import { ProductDetailView } from "@/features/products/components/product-detail-view";

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/products/[id]">): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });

  return { title: t("title") };
};

const ProductDetailPage = async ({
  params,
}: PageProps<"/[locale]/products/[id]">) => {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return (
    <RequireRole roles={["client_admin", "manager", "staff"]}>
      <ProductDetailView productId={id} />
    </RequireRole>
  );
};

export default ProductDetailPage;
