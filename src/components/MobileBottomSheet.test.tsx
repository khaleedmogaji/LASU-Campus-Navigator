import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MobileBottomSheet } from './MobileBottomSheet';
import { NavigationProvider, NavigationContextType } from '../context/NavigationContext';
import { POI } from '../types';

const mockPois: POI[] = [
  {
    id: '1',
    name: 'Senate Building',
    latitude: 6.4664,
    longitude: 3.2003,
    category: 'Administrative',
    description: 'Babatunde Raji Fashola Senate Building',
  }
];

const renderWithContext = (ui: React.ReactElement, contextOverride: Partial<NavigationContextType> = {}) => {
  const defaultContext: NavigationContextType = {
    pois: mockPois,
    filterCategory: 'All',
    setFilterCategory: vi.fn(),
    selectedPoi: null,
    setSelectedPoi: vi.fn(),
    userLocation: null,
    setUserLocation: vi.fn(),
    locationAccuracy: null,
    setLocationAccuracy: vi.fn(),
    isLocating: false,
    setIsLocating: vi.fn(),
    userHeading: null,
    setUserHeading: vi.fn(),
    routingTo: null,
    setRoutingTo: vi.fn(),
    routingFrom: null,
    setRoutingFrom: vi.fn(),
    mapStyle: 'voyager',
    setMapStyle: vi.fn(),
    focusedCoordinate: null,
    setFocusedCoordinate: vi.fn(),
    routeInfo: null,
    setRouteInfo: vi.fn(),
    searchQuery: '',
    setSearchQuery: vi.fn(),
    isSearchOpen: false,
    setIsSearchOpen: vi.fn(),
    sheetSnap: 'peek',
    setSheetSnap: vi.fn(),
    isLocatingState: false,
    isOffline: false,
    handlePoiSelect: vi.fn(),
    handleMapDrag: vi.fn(),
    isRoutePlannerOpen: false,
    setIsRoutePlannerOpen: vi.fn(),
    routingMode: 'gps',
    setRoutingMode: vi.fn(),
    ...contextOverride,
  };

  return {
    ...render(<NavigationProvider value={defaultContext}>{ui}</NavigationProvider>),
    mockContext: defaultContext,
  };
};

describe('MobileBottomSheet Component', () => {
  it('should render renderHomePanel when no routing or POI is active', () => {
    const onShare = vi.fn();
    const renderRoutePlannerPanel = () => <div data-testid="route-planner" />;
    const renderHomePanel = () => <div data-testid="home-panel">Welcome Home</div>;

    renderWithContext(
      <MobileBottomSheet
        onShare={onShare}
        renderRoutePlannerPanel={renderRoutePlannerPanel}
        renderHomePanel={renderHomePanel}
      />,
      {
        sheetSnap: 'half'
      }
    );

    // Verify Home panel renders
    expect(screen.getByTestId('home-panel')).toBeInTheDocument();
    expect(screen.getByText('Welcome Home')).toBeInTheDocument();
  });

  it('should render renderRoutePlannerPanel when routing is active', () => {
    const onShare = vi.fn();
    const renderRoutePlannerPanel = () => <div data-testid="route-planner">Route Planner Active</div>;
    const renderHomePanel = () => <div data-testid="home-panel" />;

    renderWithContext(
      <MobileBottomSheet
        onShare={onShare}
        renderRoutePlannerPanel={renderRoutePlannerPanel}
        renderHomePanel={renderHomePanel}
      />,
      {
        routingTo: mockPois[0],
        sheetSnap: 'half'
      }
    );

    // Verify Route planner panel renders instead of home panel
    expect(screen.getByTestId('route-planner')).toBeInTheDocument();
    expect(screen.getByText('Route Planner Active')).toBeInTheDocument();
  });
});
