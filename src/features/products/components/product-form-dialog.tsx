"use client";

import { useEffect, useMemo, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { useCategoryTree } from "@/features/categories/hooks/use-category-tree";
import type { IProductFormDialogProps } from "@/features/products/types/product-components";
import { useSaveProduct } from "@/features/products/hooks/use-save-product";
import { productSchema } from "@/features/products/schemas/product-schema";
import { useFormState } from "@/hooks/use-form-state";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/utils/api";
import { toTranslatedFieldErrors } from "@/utils/zod";
import type { ICategoryTree } from "@/types/category";
import type { IProduct, IProductFormValues } from "@/types/product";

const findCategoryIdForSubcategory = (
  categories: ICategoryTree[],
  subcategoryId: string,
): string =>
  categories.find((category) =>
    category.subcategories.some((subcategory) => subcategory.id === subcategoryId),
  )?.id ?? "";

const toFormValues = (
  product: IProduct | null,
  categories: ICategoryTree[],
): IProductFormValues => ({
  name: product?.name ?? "",
  sellPrice: product ? String(product.sellPrice) : "",
  purchasePrice: product ? String(product.purchasePrice) : "",
  quantity: product ? String(product.quantity) : "0",
  categoryId: product
    ? findCategoryIdForSubcategory(categories, product.subcategoryId)
    : "",
  subcategoryId: product?.subcategoryId ?? "",
});

const toPayload = (values: IProductFormValues) => ({
  name: values.name.trim(),
  sellPrice: values.sellPrice,
  purchasePrice: values.purchasePrice,
  quantity: values.quantity,
  subcategoryId: values.subcategoryId,
});

export const ProductFormDialog = ({
  isOpen,
  product,
  onClose,
}: IProductFormDialogProps) => {
  const t = useTranslations("products");
  const tCommon = useTranslations("common");
  const { showToast } = useToast();
  const { data: categoryTree } = useCategoryTree();
  const categories = useMemo(() => categoryTree ?? [], [categoryTree]);

  const { values, errors, setValue, setValues, setErrors, reset } = useFormState(
    toFormValues(product, categories),
  );
  const { mutate, isPending, error, reset: resetMutation } = useSaveProduct();

  useEffect(() => {
    if (!isOpen) return;

    reset(toFormValues(product, categories));
    resetMutation();
  }, [isOpen, product, categories, reset, resetMutation]);

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const selectedCategory = categories.find(
    (category) => category.id === values.categoryId,
  );
  const subcategoryOptions = (selectedCategory?.subcategories ?? []).map(
    (subcategory) => ({ value: subcategory.id, label: subcategory.name }),
  );

  const handleCategoryChange = (categoryId: string) => {
    setValues((current) => ({ ...current, categoryId, subcategoryId: "" }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const translate = (key: string) => t(`errors.${key}`);
    const payload = toPayload(values);
    const parsed = productSchema.safeParse(payload);

    if (!parsed.success) {
      setErrors(toTranslatedFieldErrors<IProductFormValues>(parsed.error, translate));
      return;
    }

    mutate(
      { id: product?.id, payload: parsed.data },
      {
        onSuccess: (saved) => {
          showToast(
            product ? t("updated", { name: saved.name }) : t("created", { name: saved.name }),
          );
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      title={product ? t("editTitle") : t("createTitle")}
      description={product ? t("editSubtitle") : t("createSubtitle")}
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {tCommon("cancel")}
          </Button>
          <Button type="submit" form="product-form" isLoading={isPending}>
            {tCommon("save")}
          </Button>
        </>
      }
    >
      <form id="product-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        {error ? <Alert>{getApiErrorMessage(error, tCommon("error"))}</Alert> : null}

        <FormField id="name" label={t("fields.name")} error={errors.name}>
          <Input
            id="name"
            value={values.name}
            onChange={(event) => setValue("name", event.target.value)}
            hasError={Boolean(errors.name)}
            disabled={isPending}
            autoFocus
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="categoryId" label={t("fields.category")} error={errors.categoryId}>
            <Select
              id="categoryId"
              value={values.categoryId}
              onChange={handleCategoryChange}
              options={categoryOptions}
              placeholder={t("selectCategory")}
              hasError={Boolean(errors.categoryId)}
              disabled={isPending}
            />
          </FormField>

          <FormField
            id="subcategoryId"
            label={t("fields.subcategory")}
            error={errors.subcategoryId}
          >
            <Select
              id="subcategoryId"
              value={values.subcategoryId}
              onChange={(value) => setValue("subcategoryId", value)}
              options={subcategoryOptions}
              placeholder={t("selectSubcategory")}
              hasError={Boolean(errors.subcategoryId)}
              disabled={isPending || !values.categoryId}
            />
          </FormField>

          <FormField id="sellPrice" label={t("fields.sellPrice")} error={errors.sellPrice}>
            <Input
              id="sellPrice"
              type="number"
              min="0"
              step="0.01"
              value={values.sellPrice}
              onChange={(event) => setValue("sellPrice", event.target.value)}
              hasError={Boolean(errors.sellPrice)}
              disabled={isPending}
            />
          </FormField>

          <FormField
            id="purchasePrice"
            label={t("fields.purchasePrice")}
            error={errors.purchasePrice}
          >
            <Input
              id="purchasePrice"
              type="number"
              min="0"
              step="0.01"
              value={values.purchasePrice}
              onChange={(event) => setValue("purchasePrice", event.target.value)}
              hasError={Boolean(errors.purchasePrice)}
              disabled={isPending}
            />
          </FormField>

          <FormField id="quantity" label={t("fields.quantity")} error={errors.quantity}>
            <Input
              id="quantity"
              type="number"
              min="0"
              step="1"
              value={values.quantity}
              onChange={(event) => setValue("quantity", event.target.value)}
              hasError={Boolean(errors.quantity)}
              disabled={isPending}
            />
          </FormField>
        </div>
      </form>
    </Modal>
  );
};
