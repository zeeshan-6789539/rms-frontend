"use client";

import { useCallback, useMemo, useState } from "react";
import type { ICartItem } from "@/types/cart";
import type { IProduct } from "@/types/product";

export const useCart = () => {
  const [items, setItems] = useState<ICartItem[]>([]);

  const addItem = useCallback((product: IProduct) => {
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);

      if (existing) {
        if (existing.quantity >= product.remainingStock) return current;

        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      if (product.remainingStock <= 0) return current;

      return [...current, { product, quantity: 1 }];
    });
  }, []);

  // A quantity outside [1, remainingStock] is clamped rather than rejected
  const setQuantity = useCallback((productId: string, quantity: number) => {
    setItems((current) =>
      current.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(quantity, item.product.remainingStock),
              ),
            }
          : item,
      ),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.product.id !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.product.sellPrice, 0),
    [items],
  );

  return { items, addItem, setQuantity, removeItem, clear, totalItems, totalAmount };
};
