import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SafetyInfoModal } from './components/SafetyInfoModal';
import { WelcomeBackModal } from './components/WelcomeBackModal';
import { db, collection, onSnapshot, query } from './firebase';
import { POI } from './types';
import { cn } from './lib/utils';
import type { MapStyle } from './components/Map';
import { NavigationProvider } from './context/NavigationContext';

// Custom Hooks
import { useSearch } from './hooks/useSearch';
import { useLocation } from './hooks/useLocation';
import { useRouting } from './hooks/useRouting';
import { useVoiceNavigation } from './hooks/useVoiceNavigation';

// Modular UI Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StatusBadge } from './components/StatusBadge';
import { NavigationCard } from './components/NavigationCard';
import { RouteDirectionsDrawer } from './components/RouteDirectionsDrawer';
import { RoutePlannerPanel } from './components/RoutePlannerPanel';
import { MobileBottomSheet, SheetSnap } from './components/MobileBottomSheet';
import { HomePanelContent } from './components/HomePanelContent';

// Lazy loaded heavy components
const CampusMap = React.lazy(() => import('./components/Map').then(m => ({ default: m.CampusMap })));
const CampusAssistant = React.lazy(() => import('./components/CampusAssistant').then(m => ({ default: m.CampusAssistant })));
const WelcomeScreen = React.lazy(() => import('./components/WelcomeScreen').then(m => ({ default: m.WelcomeScreen })));

