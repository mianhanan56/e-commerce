"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { createPersistedStore, usePersisted } from "@/lib/persisted";

export type OrderLine = { id: string; name: string; image: string; price: number; qty: number };

export type Order = {
  number: string;
  date: string;
  items: OrderLine[];
  subtotal: number;
  payment: "cod" | "bank";
  customer: { name: string; email: string; phone: string; city: string; address: string };
};

type OrdersState = {
  orders: Order[];
  placeOrder: (order: Omit<Order, "number" | "date">) => Order;
  findOrder: (number: string) => Order | undefined;
};

const ordersStore = createPersistedStore<Order[]>("waqt:orders", []);

const OrdersContext = createContext<OrdersState | null>(null);

// Orders placed at checkout. Design phase: no backend, they live in localStorage.
export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const orders = usePersisted(ordersStore);

  const placeOrder = useCallback((input: Omit<Order, "number" | "date">) => {
    const order: Order = {
      ...input,
      number: `WQ-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(),
    };
    ordersStore.set((prev) => [order, ...prev]);
    return order;
  }, []);

  const findOrder = useCallback(
    (number: string) => {
      const n = number.trim().toUpperCase().replace(/^#/, "");
      return orders.find((o) => o.number === n || o.number === `WQ-${n}`);
    },
    [orders],
  );

  const value = useMemo(() => ({ orders, placeOrder, findOrder }), [orders, placeOrder, findOrder]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used inside OrdersProvider");
  return ctx;
}
