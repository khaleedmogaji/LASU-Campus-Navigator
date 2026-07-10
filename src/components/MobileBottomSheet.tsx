import React, { useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'motion/react';
import { POI } from '../types';
import { SearchBar } from './SearchBar';
const POIInfo = React.lazy(() => import('./POIInfo').then(m => ({ default: m.POIInfo })));

// ── Snap point heights ──────────────────────────────────────────────────────
// All values are in px from the BOTTOM of the screen
export type SheetSnap = 'peek' | 'half' | 'full';

const PEEK_HEIGHT  = 88;   // just drag handle + search pill
const HALF_RATIO   = 0.52; // 52% of window height
const FULL_RATIO   = 0.90; // 90% of window height

function getSnapPx(snap: SheetSnap): number {
  const wh = window.innerHeight;
  if (snap === 'peek')  return PEEK_HEIGHT;
  if (snap === 'half')  return Math.round(wh * HALF_RATIO);
  return Math.round(wh * FULL_RATIO);
}

const VEL_THRESHOLD = 400; // px/s — fast flick triggers snap

function getScrollableParent(el: HTMLElement | null): HTMLElement | null {
  if (!el) return null;
  if (el.scrollHeight > el.clientHeight) {
    const overflowY = window.getComputedStyle(el).overflowY;
    if (overflowY === 'auto' || overflowY === 'scroll') {
      return el;
    }
  }
  return getScrollableParent(el.parentElement);
}

import { useNavigation } from '../context/NavigationContext';

interface MobileBottomSheetProps {
  onShare: (poi: POI) => void;
  renderRoutePlannerPanel: () => React.ReactNode;
  renderHomePanel: () => React.ReactNode;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  onShare,
  renderRoutePlannerPanel,
  renderHomePanel,
}) => {
  const {
    sheetSnap: snap,
    setSheetSnap: onSnapChange,
    pois,
    selectedPoi,
    setSelectedPoi,
    routingTo,
    setRoutingTo,
    userLocation,
    handlePoiSelect: onPoiSelect,
    filterCategory,
    setFilterCategory,
    searchQuery,
    setSearchQuery,
    isSearchOpen,
    setIsSearchOpen: onSearchOpenChange,
  } = useNavigation();

  const onClose = () => {
    setSelectedPoi(null);
    setRoutingTo(null);
    onSnapChange('peek');
  };

  const onGetDirections = (poi: POI) => {
    setRoutingTo(poi);
    setSelectedPoi(null);
    onSnapChange('half');
  };
  const y = useMotionValue(getSnapPx(snap));
  const isDragging = useRef(false);
  const dragStartClientY = useRef(0);
  const dragStartMotionY = useRef(0);
  const lastVel = useRef(0);
  const lastClientY = useRef(0);
  const lastT = useRef(Date.now());

  // Sync to external snap prop changes
  useEffect(() => {
    animate(y, getSnapPx(snap), { type: 'spring', stiffness: 350, damping: 35 });
  }, [snap]); // eslint-disable-line react-hooks/exhaustive-deps

  const sheetHeight = useTransform(y, (v) => `${v}px`);
  const topRadius = useTransform(
    y,
    [getSnapPx('half'), getSnapPx('full')],
    [24, 0]
  );
  const borderRadius = useTransform(topRadius, (r) => `${r}px ${r}px 0 0`);
  const overlayOpacity = useTransform(
    y,
    [PEEK_HEIGHT, getSnapPx('half'), getSnapPx('full')],
    [0, 0.15, 0.35]
  );

  const snapTo = useCallback((target: SheetSnap) => {
    animate(y, getSnapPx(target), { type: 'spring', stiffness: 350, damping: 35 });
    onSnapChange(target);
  }, [y, onSnapChange]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const scrollEl = getScrollableParent(e.target as HTMLElement);
    if (scrollEl && snap === 'full') {
      isDragging.current = false;
      return;
    }

    isDragging.current = true;
    dragStartClientY.current = e.touches[0].clientY;
    dragStartMotionY.current = y.get();
    lastClientY.current = e.touches[0].clientY;
    lastVel.current = 0;
    lastT.current = Date.now();
  }, [y, snap]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const clientY = e.touches[0].clientY;
    const delta = dragStartClientY.current - clientY; // up = positive
    const raw = dragStartMotionY.current + delta;
    const clamped = Math.max(PEEK_HEIGHT - 16, Math.min(getSnapPx('full') + 24, raw));
    y.set(clamped);

    // Rolling velocity (px/s)
    const now = Date.now();
    const dt = (now - lastT.current) / 1000;
    if (dt > 0.01) {
      lastVel.current = (lastClientY.current - clientY) / dt;
      lastT.current = now;
      lastClientY.current = clientY;
    }
  }, [y, snap]);

  const onTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const current = y.get();
    const vel = lastVel.current; // positive = moving up

    let target: SheetSnap;
    if (vel > VEL_THRESHOLD) {
      target = snap === 'peek' ? 'half' : 'full';
    } else if (vel < -VEL_THRESHOLD) {
      target = snap === 'full' ? 'half' : 'peek';
    } else {
      const snapPxMap: Record<SheetSnap, number> = {
        peek: getSnapPx('peek'),
        half: getSnapPx('half'),
        full: getSnapPx('full'),
      };
      const nearest = (Object.entries(snapPxMap) as [SheetSnap, number][])
        .sort((a, b) => Math.abs(current - a[1]) - Math.abs(current - b[1]))[0][0];
      target = nearest;
    }

    snapTo(target);
  }, [y, snap, snapTo]);

  return (
    <>
      {/* Scrim backdrop */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="fixed inset-0 bg-black z-[1400] pointer-events-none lg:hidden"
      />

      {/* Sheet */}
      <motion.div
        style={{ 
          height: sheetHeight, 
          borderRadius,
          paddingBottom: 'env(safe-area-inset-bottom, 12px)'
        }}
        className="fixed bottom-0 left-0 right-0 z-[2500] bg-white border-t border-zinc-250 shadow-[0_-12px_48px_rgba(0,0,0,0.12)] flex flex-col lg:hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* ── Drag handle area ───────────────────────────────────────────── */}
        <div className="shrink-0 pt-3 px-4 flex flex-col items-center gap-3 select-none touch-none">
          <div className="w-12 h-1.5 rounded-full bg-zinc-300/80" />

          {/* Peek-state search pill */}
          <AnimatePresence>
            {snap === 'peek' && (
              <motion.button
                key="peek-pill"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                onClick={() => snapTo('half')}
                className="w-full flex items-center gap-2.5 bg-white border border-zinc-200 rounded-2xl px-4.5 py-3 text-left active:scale-[0.98] transition-all mb-1 shadow-sm cursor-pointer text-zinc-700"
              >
                <svg className="w-4 h-4 text-zinc-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <span className="text-xs text-zinc-600 font-bold">Search campus buildings…</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ── Body content ───────────────────────────────────────────────── */}
        <AnimatePresence>
          {snap !== 'peek' && (
            <motion.div
              key="sheet-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Search bar — only when home/POI views (not route planner) */}
              {!routingTo && !selectedPoi && (
                <div className="px-4 pt-1 pb-3 shrink-0 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-lasu-primary uppercase tracking-widest">Explore Campus</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        onSnapChange('peek');
                      }}
                      className="text-[10px] font-bold text-zinc-650 hover:text-zinc-800 transition-colors cursor-pointer"
                    >
                      Close ✕
                    </button>
                  </div>
                  <SearchBar
                    pois={pois}
                    onSelect={(poi) => {
                      onPoiSelect(poi);
                      snapTo('half');
                    }}
                    filterCategory={filterCategory}
                    setFilterCategory={setFilterCategory}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    isOpen={isSearchOpen}
                    onOpenChange={onSearchOpenChange}
                  />
                </div>
              )}

              {/* Route planner header search when active */}
              {routingTo && (
                <div className="px-4 pt-1 pb-0 shrink-0 flex items-center justify-between">
                  <p className="text-[10px] font-black text-lasu-green uppercase tracking-widest">Route Planner</p>
                  <button
                    onClick={() => { onClose(); onSnapChange('peek'); }}
                    className="text-[10px] font-bold text-zinc-600 hover:text-zinc-800 transition-colors"
                  >
                    Close ✕
                  </button>
                </div>
              )}

              {/* Scrollable content or POIInfo panel directly */}
              {selectedPoi ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <React.Suspense fallback={<div className="p-6 text-center text-xs text-zinc-500 font-semibold bg-white flex-1 flex items-center justify-center">Loading details...</div>}>
                    <POIInfo
                      poi={selectedPoi}
                      userLocation={userLocation}
                      onClose={() => { onClose(); snapTo('peek'); }}
                      onGetDirections={(poi) => { onGetDirections(poi); snapTo('half'); }}
                      onShare={onShare}
                      isSidebar={true}
                    />
                  </React.Suspense>
                </div>
              ) : (
                <div className="flex-1 min-h-0 overflow-y-auto touch-pan-y scrollbar-hide">
                  {routingTo ? renderRoutePlannerPanel() : renderHomePanel()}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
