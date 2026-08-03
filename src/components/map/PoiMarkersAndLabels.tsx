import { useEffect, useCallback, useState, memo, useMemo } from "react";
import { useMap } from "react-leaflet";
import { Marker, Tooltip } from "react-leaflet";
import { POI } from "@/src/types";
import { haversineDistance } from "@/src/helpers/haversineDistance";
import { CATEGORY_STYLES } from "../Map";
import L from "leaflet";

interface PoiMarkersAndLabelsProps {
  filteredPois: POI[];
  selectedPoi: POI | null;
  onPoiSelect: (poi: POI) => void;
}

export const PoiMarkersAndLabels = memo(
  ({ filteredPois, selectedPoi, onPoiSelect }: PoiMarkersAndLabelsProps) => {
    const map = useMap();
    const [zoom, setZoom] = useState(map.getZoom());
    const [bounds, setBounds] = useState(() => map.getBounds());

    useEffect(() => {
      const handleMapChange = () => {
        setZoom(map.getZoom());
        setBounds(map.getBounds());
      };
      map.on("zoomend", handleMapChange);
      map.on("moveend", handleMapChange);
      return () => {
        map.off("zoomend", handleMapChange);
        map.off("moveend", handleMapChange);
      };
    }, [map]);

    const getPriority = useCallback((poi: POI): number => {
      const name = (poi.name || "").toLowerCase();
      if (name.includes("senate") || name.includes("library complex")) return 5;
      if (name.includes("faculty") || name.includes("school of")) return 4;
      if (poi.category === "Administrative" || poi.category === "Library")
        return 3;
      if (poi.category === "Sports" || poi.category === "Lecture Theatre")
        return 2;
      return 1;
    }, []);

    const labelsToRender = useMemo(() => {
      if (zoom < 16) return [];

      let minDist = 0;
      if (zoom <= 16) minDist = 75;
      else if (zoom === 17) minDist = 40;
      else if (zoom === 18) minDist = 20;
      else minDist = 10;

      const result: POI[] = [];
      const candidatePois = filteredPois.filter((p) => {
        if (selectedPoi && p.id === selectedPoi.id) return false;
        // Frustum culling: only process and render points inside map bounds
        return bounds.contains(L.latLng(p.latitude, p.longitude));
      });
      const sortedPois = [...candidatePois].sort(
        (a, b) => getPriority(b) - getPriority(a),
      );

      for (const poi of sortedPois) {
        let hasOverlap = false;
        for (const chosen of result) {
          const dist = haversineDistance(
            [poi.latitude, poi.longitude],
            [chosen.latitude, chosen.longitude],
          );
          if (dist < minDist) {
            hasOverlap = true;
            break;
          }
        }
        if (!hasOverlap) {
          result.push(poi);
        }
      }
      return result;
    }, [filteredPois, selectedPoi, zoom, bounds, getPriority]);

    return (
      <>
        {labelsToRender.map((poi) => {
          const catStyle =
            CATEGORY_STYLES[poi.category] || CATEGORY_STYLES.Default;
          const labelIcon = L.divIcon({
            className: "custom-building-label-dot",
            html: `
            <div class="flex flex-col items-center justify-center pointer-events-none select-none">
              <div class="w-2.5 h-2.5 rounded-full ${catStyle.bg} border-2 border-white shadow-md transition-all duration-300 pointer-events-auto cursor-pointer group-hover:scale-130"></div>
              ${
                zoom >= 17
                  ? `
                <div class="modern-map-label mt-0.5 whitespace-nowrap">
                  ${poi.name}
                </div>
              `
                  : ""
              }
            </div>
          `,
            iconSize: zoom >= 17 ? [140, 24] : [12, 12],
            iconAnchor: zoom >= 17 ? [70, 5] : [6, 6],
          });

          return (
            <Marker
              key={`label-${poi.id}`}
              position={[poi.latitude, poi.longitude]}
              icon={labelIcon}
              eventHandlers={{
                click: () => onPoiSelect(poi),
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -5]}
                opacity={1}
                className="!bg-transparent !border-none !shadow-none pointer-events-none z-[1000]"
              >
                <div className="flex flex-col items-center gap-1.5 border border-zinc-200 rounded-2xl px-3 py-2.5 shadow-2xl transition-all duration-300 bg-white text-zinc-800 max-w-[200px] text-center">
                  <span className="font-extrabold text-xs leading-snug text-zinc-900">
                    {poi.name}
                  </span>
                  <div className="flex items-center gap-1 justify-center">
                    <span
                      className={`w-2 h-2 rounded-full ${catStyle.bg}`}
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
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </>
    );
  },
);
