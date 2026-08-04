import { useMemo, memo, useCallback } from "react";
import { POI } from "@/src/types";
import { Tooltip, Marker, Popup } from "react-leaflet";
import { CATEGORY_STYLES } from "../Map";
import { haversineDistance } from "@/src/helpers/haversineDistance";
import { getMarkerIcon } from "@/src/helpers/getMarkerIcon";
import { getWalkTimeStr } from "@/src/helpers/getWalkTimeStr";

interface PoiMarkerProps {
  poi: POI;
  isSelected: boolean;
  userLocation: [number, number] | null;
  onPoiSelect: (poi: POI) => void;
}

export const PoiMarker = memo(
  ({ poi, isSelected, userLocation, onPoiSelect }: PoiMarkerProps) => {
    const icon = useMemo(
      () => getMarkerIcon(poi.category, isSelected),
      [poi.category, isSelected],
    );

    const handleClick = useCallback(() => onPoiSelect(poi), [poi, onPoiSelect]);

    // Read real-time userLocation so selected marker details update on GPS ticks
    const dist = userLocation
      ? haversineDistance(userLocation, [poi.latitude, poi.longitude])
      : null;

    return (
      <Marker
        position={[poi.latitude, poi.longitude]}
        icon={icon}
        eventHandlers={{ click: handleClick }}
      >
        <Tooltip
          direction="top"
          offset={[0, -25]}
          opacity={1}
          className="!bg-transparent !border-none !shadow-none pointer-events-none z-[1000]"
        >
          <div className="flex flex-col items-center gap-1.5 border border-zinc-200 rounded-2xl px-3 py-2.5 shadow-2xl transition-all duration-300 bg-white text-zinc-800 max-w-[200px] text-center">
            <span className="font-extrabold text-xs leading-snug text-zinc-900">
              {poi.name}
            </span>
            <div className="flex items-center gap-1 justify-center">
              <span
                className={`w-2 h-2 rounded-full ${CATEGORY_STYLES[poi.category]?.bg || CATEGORY_STYLES.Default.bg}`}
              ></span>
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-wider">
                {poi.category}
              </span>
            </div>
            {poi.description && (
              <p className="text-[9px] text-zinc-650 leading-relaxed border-t border-zinc-150 pt-1 w-full mt-0.5 line-clamp-2 font-medium">
                {poi.description}
              </p>
            )}
            {dist !== null && (
              <span className="text-[9px] text-amber-600 font-bold border-t border-zinc-150 w-full text-center pt-1 mt-0.5">
                {getWalkTimeStr(dist)}
              </span>
            )}
          </div>
        </Tooltip>
        <Popup className="custom-leaflet-popup">
          <div className="p-2.5 min-w-[180px] flex flex-col gap-2 font-sans text-zinc-900 bg-white">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${CATEGORY_STYLES[poi.category]?.bg || CATEGORY_STYLES.Default.bg}`}
              ></span>
              <span className="text-[10px] font-bold text-zinc-700 font-bold uppercase tracking-wider">
                {poi.category}
              </span>
            </div>
            <h3 className="font-extrabold text-zinc-900 text-sm leading-snug">
              {poi.name}
            </h3>
            {poi.description && (
              <p className="text-xs text-zinc-650 leading-normal">
                {poi.description}
              </p>
            )}
            {dist !== null && (
              <div className="flex items-center gap-1.5 mt-1 border-t border-zinc-100 pt-2 text-xs text-amber-600 font-bold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="w-3.5 h-3.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span>{getWalkTimeStr(dist)}</span>
              </div>
            )}
          </div>
        </Popup>
      </Marker>
    );
  },
);
