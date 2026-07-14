import { useState, useEffect, useRef, useMemo } from 'react';
import { findShortestPath, getDistance } from '../lib/pathNetwork';
import { getMinDistanceToRoute } from '../utils/geo';
import { POI } from '../types';
import { INITIAL_POIS } from '../data/initialPois';

interface UseRoutingProps {
  userLocation: [number, number] | null;
  setUserHeading: (heading: number | null) => void;
  pois: POI[];
  setSheetSnap: (snap: any) => void;
  speakInstruction: (text: string) => void;
  setUserLocation: React.Dispatch<React.SetStateAction<[number, number] | null>>;
  setIsSimulated: React.Dispatch<React.SetStateAction<boolean>>;
  routingTo: POI | null;
  setRoutingTo: React.Dispatch<React.SetStateAction<POI | null>>;
  routingFrom: POI | null;
  setRoutingFrom: React.Dispatch<React.SetStateAction<POI | null>>;
  routeInfo: { distance: number; duration: number; coordinates: any[]; segmentsCount: number; instructions: any[] } | null;
  setRouteInfo: React.Dispatch<React.SetStateAction<any | null>>;
  currentInstructionIndex: number;
  setCurrentInstructionIndex: React.Dispatch<React.SetStateAction<number>>;
}

export function useRouting({
  userLocation,
  setUserHeading,
  pois,
  setSheetSnap,
  speakInstruction,
  setUserLocation,
  setIsSimulated,
  routingTo,
  setRoutingTo,
  routingFrom,
  setRoutingFrom,
  routeInfo,
  setRouteInfo,
  currentInstructionIndex,
  setCurrentInstructionIndex
}: UseRoutingProps) {
  const [traversedPath, setTraversedPath] = useState<[number, number][]>([]);
  const [isRouteDrawerExpanded, setIsRouteDrawerExpanded] = useState(false);
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [tourMockedRouteActive, setTourMockedRouteActive] = useState(false);

  const lastCalculatedStartRef = useRef<[number, number] | null>(null);
  const lastCalculatedEndRef = useRef<string | null>(null);
  const prevRouteInfoRef = useRef<{ coordinates: any[]; destinationName: string } | null>(null);
  const lastSpokenIndexRef = useRef<number | null>(null);

  const getCoordinatesForPoint = (point: any): [number, number] | null => {
    if (!point) {
      return userLocation ? [Number(userLocation[0]), Number(userLocation[1])] : null;
    }
    const lat = Number(point.latitude);
    const lng = Number(point.longitude);
    if (isNaN(lat) || isNaN(lng)) return null;
    return [lat, lng];
  };

  const startCoordinates = useMemo(() => getCoordinatesForPoint(routingFrom), [routingFrom, userLocation]);
  const endCoordinates = useMemo(() => getCoordinatesForPoint(routingTo), [routingTo]);

  const startCoordinatesKey = startCoordinates ? `${startCoordinates[0]},${startCoordinates[1]}` : '';
  const endCoordinatesKey = endCoordinates ? `${endCoordinates[0]},${endCoordinates[1]}` : '';

  const handleSwapRoute = () => {
    const temp = routingFrom;
    setRoutingFrom(routingTo);
    setRoutingTo(temp);
  };

  // Calculate shortest path using local Dijkstra
  useEffect(() => {
    if (startCoordinates && endCoordinates) {
      if (routingFrom && routingTo && routingFrom.id === routingTo.id) {
        setRouteInfo(null);
        return;
      }
      const endKey = `${endCoordinates[0]},${endCoordinates[1]}`;
      const destChanged = lastCalculatedEndRef.current !== endKey;

      if (routeInfo && lastCalculatedStartRef.current && !destChanged) {
        const distanceMoved = getDistance(
          startCoordinates[0],
          startCoordinates[1],
          lastCalculatedStartRef.current[0],
          lastCalculatedStartRef.current[1]
        );
        if (distanceMoved < 5) {
          return;
        }
      }

      try {
        const route = findShortestPath(
          startCoordinates,
          endCoordinates,
          false
        );
        setRouteInfo(route);
        lastCalculatedStartRef.current = startCoordinates;
        lastCalculatedEndRef.current = endKey;
      } catch (err) {
        console.error("Pathfinding error:", err);
        setRouteInfo(null);
        lastCalculatedStartRef.current = null;
        lastCalculatedEndRef.current = null;
      }
    } else {
      setRouteInfo(null);
      lastCalculatedStartRef.current = null;
      lastCalculatedEndRef.current = null;
    }
  }, [startCoordinatesKey, endCoordinatesKey]);

  // Cleanups on stop/dest changes
  useEffect(() => {
    if (!routingTo) {
      setUserHeading(null);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      lastSpokenIndexRef.current = null;
      setRoutingFrom(null);
    }
  }, [routingTo, setUserHeading, setRoutingFrom]);

  // Speech prompt transitions when destination changes or route is left
  useEffect(() => {
    if (routingTo && routeInfo) {
      const isNewDestination = !prevRouteInfoRef.current || prevRouteInfoRef.current.destinationName !== routingTo.name;
      
      if (isNewDestination) {
        console.log("[Voice Nav] Starting new navigation to:", routingTo.name);
        setCurrentInstructionIndex(0);
        prevRouteInfoRef.current = {
          coordinates: routeInfo.coordinates,
          destinationName: routingTo.name
        };
        return;
      }

      if (userLocation && prevRouteInfoRef.current.coordinates) {
        const minDist = getMinDistanceToRoute(
          userLocation[0],
          userLocation[1],
          prevRouteInfoRef.current.coordinates
        );
        
        console.log("[Voice Nav] Distance to original route:", minDist.toFixed(1) + "m");

        if (minDist > 25) {
          console.log("[Speech Event] Off-route detected. Recalculating route.");
          speakInstruction("You have left the route. Recalculating.");
          setCurrentInstructionIndex(0);
          prevRouteInfoRef.current.coordinates = routeInfo.coordinates;
        }
      }
    } else {
      setCurrentInstructionIndex(0);
      prevRouteInfoRef.current = null;
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  }, [routingTo, routeInfo]);

  // Waypoint arrival tracking & turn directions speech trigger
  useEffect(() => {
    if (!routingTo || !routeInfo || !userLocation || !routeInfo.instructions || routeInfo.instructions.length === 0) {
      return;
    }

    const instructions = routeInfo.instructions;

    if (currentInstructionIndex === 0) {
      const firstStep = instructions[0];
      const startText = `Voice navigation is now active. Starting route to ${routingTo.name}. ${firstStep.text}`;
      console.log("[Speech Event] Starting route. Speaking:", startText);
      speakInstruction(startText);
      setCurrentInstructionIndex(1);
      return;
    }

    const targetStep = instructions[currentInstructionIndex - 1];
    if (targetStep && targetStep.coords) {
      const dist = getDistance(
        userLocation[0],
        userLocation[1],
        targetStep.coords.lat,
        targetStep.coords.lng
      );

      console.log(`[Voice Nav Debug] Current location: [${userLocation[0].toFixed(6)}, ${userLocation[1].toFixed(6)}], target: [${targetStep.coords.lat.toFixed(6)}, ${targetStep.coords.lng.toFixed(6)}], distance to next waypoint: ${dist.toFixed(1)}m, current instruction index: ${currentInstructionIndex}`);

      if (dist <= 20) {
        if (currentInstructionIndex < instructions.length) {
          const nextStep = instructions[currentInstructionIndex];
          console.log(`[Speech Event] Waypoint reached. Index: ${currentInstructionIndex}, Speaking: ${nextStep.text}`);
          speakInstruction(nextStep.text);
          setCurrentInstructionIndex(prev => prev + 1);
        } else {
          console.log("[Speech Event] Reached final destination. Stopping voice guidance.");
          speakInstruction("You have arrived at your destination.");
          setRoutingTo(null);
          setRouteInfo(null);
        }
      }
    }
  }, [userLocation, routingTo, routeInfo, currentInstructionIndex]);

  // Guided Welcome Tour Transitions
  useEffect(() => {
    if (tourStep === 1) {
      if (window.innerWidth < 1024) {
        setSheetSnap('half');
      }
    } else if (tourStep === 2) {
      if (window.innerWidth < 1024) {
        setSheetSnap('peek');
      }
    } else if (tourStep === 3) {
      if (window.innerWidth < 1024) {
        setSheetSnap('peek');
      }
    } else if (tourStep === 4) {
      if (!routingTo) {
        const senatePoi = pois.find(p => p.id === '1') || INITIAL_POIS[0];
        setUserLocation([6.4642, 3.1972]);
        setRoutingFrom(null);
        setRoutingTo(senatePoi);
        setIsRouteDrawerExpanded(false);
        setTourMockedRouteActive(true);
      }
      if (window.innerWidth < 1024) {
        setSheetSnap('peek');
      }
    } else {
      if (tourMockedRouteActive && tourStep !== 4) {
        setRoutingTo(null);
        setRoutingFrom(null);
        setTourMockedRouteActive(false);
      }
    }
  }, [tourStep, pois]);

  return {
    traversedPath,
    setTraversedPath,
    isRouteDrawerExpanded,
    setIsRouteDrawerExpanded,
    tourStep,
    setTourStep,
    tourMockedRouteActive,
    setTourMockedRouteActive,
    handleSwapRoute,
  };
}
