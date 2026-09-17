import { setRequestLocale } from "next-intl/server";
import { AppSidebar } from "@/components/layout/app-sidebar";

const DashboardLayout = async ({
  children,
  params,
}: LayoutProps<"/[locale]">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-dvh">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 pt-20 sm:px-6 md:pt-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
