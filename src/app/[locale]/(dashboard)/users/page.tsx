import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RequireRole } from "@/components/layout/require-role";
import { UsersView } from "@/features/users/components/users-view";

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/users">): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "users" });

  return { title: t("title") };
};

const UsersPage = async ({ params }: PageProps<"/[locale]/users">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <RequireRole roles={["super_admin"]}>
      <UsersView />
    </RequireRole>
  );
};

export default UsersPage;
