"use client";

import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import { isHighQualityCartItem } from "@/lib/shrimp/highQuality";
import type { CartItem } from "@/types/cart";

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "lineId" | "quantity">, quantity?: number) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
}

type PersistedCartState = {
  items?: CartItem[];
};

function getCartLineId(item: Pick<CartItem, "productId" | "variantId">) {
  return `${item.productId}:${item.variantId}`;
}

const legacyCompatibleStorage: StateStorage = {
  getItem(name) {
    const value = localStorage.getItem(name);
    if (!value) return null;

    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) {
        return JSON.stringify({ state: { items: parsed }, version: 1 });
      }
    } catch {
      return null;
    }

    return value;
  },
  setItem: (name, value) => localStorage.setItem(name, value),
  removeItem: (name) => localStorage.removeItem(name),
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity = 1) =>
        set((state) => {
          if (isHighQualityCartItem(item)) return state;

          const lineId = getCartLineId(item);
          const existing = state.items.find((current) => current.lineId === lineId);
          return {
            items: existing
              ? state.items.map((current) =>
                  current.lineId === lineId
                    ? { ...current, quantity: current.quantity + quantity }
                    : current,
                )
              : [...state.items, { ...item, lineId, quantity }],
          };
        }),
      removeItem: (lineId) =>
        set((state) => ({ items: state.items.filter((item) => item.lineId !== lineId) })),
      updateQuantity: (lineId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.lineId !== lineId)
              : state.items.map((item) => (item.lineId === lineId ? { ...item, quantity } : item)),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "tony-cart",
      version: 2,
      storage: createJSONStorage(() => legacyCompatibleStorage),
      migrate: (persistedState) => {
        const state = persistedState as PersistedCartState;
        return {
          ...state,
          items: (state.items ?? []).filter((item) => !isHighQualityCartItem(item)),
        };
      },
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function useCart() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };
}
