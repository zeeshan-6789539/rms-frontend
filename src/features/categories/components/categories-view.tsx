"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, RefreshCw, Tags } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeading } from "@/components/layout/page-heading";
import { CategoryCard } from "@/features/categories/components/category-card";
import { useCategoryTree } from "@/features/categories/hooks/use-category-tree";
import { useSaveCategory } from "@/features/categories/hooks/use-save-category";
import { useSaveSubcategory } from "@/features/categories/hooks/use-save-subcategory";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/utils/api";
import type { ICategoryTree, ISubcategoryTree } from "@/types/category";

export const CategoriesView = () => {
  const t = useTranslations("categories");
  const tCommon = useTranslations("common");
  const { showToast } = useToast();

  const [newCategoryName, setNewCategoryName] = useState("");

  const {
    data: categories,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useCategoryTree();
  const { mutate: saveCategory, isPending: isSavingCategory } = useSaveCategory();
  const { mutate: saveSubcategory, isPending: isSavingSubcategory } =
    useSaveSubcategory();

  const handleCreateCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;

    saveCategory(
      { payload: { name } },
      {
        onSuccess: (created) => {
          showToast(t("created", { name: created.name }));
          setNewCategoryName("");
        },
        onError: (mutationError) =>
          showToast(getApiErrorMessage(mutationError, tCommon("error")), "danger"),
      },
    );
  };

  const handleRenameCategory = (category: ICategoryTree, name: string) => {
    saveCategory(
      { id: category.id, payload: { name } },
      {
        onSuccess: (updated) => showToast(t("updated", { name: updated.name })),
        onError: (mutationError) =>
          showToast(getApiErrorMessage(mutationError, tCommon("error")), "danger"),
      },
    );
  };

  const handleAddSubcategory = (category: ICategoryTree, name: string) => {
    saveSubcategory(
      { payload: { name, categoryId: category.id } },
      {
        onSuccess: (created) =>
          showToast(t("subcategoryCreated", { name: created.name })),
        onError: (mutationError) =>
          showToast(getApiErrorMessage(mutationError, tCommon("error")), "danger"),
      },
    );
  };

  const handleRenameSubcategory = (subcategory: ISubcategoryTree, name: string) => {
    saveSubcategory(
      { id: subcategory.id, payload: { name, categoryId: subcategory.categoryId } },
      {
        onSuccess: (updated) =>
          showToast(t("subcategoryUpdated", { name: updated.name })),
        onError: (mutationError) =>
          showToast(getApiErrorMessage(mutationError, tCommon("error")), "danger"),
      },
    );
  };

  const isSaving = isSavingCategory || isSavingSubcategory;

  return (
    <div className="space-y-4">
      <PageHeading title={t("title")} description={t("subtitle")}>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.target.value)}
            placeholder={t("newCategoryPlaceholder")}
            className="w-full sm:w-56"
            disabled={isSavingCategory}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleCreateCategory();
            }}
          />
          <Button
            onClick={handleCreateCategory}
            disabled={isSavingCategory || !newCategoryName.trim()}
          >
            <Plus className="h-4 w-4" aria-hidden />
            {t("addCategory")}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            aria-label={tCommon("retry")}
          >
            <RefreshCw
              className={isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"}
              aria-hidden
            />
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

      {categories && categories.length === 0 ? (
        <Card className="p-0">
          <EmptyState
            title={t("emptyTitle")}
            description={t("emptySubtitle")}
            icon={<Tags className="h-6 w-6" aria-hidden />}
          />
        </Card>
      ) : null}

      {categories && categories.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isSaving={isSaving}
              onRenameCategory={handleRenameCategory}
              onAddSubcategory={handleAddSubcategory}
              onRenameSubcategory={handleRenameSubcategory}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};
