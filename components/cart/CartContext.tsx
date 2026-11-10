"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useCatalog } from "@/components/catalog/CatalogContext";
import type { Product } from "@/data/catalog";
import { createPersistedStore, useHydrated, usePersisted } from "@/lib/persisted";

export const MAX_QTY = 5;

type CartLine = { id: string; qty: number };
export type CartItem = CartLine & { product: Product };

type CartState = {
  items: CartItem[];
  count: number;
  subtotal: number;
  savings: number;
  hydrated: boolean;
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  wishlist: string[];
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (id: string) => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const cartStore = createPersistedStore<CartLine[]>("zarvonique:cart", []);
const wishlistStore = createPersistedStore<string[]>("zarvonique:wishlist", []);

const CartContext = createContext<CartState | null>(null);

const clamp = (qty: number) => Math.max(1, Math.min(MAX_QTY, qty));

// Cart and wishlist live in localStorage; prices come from the live catalogue, and the
// database re-checks them (and stock) when the order is placed.
export function CartProvider({ children }: { children: React.ReactNode }) {
  const { getProduct } = useCatalog();
  const lines = usePersisted(cartStore);
  const wishlist = usePersisted(wishlistStore);
  const hydrated = useHydrated();
  const [isCartOpen, setCartOpen] = useState(false);

  const addToCart = useCallback((id: string, qty = 1) => {
    cartStore.set((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) return prev.map((l) => (l.id === id ? { ...l, qty: clamp(l.qty + qty) } : l));
      return [...prev, { id, qty: clamp(qty) }];
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    cartStore.set((prev) => prev.map((l) => (l.id === id ? { ...l, qty: clamp(qty) } : l)));
  }, []);

  const removeFromCart = useCallback((id: string) => {
    cartStore.set((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clearCart = useCallback(() => cartStore.set([]), []);

  const toggleWishlist = useCallback((id: string) => {
    wishlistStore.set((prev) => (prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]));
  }, []);

  const isWishlisted = useCallback((id: string) => wishlist.includes(id), [wishlist]);
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const value = useMemo(() => {
    const items = lines.flatMap((l) => {
      const product = getProduct(l.id);
      return product ? [{ ...l, product }] : [];
    });
    return {
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.qty * i.product.price, 0),
      savings: items.reduce(
        (n, i) => n + i.qty * ((i.product.originalPrice ?? i.product.price) - i.product.price),
        0,
      ),
      hydrated,
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      wishlist,
      isWishlisted,
      toggleWishlist,
      isCartOpen,
      openCart,
      closeCart,
    };
  }, [
    getProduct,
    lines,
    wishlist,
    hydrated,
    isCartOpen,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    isWishlisted,
    toggleWishlist,
    openCart,
    closeCart,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
