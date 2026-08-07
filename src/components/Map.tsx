import React, { useEffect, useState, useMemo, memo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
  useMapEvents,
  Circle,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import { POI } from "../types";
import "leaflet/dist/leaflet.css";
import { GRAPH_NODES, GRAPH_EDGES } from "../lib/pathNetwork";
import { PoiMarker } from "./map/PoiMarker";
import { PoiMarkersAndLabels } from "./map/PoiMarkersAndLabels";
import { SelectedBuilding3D } from "./map/SelectedBuildings3D";
import { RouteBoundsFitter } from "./map/RouteBoundsFitter";

// Fix for default marker icons in Leaflet with React
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

import { useNavigation } from "../context/NavigationContext";

function MapEvents({ onMapDrag }: { onMapDrag?: () => void }) {
  useMapEvents({
    dragstart: () => {
      onMapDrag?.();
    },
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

export type MapStyle = "voyager" | "osm" | "dark";

const MAP_LAYERS: Record<MapStyle, string> = {
  voyager:
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
};

const MAP_ATTRIBUTIONS: Record<MapStyle, string> = {
  voyager:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  osm: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  dark: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
};

const MAP_SUBDOMAINS: Record<MapStyle, string[]> = {
  voyager: ["a", "b", "c", "d"],
  osm: ["a", "b", "c"],
  dark: ["a", "b", "c", "d"],
};

export const CATEGORY_STYLES: Record<
  string,
  { bg: string; fill: string; ping: string }
> = {
  Administrative: { bg: "bg-amber-500", fill: "#f59e0b", ping: "bg-amber-400" },
  "Lecture Theatre": {
    bg: "bg-indigo-500",
    fill: "#6366f1",
    ping: "bg-indigo-400",
  },
  Library: { bg: "bg-violet-500", fill: "#8b5cf6", ping: "bg-violet-400" },
  Sports: { bg: "bg-emerald-500", fill: "#10b981", ping: "bg-emerald-400" },
  Building: { bg: "bg-blue-500", fill: "#3b82f6", ping: "bg-blue-400" },
  Hostel: { bg: "bg-rose-500", fill: "#f43f5e", ping: "bg-rose-400" },
  Default: { bg: "bg-slate-500", fill: "#64748b", ping: "bg-slate-400" },
};

PoiMarker.displayName = "PoiMarker";

PoiMarkersAndLabels.displayName = "PoiMarkersAndLabels";

function FocusedView({
  coordinate,
}: {
  coordinate: [number, number] | null | undefined;
}) {
  const map = useMap();
  useEffect(() => {
    if (coordinate) {
      map.setView(coordinate, 18, { animate: true, duration: 0.6 });
    }
  }, [coordinate, map]);
  return null;
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
    [6.455, 3.19], // South-West (expanded to cover Faculty of Social Sciences)
    [6.482, 3.21], // North-East (expanded to cover International School)
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

      routeCoordinates.forEach((coord: [number, number], index: number) => {
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
    const hasCategoryFilter = filterCategory !== "All";
    const hasSearchQuery = searchQuery && searchQuery.trim() !== "";

    // Start with all POIs by default
    let result = pois;

    // Filter by category if category selection is active
    if (hasCategoryFilter) {
      result = result.filter((poi) => poi.category === filterCategory);
    }

    // Filter by search query if active
    if (hasSearchQuery) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (poi) =>
          poi.name.toLowerCase().includes(q) ||
          poi.category.toLowerCase().includes(q) ||
          poi.tags?.some((tag) => tag.toLowerCase().includes(q)),
      );
    }

    // Initialize set with matching POIs
    const activePois = new Set<POI>(result);

    // Always ensure selected POI and routing end points remain visible
    if (selectedPoi) {
      const match = pois.find((p) => p.id === selectedPoi.id);
      if (match) activePois.add(match);
    }

    if (routingTo) {
      const matchTo = pois.find((p) => p.id === routingTo.id);
      if (matchTo) activePois.add(matchTo);
    }

    if (routingFrom) {
      const matchFrom = pois.find((p) => p.id === routingFrom.id);
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
            <span className="text-sm font-bold text-zinc-700">
              Locating you...
            </span>
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
        preferCanvas={true}
        className="h-full w-full"
      >
        <FocusedView coordinate={focusedCoordinate} />
        <MapEvents onMapDrag={onMapDrag} />
        <TileLayer
          key={mapStyle}
          attribution={MAP_ATTRIBUTIONS[mapStyle]}
          url={MAP_LAYERS[mapStyle]}
          subdomains={MAP_SUBDOMAINS[mapStyle]}
          maxZoom={20}
          keepBuffer={8}
          updateWhenZooming={false}
          updateWhenIdle={true}
        />

        {traversedPath.length > 0 && (
          <Polyline
            positions={traversedPath}
            color="#2563eb"
            weight={10}
            opacity={0.8}
          />
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
                className: "user-location-marker-container",
                html: `
                  <div class="relative w-16 h-16 flex items-center justify-center">
                    ${
                      userHeading !== undefined && userHeading !== null
                        ? `
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
                    `
                        : ""
                    }
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
                  color: "#3b82f6",
                  fillColor: "#3b82f6",
                  fillOpacity: 0.15,
                  weight: 1,
                  dashArray: "5, 5",
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
                color: "#ea580c",
                weight: 7,
                opacity: 0.95,
                className: "route-polyline-shadow",
              }}
            />
          </>
        )}

        {showDebugGraph && (
          <>
            {/* Draw all walkway edges */}
            {GRAPH_EDGES.map((edge, idx) => {
              const fromNode = GRAPH_NODES.find((n) => n.id === edge.from);
              const toNode = GRAPH_NODES.find((n) => n.id === edge.to);
              if (fromNode && toNode) {
                return (
                  <Polyline
                    key={`edge-${idx}`}
                    positions={[
                      [fromNode.lat, fromNode.lng],
                      [toNode.lat, toNode.lng],
                    ]}
                    pathOptions={{
                      color: "#6366f1",
                      weight: 2,
                      opacity: 0.55,
                      dashArray: "3, 6",
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

              let color = "#71717a";
              let radius = 3;
              let fillOpacity = 0.6;

              if (isStartNode) {
                color = "#22c55e";
                radius = 7;
                fillOpacity = 0.95;
              } else if (isEndNode) {
                color = "#ef4444";
                radius = 7;
                fillOpacity = 0.95;
              } else if (isPathNode) {
                color = "#ea580c";
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
                    weight: isStartNode || isEndNode ? 2.5 : 1,
                  }}
                >
                  <Tooltip
                    direction="top"
                    opacity={0.9}
                    className="font-sans text-[9px] font-bold"
                  >
                    <span>Node {node.id}</span>
                  </Tooltip>
                </Circle>
              );
            })}
          </>
        )}
      </MapContainer>
    </div>
  );
});

CampusMap.displayName = "CampusMap";
