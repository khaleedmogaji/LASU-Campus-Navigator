import React, { createContext, useContext } from 'react';
import { POI } from '../types';
import { SheetSnap } from '../components/MobileBottomSheet';

export interface NavigationContextType {
  pois: POI[];
  filterCategory: string;
  setFilterCategory: (cat: string) => void;
  selectedPoi: POI | null;
  setSelectedPoi: (poi: POI | null) => void;
  userLocation: [number, number] | null;
  setUserLocation: (loc: [number, number] | null) => void;
  locationAccuracy: number | null;
  setLocationAccuracy: (acc: number | null) => void;
  isLocating: boolean;
  setIsLocating: (locating: boolean) => void;
  userHeading: number | null;
  setUserHeading: (heading: number | null) => void;
  routingTo: POI | null;
  setRoutingTo: (poi: POI | null) => void;
  routingFrom: POI | null;
  setRoutingFrom: (poi: POI | null) => void;
  mapStyle: 'voyager' | 'osm' | 'dark';
  setMapStyle: (style: 'voyager' | 'osm' | 'dark') => void;
  focusedCoordinate: [number, number] | null;
  setFocusedCoordinate: (coord: [number, number] | null) => void;
  routeInfo: any;
  setRouteInfo: (info: any) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  sheetSnap: SheetSnap;
  setSheetSnap: (snap: SheetSnap) => void;
  isLocatingState: boolean;
  isOffline: boolean;
  handlePoiSelect: (poi: POI) => void;
  handleMapDrag: () => void;
  isRoutePlannerOpen: boolean;
  setIsRoutePlannerOpen: (open: boolean) => void;
  routingMode: 'gps' | 'landmark';
  setRoutingMode: (mode: 'gps' | 'landmark') => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ value: NavigationContextType; children: React.ReactNode }> = ({ value, children }) => {
  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
