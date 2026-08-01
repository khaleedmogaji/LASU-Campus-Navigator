import { create } from "zustand";
import { POI } from "../src/types";

interface AppState {
  // Domain data — loaded once, read from both routes
  pois: POI[];
  setPois: (pois: POI[]) => void;
  selectedPoi: POI | null;
  setSelectedPoi: (poi: POI | null) => void;

  routingTo: POI | null;
  setRoutingTo: (poi: POI | null) => void;

  routingFrom: POI | null;
  setRoutingFrom: (poi: POI | null) => void;

  filterCategory: string;
  setFilterCategory: (category: string) => void;

  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;

  isRoutePlannerOpen: boolean;
  setIsRoutePlannerOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  pois: [],
  setPois: (pois) => set({ pois }),

  selectedPoi: null,
  setSelectedPoi: (poi) => set({ selectedPoi: poi }),

  routingTo: null,
  setRoutingTo: (poi) => set({ routingTo: poi }),

  routingFrom: null,
  setRoutingFrom: (poi) => set({ routingFrom: poi }),

  filterCategory: "All",
  setFilterCategory: (category) => set({ filterCategory: category }),

  isAssistantOpen: false,
  setIsAssistantOpen: (open) => set({ isAssistantOpen: open }),

  isRoutePlannerOpen: false,
  setIsRoutePlannerOpen: (open) => set({ isRoutePlannerOpen: open }),
}));
