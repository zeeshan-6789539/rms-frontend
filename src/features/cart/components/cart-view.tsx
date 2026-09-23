"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ShoppingCart } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SearchInput } from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeading } from "@/components/layout/page-heading";
import { CartCatalog } from "@/features/cart/components/cart-catalog";
import { CartLines } from "@/features/cart/components/cart-lines";
import { useCart } from "@/features/cart/hooks/use-cart";
import { useCategoryTree } from "@/features/categories/hooks/use-category-tree";
import { useCheckoutOrder } from "@/features/orders/hooks/use-checkout-order";
import { useProducts } from "@/features/products/hooks/use-products";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useToast } from "@/hooks/use-toast";
import { MAX_PAGE_SIZE } from "@/config/pagination";
import { getApiErrorMessage } from "@/utils/api";
import { emptyToUndefined } from "@/utils/string";
import { formatCurrency } from "@/utils/format";

export const CartView = () => {
  const t = useTranslations("cart");
  const tCommon = useTranslations("common");
  const tFilters = useTranslations("filters");
  const locale = useLocale();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const debouncedSearch = useDebouncedValue(searchTerm);

  const { items, addItem, setQuantity, removeItem, clear, totalItems, totalAmount } =
    useCart();

  const { data, isPending, isError, error } = useProducts({
    page: 1,
    limit: MAX_PAGE_SIZE,
    search: emptyToUndefined(debouncedSearch),
    status: true,
  });

  const { mutate: checkout, isPending: isCheckingOut } = useCheckoutOrder();
  const { data: categoryTree } = useCategoryTree();

  const cartQuantityById = useMemo(
    () => new Map(items.map((item) => [item.product.id, item.quantity])),
    [items],
  );

  const categoryLabelBySubcategoryId = useMemo(() => {
    const map = new Map<string, string>();
    (categoryTree ?? []).forEach((category) => {
      category.subcategories.forEach((subcategory) => {
        map.set(subcategory.id, `${category.name} / ${subcategory.name}`);
      });
    });
    return map;
  }, [categoryTree]);

  const handleCheckout = () => {
    checkout(
      {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.sellPrice,
        })),
      },
      {
        onSuccess: () => {
          showToast(t("checkoutSuccess"));
          clear();
          setIsConfirmOpen(false);
        },
        onError: (mutationError) => {
          showToast(getApiErrorMessage(mutationError, tCommon("error")), "danger");
          setIsConfirmOpen(false);
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      <PageHeading title={t("title")} description={t("subtitle")} />

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="space-y-4 lg:col-span-3">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            label={tFilters("searchLabel")}
            placeholder={t("searchPlaceholder")}
          />

          {isPending ? <Skeleton className="h-72" /> : null}

          {isError ? <Alert>{getApiErrorMessage(error, tCommon("error"))}</Alert> : null}

          {data ? (
            <CartCatalog
              products={data.items}
              cartQuantityById={cartQuantityById}
              categoryLabelBySubcategoryId={categoryLabelBySubcategoryId}
              onAdd={addItem}
            />
          ) : null}
        </Card>

        <Card className="flex max-h-[85vh] flex-col gap-4 lg:col-span-2">
          <h2 className="flex items-center gap-2 font-semibold tracking-tight">
            <ShoppingCart className="h-4 w-4" aria-hidden />
            {t("cartTitle", { count: totalItems })}
          </h2>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <CartLines items={items} onQuantityChange={setQuantity} onRemove={removeItem} />
          </div>

          <div className="space-y-3 border-t border-border pt-3">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>{t("fields.total")}</span>
              <span className="text-lg font-semibold">
                {formatCurrency(totalAmount, locale)}
              </span>
            </div>

            <Button
              className="w-full"
              onClick={() => setIsConfirmOpen(true)}
              disabled={items.length === 0}
            >
              {t("checkout")}
            </Button>
          </div>
        </Card>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title={t("checkoutConfirmTitle")}
        description={t("checkoutConfirmDescription", {
          count: totalItems,
          total: formatCurrency(totalAmount, locale),
        })}
        confirmLabel={t("checkout")}
        isPending={isCheckingOut}
        onConfirm={handleCheckout}
        onClose={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};
