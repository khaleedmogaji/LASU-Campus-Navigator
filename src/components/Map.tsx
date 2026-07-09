import React, { useEffect, useState, useMemo, useCallback, memo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap, useMapEvents, Circle, Polyline, Polygon } from 'react-leaflet';
import L from 'leaflet';
import { POI } from '../types';
import 'leaflet/dist/leaflet.css';
import { GRAPH_NODES, GRAPH_EDGES } from '../lib/pathNetwork';

// Fix for default marker icons in Leaflet with React
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;


import { useNavigation } from '../context/NavigationContext';

function MapEvents({ onMapDrag }: { onMapDrag?: () => void }) {
  useMapEvents({
    dragstart: () => {
      onMapDrag?.();
    }
  });
  return null;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center[0] && center[1]) {
      map.setView(center, 18); // Zoom to level 18 when a POI is selected
    }
  }, [center[0], center[1], map]);
  return null;
}



export type MapStyle = 'voyager' | 'osm' | 'dark';

const MAP_LAYERS = {
  voyager: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
};

const MAP_ATTRIBUTIONS = {
  voyager: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  osm: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  dark: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
};

const MAP_SUBDOMAINS: Record<MapStyle, string[]> = {
  voyager: ['a', 'b', 'c', 'd'],
  osm: ['a', 'b', 'c'],
  dark: ['a', 'b', 'c', 'd'],
};



const CATEGORY_STYLES: Record<string, { bg: string; fill: string; ping: string }> = {
  Administrative: { bg: 'bg-amber-500', fill: '#f59e0b', ping: 'bg-amber-400' },
  'Lecture Theatre': { bg: 'bg-indigo-500', fill: '#6366f1', ping: 'bg-indigo-400' },
  Library: { bg: 'bg-violet-500', fill: '#8b5cf6', ping: 'bg-violet-400' },
  Sports: { bg: 'bg-emerald-500', fill: '#10b981', ping: 'bg-emerald-400' },
  Building: { bg: 'bg-blue-500', fill: '#3b82f6', ping: 'bg-blue-400' },
  Hostel: { bg: 'bg-rose-500', fill: '#f43f5e', ping: 'bg-rose-400' },
  Default: { bg: 'bg-slate-500', fill: '#64748b', ping: 'bg-slate-400' }
};

const haversineDistance = (coords1: [number, number], coords2: [number, number]): number => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371e3; // Earth radius in meters
  const lat1 = Number(coords1[0]);
  const lon1 = Number(coords1[1]);
  const lat2 = Number(coords2[0]);
  const lon2 = Number(coords2[1]);

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getWalkTimeStr = (distanceMeters: number) => {
  const mins = Math.max(1, Math.round(distanceMeters / 75)); // roughly 4.5 km/h walking speed
  if (distanceMeters < 1000) {
    return `${mins} min walk (${Math.round(distanceMeters)}m)`;
  } else {
    return `${mins} min walk (${(distanceMeters / 1000).toFixed(1)}km)`;
  }
};

