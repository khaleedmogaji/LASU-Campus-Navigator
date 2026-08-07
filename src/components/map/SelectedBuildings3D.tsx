import { Polygon } from "react-leaflet";

export function SelectedBuilding3D({
  lat: rawLat,
  lng: rawLng,
  category,
}: {
  lat: number;
  lng: number;
  category: string;
}) {
  const lat = Number(rawLat);
  const lng = Number(rawLng);
  // Size parameters for the isometric projection
  const size = 0.00007; // building footprint radius in degrees
  const height = 0.00006; // vertical extrusion offset

  // Base footprint corners (BL: Bottom-Left, TL: Top-Left, TR: Top-Right, BR: Bottom-Right)
  const BL: [number, number] = [lat - size, lng - size * 1.2];
  const TL: [number, number] = [lat + size, lng - size * 1.2];
  const TR: [number, number] = [lat + size, lng + size * 1.2];
  const BR: [number, number] = [lat - size, lng + size * 1.2];

  // Roof corners (offset upwards and rightwards to simulate 3D projection)
  const R_BL: [number, number] = [BL[0] + height, BL[1] + height * 0.8];
  const R_TL: [number, number] = [TL[0] + height, TL[1] + height * 0.8];
  const R_TR: [number, number] = [TR[0] + height, TR[1] + height * 0.8];
  const R_BR: [number, number] = [BR[0] + height, BR[1] + height * 0.8];

  // Default color scheme (orange for Admin / other)
  let baseColor = "#b88114"; // Gold
  let wallColor1 = "#92620b"; // darker gold
  let wallColor2 = "#714b05"; // darkest gold
  let roofColor = "#e5a93c"; // bright gold

  if (category === "Library") {
    baseColor = "#7c3aed"; // Purple
    wallColor1 = "#6d28d9";
    wallColor2 = "#5b21b6";
    roofColor = "#8b5cf6";
  } else if (category === "Building") {
    baseColor = "#2563eb"; // Blue
    wallColor1 = "#1d4ed8";
    wallColor2 = "#1e40af";
    roofColor = "#3b82f6";
  } else if (category === "Lecture Theatre") {
    baseColor = "#4f46e5"; // Indigo
    wallColor1 = "#4338ca";
    wallColor2 = "#3730a3";
    roofColor = "#6366f1";
  } else if (category === "Sports") {
    baseColor = "#059669"; // Green
    wallColor1 = "#047857";
    wallColor2 = "#065f46";
    roofColor = "#10b981";
  }

  return (
    <>
      {/* 3D ground shadow */}
      <Polygon
        positions={[BL, TL, TR, BR]}
        pathOptions={{
          color: "#000000",
          weight: 0,
          fillColor: "#000000",
          fillOpacity: 0.2,
        }}
      />
      {/* West Wall */}
      <Polygon
        positions={[BL, TL, R_TL, R_BL]}
        pathOptions={{
          color: wallColor2,
          weight: 1,
          fillColor: wallColor2,
          fillOpacity: 0.8,
        }}
      />
      {/* South Wall */}
      <Polygon
        positions={[BL, BR, R_BR, R_BL]}
        pathOptions={{
          color: wallColor1,
          weight: 1,
          fillColor: wallColor1,
          fillOpacity: 0.85,
        }}
      />
      {/* East Wall */}
      <Polygon
        positions={[BR, TR, R_TR, R_BR]}
        pathOptions={{
          color: baseColor,
          weight: 1,
          fillColor: baseColor,
          fillOpacity: 0.75,
        }}
      />
      {/* Roof */}
      <Polygon
        positions={[R_BL, R_TL, R_TR, R_BR]}
        pathOptions={{
          color: roofColor,
          weight: 1.5,
          fillColor: roofColor,
          fillOpacity: 0.95,
        }}
      />
    </>
  );
}
