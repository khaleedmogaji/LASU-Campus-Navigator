import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

export function RouteBoundsFitter({
  coordinates,
}: {
  coordinates: any[] | null | undefined;
}) {
  const map = useMap();
  useEffect(() => {
    if (coordinates && coordinates.length > 0) {
      try {
        const bounds = L.latLngBounds(
          coordinates.map((c) => {
            if (Array.isArray(c)) {
              return L.latLng(Number(c[0]), Number(c[1]));
            }
            if (c && typeof c === "object") {
              const lat = c.lat !== undefined ? c.lat : c.latitude;
              const lng = c.lng !== undefined ? c.lng : c.longitude;
              if (lat !== undefined && lng !== undefined) {
                return L.latLng(Number(lat), Number(lng));
              }
            }
            return L.latLng(c);
          }),
        );
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      } catch (err) {
        console.error("Error in RouteBoundsFitter:", err);
      }
    }
  }, [coordinates, map]);
  return null;
}