const getMarkerIcon = (category: string, isSelected: boolean) => {
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.Default;
  let svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4 h-4 text-white"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;

  switch (category) {
    case 'Administrative':
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4.5 h-4.5 text-white"><path d="M2 22h20M12 2v4M4 6h16v16H4zm4 5h2v6H8zm6 0h2v6h-2z"/></svg>`;
      break;
    case 'Lecture Theatre':
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4.5 h-4.5 text-white"><path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c0 2 2.5 3 6 3s6-1 6-3v-5"/></svg>`;
      break;
    case 'Library':
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4.5 h-4.5 text-white"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10M6 14h10"/></svg>`;
      break;
    case 'Sports':
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4.5 h-4.5 text-white"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34M12 2a4 4 0 0 0-4 4v5c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V6a4 4 0 0 0-4-4Z"/></svg>`;
      break;
    case 'Building':
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4.5 h-4.5 text-white"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10"/></svg>`;
      break;
    case 'Hostel':
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4.5 h-4.5 text-white"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9M10 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>`;
      break;
  }

  const pulseHtml = isSelected
    ? `<div class="absolute -inset-4 ${style.ping} opacity-30 rounded-full animate-ping z-0"></div>
       <div class="absolute -inset-2 ${style.ping} opacity-20 rounded-full blur-md z-0"></div>`
    : '';

  const activeClass = isSelected ? 'scale-110 -translate-y-1.5 shadow-2xl' : 'hover:scale-110 hover:-translate-y-1.5 hover:drop-shadow-xl';

  return L.divIcon({
    className: 'custom-poi-marker',
    html: `
      <div class="relative flex flex-col items-center justify-center transition-all duration-300 ease-out transform ${activeClass}">
        ${pulseHtml}
        <div class="relative z-10 flex items-center justify-center drop-shadow-lg">
          <svg class="w-10 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" style="color: ${style.fill};"/>
          </svg>
          <div class="absolute top-2.5 w-5 h-5 flex items-center justify-center text-white z-20">
            ${svgIcon}
          </div>
        </div>
      </div>
    `,
    iconSize: [40, 48],
    iconAnchor: [20, 48],
  });
};

// ── Stable memoized per-POI marker ─────────────────────────────────────────────
// userLocationRef is a MutableRefObject — its .current updates silently without
// triggering a re-render, so memo() is never bypassed by GPS tick updates.
interface PoiMarkerProps {
  poi: POI;
  isSelected: boolean;
  userLocation: [number, number] | null;
  onPoiSelect: (poi: POI) => void;
}

