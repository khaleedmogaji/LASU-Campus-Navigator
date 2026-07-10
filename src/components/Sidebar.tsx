import React from 'react';
import { POI } from '../types';
import { RoutePlannerPanel } from './RoutePlannerPanel';
import { HomePanelContent } from './HomePanelContent';

const POIInfo = React.lazy(() => import('./POIInfo').then(m => ({ default: m.POIInfo })));

interface SidebarProps {
  routingTo: POI | null;
  setRoutingTo: (poi: POI | null) => void;
  routingFrom: POI | null;
  setRoutingFrom: (poi: POI | null) => void;
  selectedPoi: POI | null;
  setSelectedPoi: (poi: POI | null) => void;
  userLocation: [number, number] | null;
  shareLocation: (poi: POI) => void;

  // RoutePlannerPanel props
  routeInfo: any;
  setRouteInfo: (info: any | null) => void;
  startSearchQuery: string;
  setStartSearchQuery: (query: string) => void;
  endSearchQuery: string;
  setEndSearchQuery: (query: string) => void;
  isStartDropdownOpen: boolean;
  setIsStartDropdownOpen: (open: boolean) => void;
  isEndDropdownOpen: boolean;
  setIsEndDropdownOpen: (open: boolean) => void;
  filteredStartPois: POI[];
  filteredEndPois: POI[];
  handleSwapRoute: () => void;
  setIsSimulated: (sim: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  routingTo,
  setRoutingTo,
  routingFrom,
  setRoutingFrom,
  selectedPoi,
  setSelectedPoi,
  userLocation,
  shareLocation,
  routeInfo,
  setRouteInfo,
  startSearchQuery,
  setStartSearchQuery,
  endSearchQuery,
  setEndSearchQuery,
  isStartDropdownOpen,
  setIsStartDropdownOpen,
  isEndDropdownOpen,
  setIsEndDropdownOpen,
  filteredStartPois,
  filteredEndPois,
  handleSwapRoute,
  setIsSimulated,
}) => {
  return (
    <aside className="hidden lg:flex w-80 border-r border-zinc-200 bg-white flex-col shrink-0">
      {routingTo ? (
        <RoutePlannerPanel
          routingTo={routingTo}
          setRoutingTo={setRoutingTo}
          routingFrom={routingFrom}
          setRoutingFrom={setRoutingFrom}
          routeInfo={routeInfo}
          setRouteInfo={setRouteInfo}
          startSearchQuery={startSearchQuery}
          setStartSearchQuery={setStartSearchQuery}
          endSearchQuery={endSearchQuery}
          setEndSearchQuery={setEndSearchQuery}
          isStartDropdownOpen={isStartDropdownOpen}
          setIsStartDropdownOpen={setIsStartDropdownOpen}
          isEndDropdownOpen={isEndDropdownOpen}
          setIsEndDropdownOpen={setIsEndDropdownOpen}
          filteredStartPois={filteredStartPois}
          filteredEndPois={filteredEndPois}
          handleSwapRoute={handleSwapRoute}
          setIsSimulated={setIsSimulated}
        />
      ) : selectedPoi ? (
        <React.Suspense fallback={<div className="p-6 text-center text-xs text-zinc-500 font-semibold bg-white flex-1 flex items-center justify-center">Loading details...</div>}>
          <POIInfo 
            poi={selectedPoi} 
            userLocation={userLocation}
            onClose={() => {
              setSelectedPoi(null);
              setRoutingTo(null);
            }}
            onGetDirections={(poi) => {
              setRoutingTo(poi);
              setRoutingFrom(null);
              setSelectedPoi(null);
            }} 
            onShare={shareLocation}
            isSidebar={true}
          />
        </React.Suspense>
      ) : (
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto scrollbar-hide">
          <HomePanelContent isMobile={false} />
        </div>
      )}
    </aside>
  );
};
