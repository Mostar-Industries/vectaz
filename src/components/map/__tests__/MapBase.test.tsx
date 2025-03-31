
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import MapBase from '../MapBase';
import mapboxgl from 'mapbox-gl';

// Mock mapbox-gl
vi.mock('mapbox-gl', () => {
  const addControlMock = vi.fn();
  const onMock = vi.fn();
  const setFogMock = vi.fn();
  const easeTo = vi.fn();
  const getCenter = vi.fn().mockReturnValue({ lng: 0, lat: 0 });
  const getZoom = vi.fn().mockReturnValue(2);
  const removeMapMock = vi.fn();

  return {
    default: {
      Map: vi.fn(() => ({
        addControl: addControlMock,
        on: onMock,
        setFog: setFogMock,
        getCenter,
        getZoom,
        easeTo,
        remove: removeMapMock,
        isStyleLoaded: () => true
      })),
      NavigationControl: vi.fn(() => ({})),
      accessToken: ''
    }
  };
});

describe('MapBase Component', () => {
  const originalConsoleError = console.error;
  
  beforeEach(() => {
    // Suppress console errors for tests
    console.error = vi.fn();
  });
  
  afterEach(() => {
    // Restore console.error
    console.error = originalConsoleError;
    vi.clearAllMocks();
  });

  it('renders the map container', () => {
    render(<MapBase />);
    const mapContainer = document.querySelector('.absolute.inset-0');
    expect(mapContainer).toBeInTheDocument();
  });

  it('initializes mapbox with correct settings', () => {
    render(<MapBase />);
    
    expect(mapboxgl.Map).toHaveBeenCalledWith(expect.objectContaining({
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: 'globe',
      zoom: 1.5,
      center: [20, 10],
      pitch: 40
    }));
  });

  it('calls onMapLoaded callback when map loads', async () => {
    const onMapLoadedMock = vi.fn();
    const onMapLoadedStateMock = vi.fn();
    
    render(
      <MapBase 
        onMapLoaded={onMapLoadedMock} 
        onMapLoadedState={onMapLoadedStateMock} 
      />
    );
    
    // Trigger the 'style.load' event
    const mapInstance = (mapboxgl.Map as any).mock.results[0].value;
    const onCall = mapInstance.on.mock.calls.find(call => call[0] === 'style.load');
    const styleLoadCallback = onCall[1];
    styleLoadCallback();
    
    await waitFor(() => {
      expect(onMapLoadedMock).toHaveBeenCalled();
      expect(onMapLoadedStateMock).toHaveBeenCalledWith(true);
    });
  });

  it('renders children and passes map props to them', () => {
    // Create a test child component that will receive map props
    const TestChild = vi.fn().mockReturnValue(<div data-testid="test-child">Child</div>);
    
    render(
      <MapBase>
        <TestChild />
      </MapBase>
    );
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    
    // The child component should have received the map prop
    expect(TestChild).toHaveBeenCalledWith(
      expect.objectContaining({
        map: expect.any(Object),
        mapLoaded: expect.any(Boolean)
      }),
      expect.anything()
    );
  });

  it('shows loading state when isLoading is true', () => {
    render(<MapBase isLoading={true} />);
    
    // Map should not be initialized when loading
    expect(mapboxgl.Map).not.toHaveBeenCalled();
  });
});
