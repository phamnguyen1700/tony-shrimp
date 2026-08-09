"use client";

import { create } from "zustand";
import type { CatalogOptions } from "@/types/shrimp";

interface ShrimpOptionsState {
  catalogOptions: CatalogOptions | null;
  ownerCatalogOptions: CatalogOptions | null;
  setCatalogOptions: (options: CatalogOptions) => void;
  setOwnerCatalogOptions: (options: CatalogOptions) => void;
}

export const useShrimpOptionsStore = create<ShrimpOptionsState>((set) => ({
  catalogOptions: null,
  ownerCatalogOptions: null,
  setCatalogOptions: (catalogOptions) => set({ catalogOptions }),
  setOwnerCatalogOptions: (ownerCatalogOptions) => set({ ownerCatalogOptions }),
}));
