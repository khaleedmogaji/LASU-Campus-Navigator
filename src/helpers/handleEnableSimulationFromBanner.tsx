import { POI } from "../types";
import { SheetSnap } from "../components/MobileBottomSheet";

export const GATE_LOCATION: [number, number] = [6.4642, 3.1972];

interface EnableSimulationFromBannerProps {
  setIsSimulated: (value: boolean) => void;
  setUserLocation: (loc: [number, number]) => void;
  setLocationAccuracy: (value: number | null) => void;
  setSelectedPoi: (poi: POI) => void;
  setIsUserOffCampus: (value: boolean) => void;
}

export const handleEnableSimulationFromBanner = ({
  setIsSimulated,
  setUserLocation,
  setLocationAccuracy,
  setSelectedPoi,
  setIsUserOffCampus,
}: EnableSimulationFromBannerProps) => {
  setIsSimulated(true);
  setUserLocation(GATE_LOCATION);
  setLocationAccuracy(null);
  setSelectedPoi({
    id: "simulated-location",
    name: "Simulated Location (Gate)",
    latitude: GATE_LOCATION[0],
    longitude: GATE_LOCATION[1],
    category: "Other",
    description: "Simulated position for testing navigation.",
  });
  setIsUserOffCampus(false);
};

interface PoiSelectProps {
  poi: POI;
  setSelectedPoi: (poi: POI) => void;
  setRoutingTo: (poi: POI | null) => void;
  setSheetSnap: (snap: SheetSnap) => void;
}

export const handlePoiSelect = ({
  poi,
  setSelectedPoi,
  setRoutingTo,
  setSheetSnap,
}: PoiSelectProps) => {
  setSelectedPoi(poi);
  setRoutingTo(null);
  if (window.innerWidth < 1024) {
    setSheetSnap("half");
  }
};

interface MapDragProps {
  setFollowMe: (value: boolean) => void;
}

export const handleMapDrag = ({ setFollowMe }: MapDragProps) => {
  setFollowMe(false);
};
