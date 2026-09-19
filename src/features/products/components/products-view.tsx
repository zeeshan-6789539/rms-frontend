"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Package, Plus } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeading } from "@/components/layout/page-heading";
import { useCategoryTree } from "@/features/categories/hooks/use-category-tree";
import { ProductFormDialog } from "@/features/products/components/product-form-dialog";
import { ProductsTable } from "@/features/products/components/products-table";
import { useProducts } from "@/features/products/hooks/use-products";
import { useProductStatus } from "@/features/products/hooks/use-product-status";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_PAGE_SIZE } from "@/config/pagination";
import { getApiErrorMessage } from "@/utils/api";
import { emptyToUndefined } from "@/utils/string";
import { toStatusValue } from "@/utils/status";
import type { TStatusFilter } from "@/types/query-params";
import type { IProduct, IProductQueryParams } from "@/types/product";

const ALL_SUBCATEGORIES = "all";

export const ProductsView = () => {
  const t = useTranslations("products");
  const tCommon = useTranslations("common");
  const tFilters = useTranslations("filters");
  const { showToast } = useToast();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TStatusFilter>("all");
  const [subcategoryFilter, setSubcategoryFilter] = useState(ALL_SUBCATEGORIES);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [statusTarget, setStatusTarget] = useState<IProduct | null>(null);

  const debouncedSearch = useDebouncedValue(searchTerm);
  const { data: categoryTree } = useCategoryTree();

  const categoryLabelBySubcategoryId = useMemo(() => {
    const map = new Map<string, string>();
    (categoryTree ?? []).forEach((category) => {
      category.subcategories.forEach((subcategory) => {
        map.set(subcategory.id, `${category.name} / ${subcategory.name}`);
      });
    });
    return map;
  }, [categoryTree]);

  const subcategoryFilterOptions = [
    { value: ALL_SUBCATEGORIES, label: tFilters("allCategories") },
    ...[...categoryLabelBySubcategoryId.entries()].map(([value, label]) => ({
      value,
      label,
    })),
  ];

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleStatusChange = (value: TStatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleSubcategoryChange = (value: string) => {
    setSubcategoryFilter(value);
    setPage(1);
  };

  const params = useMemo<IProductQueryParams>(
    () => ({
      page,
      limit: DEFAULT_PAGE_SIZE,
      search: emptyToUndefined(debouncedSearch),
      status: toStatusValue(statusFilter),
      subcategoryId:
        subcategoryFilter === ALL_SUBCATEGORIES ? undefined : subcategoryFilter,
    }),
    [page, debouncedSearch, statusFilter, subcategoryFilter],
  );

  const { data, isPending, isError, error, refetch } = useProducts(params);
  const { mutate: changeStatus, isPending: isChangingStatus } = useProductStatus();

  const statusOptions = [
    { value: "all", label: tFilters("allStatuses") },
    { value: "active", label: tCommon("active") },
    { value: "inactive", label: tCommon("deactivated") },
  ];

  const openCreateDialog = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const openEditDialog = (product: IProduct) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleConfirmStatus = () => {
    if (!statusTarget) return;

    changeStatus(
      { id: statusTarget.id, nextStatus: !statusTarget.status },
      {
        onSuccess: (updated) => {
          showToast(
            updated.status
              ? t("restored", { name: updated.name })
              : t("deactivated", { name: updated.name }),
          );
          setStatusTarget(null);
        },
        onError: (mutationError) =>
          showToast(getApiErrorMessage(mutationError, tCommon("error")), "danger"),
      },
    );
  };

  return (
    <div className="space-y-4">
      <PageHeading title={t("title")} description={t("subtitle")}>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          <SearchInput
            value={searchTerm}
            onChange={handleSearchChange}
            label={tFilters("searchLabel")}
            placeholder={t("searchPlaceholder")}
            className="w-full shrink-0 sm:w-56"
          />

          <Select
            value={subcategoryFilter}
            onChange={handleSubcategoryChange}
            options={subcategoryFilterOptions}
            aria-label={tFilters("categoryLabel")}
            className="w-full shrink-0 sm:w-48"
          />

          <Select
            value={statusFilter}
            onChange={(value) => handleStatusChange(value as TStatusFilter)}
            options={statusOptions}
            aria-label={tFilters("statusLabel")}
            className="w-full shrink-0 sm:w-36"
          />

          <Button className="shrink-0" onClick={openCreateDialog}>
            <Plus className="h-4 w-4" aria-hidden />
            {t("create")}
          </Button>
        </div>
      </PageHeading>

      {isPending ? <Skeleton className="h-72" /> : null}

      {isError ? (
        <Alert>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>{getApiErrorMessage(error, tCommon("error"))}</span>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              {tCommon("retry")}
            </Button>
          </div>
        </Alert>
      ) : null}

      {data && data.items.length === 0 ? (
        <Card className="p-0">
          <EmptyState
            title={t("emptyTitle")}
            description={t("emptySubtitle")}
            icon={<Package className="h-6 w-6" aria-hidden />}
            action={
              <Button size="sm" onClick={openCreateDialog}>
                <Plus className="h-4 w-4" aria-hidden />
                {t("create")}
              </Button>
            }
          />
        </Card>
      ) : null}

      {data && data.items.length > 0 ? (
        <div className="space-y-4">
          <ProductsTable
            products={data.items}
            categoryLabelBySubcategoryId={categoryLabelBySubcategoryId}
            onEdit={openEditDialog}
            onToggleStatus={setStatusTarget}
          />
          <Pagination meta={data.meta} onPageChange={setPage} />
        </div>
      ) : null}

      <ProductFormDialog
        isOpen={isFormOpen}
        product={editingProduct}
        onClose={() => setIsFormOpen(false)}
      />

      <ConfirmDialog
        isOpen={statusTarget !== null}
        title={statusTarget?.status ? t("deactivateTitle") : t("restoreTitle")}
        description={
          statusTarget?.status
            ? t("deactivateConfirm", { name: statusTarget?.name ?? "" })
            : t("restoreConfirm", { name: statusTarget?.name ?? "" })
        }
        confirmLabel={statusTarget?.status ? t("deactivate") : t("restore")}
        isDestructive={statusTarget?.status ?? false}
        isPending={isChangingStatus}
        onConfirm={handleConfirmStatus}
        onClose={() => setStatusTarget(null)}
      />
    </div>
  );
};