const PoiMarker = memo(({ poi, isSelected, userLocation, onPoiSelect }: PoiMarkerProps) => {
  const icon = useMemo(
    () => getMarkerIcon(poi.category, isSelected),
    [poi.category, isSelected]
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
        <div className="flex flex-col items-center gap-1 border border-zinc-200 rounded-2xl px-3 py-2 shadow-2xl transition-all duration-300 bg-white text-zinc-800">
          <span className="font-bold text-xs leading-tight whitespace-nowrap">{poi.name}</span>
          <div className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${CATEGORY_STYLES[poi.category]?.bg || CATEGORY_STYLES.Default.bg}`}></span>
            <span className="text-[10px] font-semibold text-zinc-700 font-bold uppercase tracking-wider">{poi.category}</span>
          </div>
          {dist !== null && (
            <span className="text-[9px] text-amber-600 font-bold border-t border-zinc-200 w-full text-center pt-1 mt-0.5">
              {getWalkTimeStr(dist)}
            </span>
          )}
        </div>
      </Tooltip>
      <Popup className="custom-leaflet-popup">
        <div className="p-2.5 min-w-[180px] flex flex-col gap-2 font-sans text-zinc-900 bg-white">
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${CATEGORY_STYLES[poi.category]?.bg || CATEGORY_STYLES.Default.bg}`}></span>
            <span className="text-[10px] font-bold text-zinc-700 font-bold uppercase tracking-wider">{poi.category}</span>
          </div>
          <h3 className="font-extrabold text-zinc-900 text-sm leading-snug">{poi.name}</h3>
          {poi.description && (
            <p className="text-xs text-zinc-650 leading-normal">{poi.description}</p>
          )}
          {dist !== null && (
            <div className="flex items-center gap-1.5 mt-1 border-t border-zinc-100 pt-2 text-xs text-amber-600 font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              <span>{getWalkTimeStr(dist)}</span>
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
});
PoiMarker.displayName = 'PoiMarker';

interface PoiMarkersAndLabelsProps {
  filteredPois: POI[];
  selectedPoi: POI | null;
  onPoiSelect: (poi: POI) => void;
}

const PoiMarkersAndLabels = memo(({
  filteredPois,
  selectedPoi,
  onPoiSelect
}: PoiMarkersAndLabelsProps) => {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  const [bounds, setBounds] = useState(() => map.getBounds());

  useEffect(() => {
    const handleMapChange = () => {
      setZoom(map.getZoom());
      setBounds(map.getBounds());
    };
    map.on('zoomend', handleMapChange);
    map.on('moveend', handleMapChange);
    return () => {
      map.off('zoomend', handleMapChange);
      map.off('moveend', handleMapChange);
    };
  }, [map]);

  const getPriority = useCallback((poi: POI): number => {
    const name = (poi.name || '').toLowerCase();
    if (name.includes('senate') || name.includes('library complex')) return 5;
    if (name.includes('faculty') || name.includes('school of')) return 4;
    if (poi.category === 'Administrative' || poi.category === 'Library') return 3;
    if (poi.category === 'Sports' || poi.category === 'Lecture Theatre') return 2;
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
    const candidatePois = filteredPois.filter(p => {
      if (selectedPoi && p.id === selectedPoi.id) return false;
      // Frustum culling: only process and render points inside map bounds
      return bounds.contains(L.latLng(p.latitude, p.longitude));
    });
    const sortedPois = [...candidatePois].sort((a, b) => getPriority(b) - getPriority(a));

    for (const poi of sortedPois) {
      let hasOverlap = false;
      for (const chosen of result) {
        const dist = haversineDistance(
          [poi.latitude, poi.longitude],
          [chosen.latitude, chosen.longitude]
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
      {labelsToRender.map(poi => {
        const catStyle = CATEGORY_STYLES[poi.category] || CATEGORY_STYLES.Default;
        const labelIcon = L.divIcon({
          className: 'custom-building-label-marker',
          html: `
            <div class="flex flex-col items-center justify-center pointer-events-auto cursor-pointer group">
              <div class="w-2 h-2 rounded-full ${catStyle.bg} border border-white shadow-md transition-all duration-300 group-hover:scale-130"></div>
              <div class="text-[9.5px] font-black text-zinc-800 dark:text-zinc-200 drop-shadow-sm whitespace-nowrap bg-white/95 dark:bg-zinc-900/95 border border-zinc-200/80 dark:border-zinc-800/80 px-2 py-0.5 rounded-md mt-0.5 pointer-events-none transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.1)] group-hover:bg-lasu-primary group-hover:text-white group-hover:border-lasu-primary">${poi.name}</div>
            </div>
          `,
          iconSize: [125, 32],
          iconAnchor: [62, 6]
        });

        return (
          <Marker
            key={`label-${poi.id}`}
            position={[poi.latitude, poi.longitude]}
            icon={labelIcon}
            eventHandlers={{
              click: () => onPoiSelect(poi)
            }}
          />
        );
      })}
    </>
  );
});
PoiMarkersAndLabels.displayName = 'PoiMarkersAndLabels';

function FocusedView({ coordinate }: { coordinate: [number, number] | null | undefined }) {
  const map = useMap();
  useEffect(() => {
    if (coordinate) {
      map.flyTo(coordinate, 18);
    }
  }, [coordinate, map]);
  return null;
}

function RouteBoundsFitter({ coordinates }: { coordinates: any[] | null | undefined }) {
  const map = useMap();
  useEffect(() => {
    if (coordinates && coordinates.length > 0) {
      try {
        const bounds = L.latLngBounds(
          coordinates.map(c => {
            if (Array.isArray(c)) {
              return L.latLng(Number(c[0]), Number(c[1]));
            }
            if (c && typeof c === 'object') {
              const lat = c.lat !== undefined ? c.lat : c.latitude;
              const lng = c.lng !== undefined ? c.lng : c.longitude;
              if (lat !== undefined && lng !== undefined) {
                return L.latLng(Number(lat), Number(lng));
              }
            }
            return L.latLng(c);
          })
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

function SelectedBuilding3D({ lat: rawLat, lng: rawLng, category }: { lat: number; lng: number; category: string }) {
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
  let baseColor = '#b88114'; // Gold
  let wallColor1 = '#92620b'; // darker gold
  let wallColor2 = '#714b05'; // darkest gold
  let roofColor = '#e5a93c'; // bright gold

  if (category === 'Library') {
    baseColor = '#7c3aed'; // Purple
    wallColor1 = '#6d28d9';
    wallColor2 = '#5b21b6';
    roofColor = '#8b5cf6';
  } else if (category === 'Building') {
    baseColor = '#2563eb'; // Blue
    wallColor1 = '#1d4ed8';
    wallColor2 = '#1e40af';
    roofColor = '#3b82f6';
  } else if (category === 'Lecture Theatre') {
    baseColor = '#4f46e5'; // Indigo
    wallColor1 = '#4338ca';
    wallColor2 = '#3730a3';
    roofColor = '#6366f1';
  } else if (category === 'Sports') {
    baseColor = '#059669'; // Green
    wallColor1 = '#047857';
    wallColor2 = '#065f46';
    roofColor = '#10b981';
  }

  return (
    <>
      {/* 3D ground shadow */}
      <Polygon
        positions={[BL, TL, TR, BR]}
        pathOptions={{
          color: '#000000',
          weight: 0,
          fillColor: '#000000',
          fillOpacity: 0.2
        }}
      />
      {/* West Wall */}
      <Polygon
        positions={[BL, TL, R_TL, R_BL]}
        pathOptions={{
          color: wallColor2,
          weight: 1,
          fillColor: wallColor2,
          fillOpacity: 0.8
        }}
      />
      {/* South Wall */}
      <Polygon
        positions={[BL, BR, R_BR, R_BL]}
        pathOptions={{
          color: wallColor1,
          weight: 1,
          fillColor: wallColor1,
          fillOpacity: 0.85
        }}
      />
      {/* East Wall */}
      <Polygon
        positions={[BR, TR, R_TR, R_BR]}
        pathOptions={{
          color: baseColor,
          weight: 1,
          fillColor: baseColor,
          fillOpacity: 0.75
        }}
      />
      {/* Roof */}
      <Polygon
        positions={[R_BL, R_TL, R_TR, R_BR]}
        pathOptions={{
          color: roofColor,
          weight: 1.5,
          fillColor: roofColor,
          fillOpacity: 0.95
        }}
      />
    </>
  );
}

export const CampusMap: React.FC = memo(() => {
  const {
    pois,
    filterCategory,
    selectedPoi,
    handlePoiSelect: onPoiSelect,
    userLocation,
    locationAccuracy,
    isLocating,
    userHeading,
    routingTo,
    routingFrom,
    mapStyle,
    focusedCoordinate,
    routeInfo,
    handleMapDrag: onMapDrag,
    searchQuery,
  } = useNavigation();

  const routeCoordinates = routeInfo?.coordinates;
  const defaultCenter: [number, number] = [6.4664, 3.2003]; // LASU Ojo Campus Center
  const campusBounds: L.LatLngBoundsExpression = [
    [6.4550, 3.1900], // South-West (expanded to cover Faculty of Social Sciences)
    [6.4820, 3.2100]  // North-East (expanded to cover International School)
  ];

  const [traversedPath, setTraversedPath] = useState<L.LatLng[]>([]);
  const [showDebugGraph, setShowDebugGraph] = useState(false);

  // Sync userLocation into a ref so GPS ticks never cause PoiMarker re-renders
  const userLocationRef = useRef<[number, number] | null>(userLocation);
  useEffect(() => {
    userLocationRef.current = userLocation;
  }, [userLocation]);

  useEffect(() => {
    if (userLocation && routeCoordinates && routeCoordinates.length > 0) {
      let minDistance = Infinity;
      let closestIndex = 0;
      const userLatLng = L.latLng(userLocation[0], userLocation[1]);

      routeCoordinates.forEach((coord, index) => {
        const distance = userLatLng.distanceTo(coord);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      if (minDistance < 50) {
        setTraversedPath(routeCoordinates.slice(0, closestIndex + 1));
      } else {
        setTraversedPath([]);
      }
    } else {
      setTraversedPath([]);
    }
  }, [userLocation, routeCoordinates]);

  // Memoize so filter changes don't recreate the array on unrelated state updates
  const filteredPois = useMemo(() => {
    const hasCategoryFilter = filterCategory !== 'All';
    const hasSearchQuery = searchQuery && searchQuery.trim() !== '';

    // Start with all POIs by default
    let result = pois;

    // Filter by category if category selection is active
    if (hasCategoryFilter) {
      result = result.filter(poi => poi.category === filterCategory);
    }

    // Filter by search query if active
    if (hasSearchQuery) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(poi => 
        poi.name.toLowerCase().includes(q) ||
        poi.category.toLowerCase().includes(q) ||
        poi.tags?.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // Initialize set with matching POIs
    const activePois = new Set<POI>(result);

    // Always ensure selected POI and routing end points remain visible
    if (selectedPoi) {
      const match = pois.find(p => p.id === selectedPoi.id);
      if (match) activePois.add(match);
    }

    if (routingTo) {
      const matchTo = pois.find(p => p.id === routingTo.id);
      if (matchTo) activePois.add(matchTo);
    }

    if (routingFrom) {
      const matchFrom = pois.find(p => p.id === routingFrom.id);
      if (matchFrom) activePois.add(matchFrom);
    }

    return Array.from(activePois);
  }, [pois, filterCategory, searchQuery, selectedPoi, routingTo, routingFrom]);

  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-inner border border-zinc-200 bg-zinc-50 relative">
      {isLocating && (
        <div className="absolute inset-0 z-[2000] bg-white/70 flex items-center justify-center">
          <div className="bg-white px-6 py-4 rounded-3xl shadow-2xl border border-zinc-200 flex items-center gap-4">
            <div className="w-5 h-5 border-2 border-lasu-primary/20 border-t-lasu-primary rounded-full animate-spin"></div>
            <span className="text-sm font-bold text-zinc-700">Locating you...</span>
          </div>
        </div>
      )}
      <MapContainer
        center={defaultCenter}
        zoom={16}
        minZoom={16}
        maxBounds={campusBounds}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <FocusedView coordinate={focusedCoordinate} />
        <MapEvents 
          onMapDrag={onMapDrag} 
        />
        <TileLayer
          key={mapStyle}
          attribution={MAP_ATTRIBUTIONS[mapStyle]}
          url={MAP_LAYERS[mapStyle]}
          subdomains={MAP_SUBDOMAINS[mapStyle]}
          maxZoom={20}
        />
        
        {traversedPath.length > 0 && (
          <Polyline positions={traversedPath} color="#2563eb" weight={10} opacity={0.8} />
        )}
        
        <PoiMarkersAndLabels
          filteredPois={filteredPois}
          selectedPoi={selectedPoi}
          onPoiSelect={onPoiSelect}
        />

        {selectedPoi && (
          <PoiMarker
            key={`selected-${selectedPoi.id}`}
            poi={selectedPoi}
            isSelected={true}
            userLocation={userLocation}
            onPoiSelect={onPoiSelect}
          />
        )}

        {userLocation && (
          <>
            <Marker
              position={userLocation}
              zIndexOffset={1000}
              icon={L.divIcon({
                className: 'user-location-marker-container',
                html: `
                  <div class="relative w-16 h-16 flex items-center justify-center">
                    ${userHeading !== undefined && userHeading !== null ? `
                      <div class="absolute inset-0 flex items-center justify-center z-10" style="transform: rotate(${userHeading}deg); transition: transform 0.3s ease-out; transform-origin: center; will-change: transform;">
                        <svg viewBox="0 0 64 64" class="w-16 h-16 overflow-visible pointer-events-none">
                          <defs>
                            <radialGradient id="beam-grad" gradientUnits="userSpaceOnUse" cx="32" cy="32" r="30">
                              <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.4" />
                              <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
                            </radialGradient>
                          </defs>
                          <path d="M32 32 L17 6 A30 30 0 0 1 47 6 Z" fill="url(#beam-grad)" />
                        </svg>
                      </div>
                    ` : ''}
                    <div class="absolute w-5 h-5 bg-blue-500 rounded-full border-4 border-white shadow-lg z-20"></div>
                    <div class="absolute w-9 h-9 bg-blue-500/20 rounded-full animate-pulse z-0" style="will-change: opacity;"></div>
                  </div>
                `,
                iconSize: [64, 64],
                iconAnchor: [32, 32],
              })}
            >
              <Popup>You are here</Popup>
            </Marker>
            {locationAccuracy && (
              <Circle 
                center={userLocation} 
                radius={Math.min(locationAccuracy, 50)} 
                pathOptions={{ 
                  color: '#3b82f6', 
                  fillColor: '#3b82f6', 
                  fillOpacity: 0.15, 
                  weight: 1,
                  dashArray: '5, 5'
                }} 
              />
            )}
          </>
        )}


        {selectedPoi && (
          <SelectedBuilding3D 
            lat={selectedPoi.latitude} 
            lng={selectedPoi.longitude} 
            category={selectedPoi.category} 
          />
        )}

        {selectedPoi && !routingTo && (
          <ChangeView center={[selectedPoi.latitude, selectedPoi.longitude]} />
        )}

        {routingTo && routeInfo && routeInfo.coordinates && (
          <>
            <RouteBoundsFitter coordinates={routeInfo.coordinates} />
            <Polyline
              positions={routeInfo.coordinates}
              pathOptions={{
                color: '#ea580c',
                weight: 7,
                opacity: 0.95,
                className: 'route-polyline-shadow'
              }}
            />
          </>
        )}

        {showDebugGraph && (
          <>
            {/* Draw all walkway edges */}
            {GRAPH_EDGES.map((edge, idx) => {
              const fromNode = GRAPH_NODES.find(n => n.id === edge.from);
              const toNode = GRAPH_NODES.find(n => n.id === edge.to);
              if (fromNode && toNode) {
                return (
                  <Polyline
                    key={`edge-${idx}`}
                    positions={[
                      [fromNode.lat, fromNode.lng],
                      [toNode.lat, toNode.lng]
                    ]}
                    pathOptions={{
                      color: '#6366f1',
                      weight: 2,
                      opacity: 0.55,
                      dashArray: '3, 6'
                    }}
                  />
                );
              }
              return null;
            })}

            {/* Draw all walkway nodes */}
            {GRAPH_NODES.map((node) => {
              const isStartNode = routeInfo?.debugStartNodeId === node.id;
              const isEndNode = routeInfo?.debugEndNodeId === node.id;
              const isPathNode = routeInfo?.debugPathNodeIds?.includes(node.id);

              let color = '#71717a';
              let radius = 3;
              let fillOpacity = 0.6;

              if (isStartNode) {
                color = '#22c55e';
                radius = 7;
                fillOpacity = 0.95;
              } else if (isEndNode) {
                color = '#ef4444';
                radius = 7;
                fillOpacity = 0.95;
              } else if (isPathNode) {
                color = '#ea580c';
                radius = 5.5;
                fillOpacity = 0.9;
              }

              return (
                <Circle
                  key={`node-${node.id}`}
                  center={[node.lat, node.lng]}
                  radius={radius}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity,
                    weight: isStartNode || isEndNode ? 2.5 : 1
                  }}
                >
                  <Tooltip direction="top" opacity={0.9} className="font-sans text-[9px] font-bold">
                    <span>Node {node.id}</span>
                  </Tooltip>
                </Circle>
              );
            })}
          </>
        )}
      </MapContainer>

      {/* Dijkstra Graph Debugger Button */}
      <button
        onClick={() => setShowDebugGraph(!showDebugGraph)}
        className="absolute bottom-6 left-6 z-[2000] p-2.5 bg-white hover:bg-zinc-100 text-zinc-800 font-bold text-[10px] uppercase tracking-wider rounded-xl border border-zinc-200 shadow-md flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        title="Toggle Dijkstra Graph Debugger"
      >
        <span className={`w-2 h-2 rounded-full ${showDebugGraph ? 'bg-green-500 animate-pulse' : 'bg-zinc-400'}`}></span>
        <span>Graph Debug</span>
      </button>
    </div>
  );
});

CampusMap.displayName = 'CampusMap';
