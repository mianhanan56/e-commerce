"use client";

import { createContext, useContext, useMemo } from "react";
import type { Catalog, Product } from "@/data/catalog";

type CatalogState = Catalog & { getProduct: (id: string) => Product | undefined };

const CatalogContext = createContext<CatalogState | null>(null);

// The catalogue is small (tens of watches), so StoreShell fetches it once on the server and
// hands it to client components: cart, wishlist, search and shop filters.
export function CatalogProvider({
  catalog,
  children,
}: {
  catalog: Catalog;
  children: React.ReactNode;
}) {
  const value = useMemo(() => {
    const byId = new Map(catalog.products.map((p) => [p.id, p]));
    return { ...catalog, getProduct: (id: string) => byId.get(id) };
  }, [catalog]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used inside CatalogProvider");
  return ctx;
}
