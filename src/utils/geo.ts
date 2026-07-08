import { getDistance } from '../lib/pathNetwork';

export const CAMPUS_POLYGON: [number, number][] = [
  [6.4610, 3.1960], // South-West (near Main Gate)
  [6.4610, 3.2090], // South-East (near main road/banks)
  [6.4720, 3.2090], // Mid-East (near FSS/ODLRI)
  [6.4820, 3.2050], // North-East (near Igando path)
  [6.4930, 3.1950], // Far North (near Staff Quarters/Isheri Road Gate)
  [6.4750, 3.1880], // Mid-West
  [6.4680, 3.1880], // South-West corner
  [6.4630, 3.1920]  // Connecting back
];

export function isPointInPolygon(point: [number, number], polygon: [number, number][]): boolean {
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export function getMinDistanceToRoute(lat: number, lng: number, routeCoords: { lat: number; lng: number }[]): number {
  if (!routeCoords || routeCoords.length === 0) return Infinity;
  let minDist = Infinity;
  for (const coord of routeCoords) {
    const d = getDistance(lat, lng, coord.lat, coord.lng);
    if (d < minDist) {
      minDist = d;
    }
  }
  return minDist;
}
