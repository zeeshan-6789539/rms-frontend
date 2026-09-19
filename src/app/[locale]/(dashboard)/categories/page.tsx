import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RequireRole } from "@/components/layout/require-role";
import { CategoriesView } from "@/features/categories/components/categories-view";

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/categories">): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "categories" });

  return { title: t("title") };
};

const CategoriesPage = async ({
  params,
}: PageProps<"/[locale]/categories">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <RequireRole roles={["client_admin", "manager"]}>
      <CategoriesView />
    </RequireRole>
  );
};

export default CategoriesPage;