import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_POIS } from './data/initialPois';
import { overridePoiData } from './utils/poi';

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [session, setSession] = useState<{
    firstVisit: boolean;
    lastScreen: string;
    lastDestination: string;
  } | null>(null);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);

  useEffect(() => {
    localStorage.removeItem('lasu_navigator_dark_mode');
    document.documentElement.classList.remove('dark');
  }, []);

  const [pois, setPois] = useState<POI[]>(() => {
    localStorage.removeItem('poi_data');
    localStorage.removeItem('poi_data_v4');
    localStorage.removeItem('poi_data_v5');
    localStorage.removeItem('poi_data_v10');
    
    const cached = localStorage.getItem('poi_data_v10');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          const merged = [...parsed];
          INITIAL_POIS.forEach(initial => {
            const idx = merged.findIndex(p => String(p.id).trim() === String(initial.id).trim());
            if (idx !== -1) {
              merged[idx] = { ...merged[idx], ...initial };
            } else {
              merged.push(initial);
            }
          });
          return overridePoiData(merged);
        }
      } catch (e) {
        console.warn("Failed to parse cached POIs:", e);
      }
    }
    return overridePoiData(INITIAL_POIS);
  });

  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [routingTo, setRoutingTo] = useState<POI | null>(null);
  const [routingFrom, setRoutingFrom] = useState<POI | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [userHeading, setUserHeading] = useState<number | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [followMe, setFollowMe] = useState(false);
  const [sheetSnap, setSheetSnap] = useState<SheetSnap>('peek');
  const [isLoading, setIsLoading] = useState(true);
  const [mapStyle, setMapStyle] = useState<MapStyle>('voyager');
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number; coordinates: any[]; segmentsCount: number; instructions: any[] } | null>(null);
  const [focusedCoordinate, setFocusedCoordinate] = useState<[number, number] | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [showAccuracyWarning, setShowAccuracyWarning] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isSimulated, setIsSimulated] = useState(false);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);

  // 1. Voice Navigation Hook
  const voiceNav = useVoiceNavigation({
    routeInfo,
    routingTo,
    currentInstructionIndex
  });

  // 2. Geolocation & Simulation Location Hook
  const location = useLocation({
    userLocation,
    setUserLocation,
    userHeading,
    setUserHeading,
    locationAccuracy,
    setLocationAccuracy,
    isSimulated,
    setIsSimulated,
    followMe,
    setFocusedCoordinate,
    setSelectedPoi
  });

  // 3. Routing Dijkstra Hook
  const routing = useRouting({
    userLocation,
    setUserHeading,
    pois,
    setSheetSnap,
    speakInstruction: voiceNav.speakInstruction,
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
  });

  // 4. Search State Hook
  const search = useSearch({
    pois,
    setPois,
    routingFrom,
    routingTo
  });

  // Offline detection listener
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Shared parameters
  useEffect(() => {
    const cachedSession = localStorage.getItem('lasu_navigator_session');
    let currentSession: any = null;
    let isFirstTime = false;
    
    if (cachedSession) {
      try {
        currentSession = JSON.parse(cachedSession);
      } catch (e) {
        console.warn("Failed to parse cached session:", e);
      }
    }
    
    if (!currentSession) {
      isFirstTime = true;
      currentSession = {
        firstVisit: true,
        lastScreen: 'welcome',
        lastDestination: ''
      };
      localStorage.setItem('lasu_navigator_session', JSON.stringify(currentSession));
    }
    
    setSession(currentSession);
    setIsLoading(true);
    
    const delay = isFirstTime ? 2500 : 1500;
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!isFirstTime) {
        setShowWelcomeBack(true);
      }
    }, delay);
    
    return () => clearTimeout(timer);
  }, []);

  // Deep Link handler
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const poiId = urlParams.get('poiId');
    if (poiId) {
      const poi = pois.find(p => p.id === poiId);
      if (poi) {
        setSelectedPoi(poi);
        setShowWelcome(false);
      }
    }
  }, [pois]);

  // Weak GPS signal timer
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (locationAccuracy && locationAccuracy > 50) {
      timeoutId = setTimeout(() => {
        setShowAccuracyWarning(true);
      }, 5000);
    } else {
      setShowAccuracyWarning(false);
    }
    return () => clearTimeout(timeoutId);
  }, [locationAccuracy]);

  const saveSession = (updates: Partial<{ firstVisit: boolean; lastScreen: string; lastDestination: string }>) => {
    setSession(prev => {
      const next = prev ? { ...prev, ...updates, firstVisit: false } : { firstVisit: false, lastScreen: 'welcome', lastDestination: '', ...updates };
      localStorage.setItem('lasu_navigator_session', JSON.stringify(next));
      return next;
    });
  };

  const handleContinuePreviousSession = () => {
    if (session?.lastDestination) {
      const matchedPoi = pois.find(p => p.name.toLowerCase() === session.lastDestination.toLowerCase() || p.name.toLowerCase().includes(session.lastDestination.toLowerCase()));
      if (matchedPoi) {
        setRoutingTo(matchedPoi);
        setSelectedPoi(null);
      }
    }
    setShowWelcome(false);
    setShowWelcomeBack(false);
    saveSession({ lastScreen: 'map' });
  };

  const shareLocation = async (poi: POI) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?poiId=${poi.id}`;
    const shareData = {
      title: poi.name,
      text: `Check out this location at LASU: ${poi.name}`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${poi.name}: ${shareUrl}`);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const shareCurrentLocation = async () => {
    if (!userLocation) {
      alert("Please enable your location to share it.");
      return;
    }
    const shareData = {
      title: "My Location at LASU",
      text: `Check out my current location at LASU: ${userLocation[0]}, ${userLocation[1]}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`My Location at LASU: ${userLocation[0]}, ${userLocation[1]} - ${window.location.href}`);
        alert("Location link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const handleEnableSimulationFromBanner = () => {
    const gateLoc: [number, number] = [6.4642, 3.1972];
    setIsSimulated(true);
    setUserLocation(gateLoc);
    setLocationAccuracy(null);
    setSelectedPoi({ 
      id: 'simulated-location', 
      name: 'Simulated Location (Gate)', 
      latitude: gateLoc[0], 
      longitude: gateLoc[1], 
      category: 'Other', 
      description: 'Simulated position for testing navigation.' 
    });
    location.setIsUserOffCampus(false);
  };

  const handlePoiSelect = useCallback((poi: POI) => {
    setSelectedPoi(poi);
    setRoutingTo(null);
    if (window.innerWidth < 1024) {
      setSheetSnap('half');
    }
  }, []);

  const handleMapDrag = useCallback(() => {
    setFollowMe(false);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-50">
        <div className="w-16 h-16 border-4 border-zinc-200 border-t-lasu-primary rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-800 font-extrabold animate-pulse">Initializing LASU Navigator...</p>
      </div>
    );
  }

  // Welcome Screen Return Block
  if (showWelcome) {
    const matchedPoi = session?.lastDestination 
      ? pois.find(p => p.name.toLowerCase() === session.lastDestination.toLowerCase() || p.name.toLowerCase().includes(session.lastDestination.toLowerCase()))
      : undefined;

    return (
      <div className="relative w-full min-h-screen overflow-y-auto bg-white">
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-zinc-500 font-bold bg-white">Loading Welcome...</div>}>
          <WelcomeScreen 
            pois={pois}
            onStart={() => {
              setShowWelcome(false);
              saveSession({ lastScreen: 'map' });
              const tourCompleted = localStorage.getItem('lasu_navigator_tour_completed') === 'true';
              if (!tourCompleted) {
                routing.setTourStep(1);
              }
            }}
            onExplore={(category) => {
              setShowWelcome(false);
              saveSession({ lastScreen: 'map' });
              if (category) {
                search.setFilterCategory(category);
              } else {
                search.setFilterCategory('All');
              }
              if (window.innerWidth < 1024) {
                setSheetSnap('half');
              }
            }}
            onAskAssistant={() => {
              setShowWelcome(false);
              saveSession({ lastScreen: 'map' });
              setIsAssistantOpen(true);
            }}
            onSelectPoi={(poi) => {
              setShowWelcome(false);
              saveSession({ lastScreen: 'map' });
              setSelectedPoi(poi);
              setRoutingTo(null);
              if (window.innerWidth < 1024) {
                setSheetSnap('half');
              }
            }}
          />
        </React.Suspense>

        <AnimatePresence>
          {showWelcomeBack && (
            <WelcomeBackModal
              matchedPoi={matchedPoi}
              onContinuePreviousSession={handleContinuePreviousSession}
              onSkipToMap={() => {
                setShowWelcome(false);
                setShowWelcomeBack(false);
                saveSession({ lastScreen: 'map' });
              }}
              onAskAssistant={() => {
                setShowWelcome(false);
                setIsAssistantOpen(true);
                setShowWelcomeBack(false);
                saveSession({ lastScreen: 'map' });
              }}
              onGoToDashboard={() => {
                setShowWelcomeBack(false);
                saveSession({ lastScreen: 'welcome' });
              }}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  const displayDuration = routeInfo ? Math.round(routeInfo.duration / 60) : 0;
  const displayDistance = routeInfo ? routeInfo.distance / 1000 : 0;

  const numTurns = routeInfo && routeInfo.instructions
    ? routeInfo.instructions.filter((step: any) => step.text.toLowerCase().includes('turn left') || step.text.toLowerCase().includes('turn right')).length
    : 0;

  let currentInstructionStep: any = null;
  let nextInstructionStep: any = null;
  if (routeInfo && routeInfo.instructions && routeInfo.instructions.length > 0) {
    const activeIdx = Math.max(0, currentInstructionIndex - 1);
    currentInstructionStep = routeInfo.instructions[activeIdx];
    if (activeIdx + 1 < routeInfo.instructions.length) {
      nextInstructionStep = routeInfo.instructions[activeIdx + 1];
    }
  }

  const navCardTop = "top-4";

  const navigationContextValue = {
    pois,
    selectedPoi,
    setSelectedPoi,
    routingTo,
    setRoutingTo,
    routingFrom,
    setRoutingFrom,
    userLocation,
    setUserLocation,
    locationAccuracy,
    setLocationAccuracy,
    followMe,
    setFollowMe,
    sheetSnap,
    setSheetSnap,
    isLoading,
    setIsLoading,
    isLocating: location.isLocating,
    setIsLocating: location.setIsLocating,
    userHeading,
    setUserHeading,
    mapStyle,
    setMapStyle,
    focusedCoordinate,
    setFocusedCoordinate,
    routeInfo,
    setRouteInfo,
    searchQuery: search.searchQuery,
    setSearchQuery: search.setSearchQuery,
    isSearchOpen,
    setIsSearchOpen,
    isOffline,
    handlePoiSelect,
    handleMapDrag,
    isLocatingState: location.isLocating,
    filterCategory: search.filterCategory,
    setFilterCategory: search.setFilterCategory
  };

  return (
    <NavigationProvider value={navigationContextValue}>
      <>
        <div className="h-screen w-screen bg-white flex flex-col overflow-hidden font-sans text-[rgb(49,30,2)] transition-colors duration-300">
          <Header
            pois={pois}
            onSelectPoi={(poi) => {
              setSelectedPoi(poi);
              setRoutingTo(null);
            }}
            filterCategory={search.filterCategory}
            setFilterCategory={search.setFilterCategory}
            searchQuery={search.searchQuery}
            setSearchQuery={search.setSearchQuery}
            setShowWelcome={setShowWelcome}
            setIsInfoOpen={setIsInfoOpen}
            shareCurrentLocation={shareCurrentLocation}
            isOffline={isOffline}
            isUserOffCampus={location.isUserOffCampus}
            isSimulated={isSimulated}
            showAccuracyWarning={showAccuracyWarning}
            onEnableSimulation={handleEnableSimulationFromBanner}
          />

          <main className="flex-1 flex relative overflow-hidden">
            {/* Mobile Bottom Sheet */}
            <div className="lg:hidden">
              <MobileBottomSheet
                onShare={shareLocation}
                renderRoutePlannerPanel={() => (
                  <RoutePlannerPanel
                    routingTo={routingTo}
                    setRoutingTo={setRoutingTo}
                    routingFrom={routingFrom}
                    setRoutingFrom={setRoutingFrom}
                    routeInfo={routeInfo}
                    setRouteInfo={setRouteInfo}
                    startSearchQuery={search.startSearchQuery}
                    setStartSearchQuery={search.setStartSearchQuery}
                    endSearchQuery={search.endSearchQuery}
                    setEndSearchQuery={search.setEndSearchQuery}
                    isStartDropdownOpen={search.isStartDropdownOpen}
                    setIsStartDropdownOpen={search.setIsStartDropdownOpen}
                    isEndDropdownOpen={search.isEndDropdownOpen}
                    setIsEndDropdownOpen={search.setIsEndDropdownOpen}
                    filteredStartPois={search.filteredStartPois}
                    filteredEndPois={search.filteredEndPois}
                    handleSwapRoute={routing.handleSwapRoute}
                    setIsSimulated={setIsSimulated}
                  />
                )}
                renderHomePanel={() => <HomePanelContent isMobile={true} />}
              />
            </div>

            {/* Desktop Left Sidebar */}
            <Sidebar
              routingTo={routingTo}
              setRoutingTo={setRoutingTo}
              routingFrom={routingFrom}
              setRoutingFrom={setRoutingFrom}
              selectedPoi={selectedPoi}
              setSelectedPoi={setSelectedPoi}
              userLocation={userLocation}
              shareLocation={shareLocation}
              routeInfo={routeInfo}
              setRouteInfo={setRouteInfo}
              startSearchQuery={search.startSearchQuery}
              setStartSearchQuery={search.setStartSearchQuery}
              endSearchQuery={search.endSearchQuery}
              setEndSearchQuery={search.setEndSearchQuery}
              isStartDropdownOpen={search.isStartDropdownOpen}
              setIsStartDropdownOpen={search.setIsStartDropdownOpen}
              isEndDropdownOpen={search.isEndDropdownOpen}
              setIsEndDropdownOpen={search.setIsEndDropdownOpen}
              filteredStartPois={search.filteredStartPois}
              filteredEndPois={search.filteredEndPois}
              handleSwapRoute={routing.handleSwapRoute}
              setIsSimulated={setIsSimulated}
            />

            {/* Map Area */}
            <section className="flex-1 relative">
              {routingTo && routeInfo && (
                <AnimatePresence>
                  <NavigationCard
                    currentInstructionStep={currentInstructionStep}
                    nextInstructionStep={nextInstructionStep}
                    routingToName={routingTo.name}
                    isVoiceEnabled={voiceNav.isVoiceEnabled}
                    handleToggleVoice={voiceNav.handleToggleVoice}
                    isMuted={voiceNav.isMuted}
                    setIsMuted={voiceNav.setIsMuted}
                    replayCurrentInstruction={voiceNav.replayCurrentInstruction}
                    isRouteDrawerExpanded={routing.isRouteDrawerExpanded}
                    setIsRouteDrawerExpanded={routing.setIsRouteDrawerExpanded}
                    onClose={() => {
                      setRoutingTo(null);
                      setRouteInfo(null);
                      routing.setIsRouteDrawerExpanded(false);
                    }}
                    navCardTop={navCardTop}
                  />
                </AnimatePresence>
              )}

              <React.Suspense fallback={
                <div className="flex-1 flex flex-col items-center justify-center bg-zinc-50 min-h-[400px]">
                  <div className="w-10 h-10 border-2 border-zinc-200 border-t-lasu-primary rounded-full animate-spin mb-3"></div>
                  <p className="text-zinc-550 text-xs font-semibold">Loading Campus Map...</p>
                </div>
              }>
                <CampusMap />
              </React.Suspense>

              {routingTo && routeInfo && (
                <RouteDirectionsDrawer
                  routingTo={routingTo}
                  routeInfo={routeInfo}
                  isRouteDrawerExpanded={routing.isRouteDrawerExpanded}
                  setIsRouteDrawerExpanded={routing.setIsRouteDrawerExpanded}
                  setRoutingTo={setRoutingTo}
                  setRouteInfo={setRouteInfo}
                  setFocusedCoordinate={setFocusedCoordinate}
                  isVoiceEnabled={voiceNav.isVoiceEnabled}
                  handleToggleVoice={voiceNav.handleToggleVoice}
                  isMuted={voiceNav.isMuted}
                  setIsMuted={voiceNav.setIsMuted}
                  replayCurrentInstruction={voiceNav.replayCurrentInstruction}
                  displayDuration={displayDuration}
                  displayDistance={displayDistance}
                  numTurns={numTurns}
                />
              )}
            </section>
          </main>

          {/* Lazy loaded chatbot assistant */}
          <React.Suspense fallback={null}>
            <CampusAssistant 
              pois={pois}
              onNavigate={(poi) => {
                setRoutingTo(poi);
                setRoutingFrom(null);
                setSelectedPoi(null);
                setIsAssistantOpen(false);
              }}
              externalOpen={isAssistantOpen}
              onExternalOpenChange={setIsAssistantOpen}
              isSearchOpen={isSearchOpen}
            />
          </React.Suspense>

          {/* Interactive Tour Overlay */}
          <AnimatePresence>
            {routing.tourStep !== null && (
              <div className="fixed inset-0 z-[4000] overflow-hidden pointer-events-none">
                <div 
                  className={cn(
                    "transition-all duration-300 pointer-events-none z-[4050] border-2 border-lasu-secondary shadow-[0_0_0_9999px_rgba(9,9,11,0.655)] absolute",
                    routing.tourStep === 1 && (window.innerWidth < 1024 
                      ? "bottom-0 left-0 right-0 h-[52vh] rounded-t-[32px]" 
                      : "top-16 left-0 w-80 bottom-0"),
                    routing.tourStep === 2 && "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full",
                    routing.tourStep === 3 && "top-[76px] right-3.5 w-13 h-[104px] rounded-3xl",
                    routing.tourStep === 4 && "bottom-[88px] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm h-16 rounded-2xl"
                  )}
                />

                <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none z-[4100]">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className={cn(
                      "absolute bg-white rounded-[28px] p-6 shadow-2xl border border-zinc-200/80 w-full max-w-sm flex flex-col gap-4 transition-all duration-300 pointer-events-auto",
                      routing.tourStep === 1 && "lg:top-20 lg:left-88 lg:translate-x-0 lg:translate-y-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                      routing.tourStep === 2 && "bottom-12 lg:bottom-20 top-auto left-1/2 -translate-x-1/2",
                      routing.tourStep === 3 && "top-48 lg:top-20 lg:right-20 lg:left-auto lg:translate-x-0 left-1/2 -translate-x-1/2",
                      routing.tourStep === 4 && "bottom-36 lg:bottom-40 top-auto left-1/2 -translate-x-1/2"
                    )}
                  >
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-lasu-primary flex items-center justify-center text-white text-xs font-black">
                          {routing.tourStep}
                        </span>
                        <h3 className="font-extrabold text-sm text-zinc-900">
                          {routing.tourStep === 1 && "Search & Categories"}
                          {routing.tourStep === 2 && "Explore Landmarks"}
                          {routing.tourStep === 3 && "Map Controls & Layers"}
                          {routing.tourStep === 4 && "Routing & Simulation"}
                        </h3>
                      </div>
                      <button 
                        onClick={() => {
                          routing.setTourStep(null);
                          localStorage.setItem('lasu_navigator_tour_completed', 'true');
                          if (window.innerWidth < 1024) {
                            setSheetSnap('peek');
                          }
                        }}
                        className="text-zinc-600 hover:text-zinc-800 transition-colors text-xs font-black uppercase tracking-wider cursor-pointer"
                      >
                        Skip
                      </button>
                    </div>
                    
                    <p className="text-xs text-zinc-700 leading-relaxed font-semibold">
                      {routing.tourStep === 1 && "Use the Search bar at the top (desktop) or in the bottom sheet (mobile) to find any landmark. Tap the category tag pills underneath (like 'Library' or 'Sports') to filter locations instantly."}
                      {routing.tourStep === 2 && "Tap any category-coded pin on the map to open its details panel. You will find photos, a directory of academic departments, and quick actions to get directions."}
                      {routing.tourStep === 3 && "Use the controls on the right of the map: tap GPS to center and lock the camera on your position, or tap Layers to switch between the CARTO Voyager Map and OpenStreetMap pathways."}
                      {routing.tourStep === 4 && "Tap 'Route To Here' on any landmark card to plan a path, and unmute the Speaker icon for spoken turn-by-turn voice directions!"}
                    </p>

                    <div className="flex justify-between items-center mt-2 border-t border-zinc-200 pt-3">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map(step => (
                          <div 
                            key={step} 
                            className={cn("w-1.5 h-1.5 rounded-full transition-colors", step === routing.tourStep ? "bg-lasu-primary " : "bg-zinc-200 ")}
                          />
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        {routing.tourStep > 1 && (
                          <button 
                            onClick={() => routing.setTourStep(routing.tourStep! - 1)}
                            className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            Back
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            if (routing.tourStep! < 4) {
                              routing.setTourStep(routing.tourStep! + 1);
                            } else {
                              routing.setTourStep(null);
                              localStorage.setItem('lasu_navigator_tour_completed', 'true');
                              if (window.innerWidth < 1024) {
                                setSheetSnap('peek');
                              }
                            }
                          }}
                          className="px-4 py-1.5 bg-lasu-primary hover:bg-lasu-primary-dark text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          {routing.tourStep === 4 ? "Finish" : "Next"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          </AnimatePresence>

          {/* Safety warning dialog */}
          <AnimatePresence>
            {isInfoOpen && (
              <SafetyInfoModal 
                onClose={() => setIsInfoOpen(false)}
                onStartTour={() => {
                  setIsInfoOpen(false);
                  routing.setTourStep(1);
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </>
    </NavigationProvider>
  );
}
