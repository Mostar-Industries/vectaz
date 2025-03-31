
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import RouteLayer from '../RouteLayer';
import mapboxgl from 'mapbox-gl';
import { Route } from '../types';

// Mock mapbox-gl
vi.mock('mapbox-gl', () => {
  const addLayerMock = vi.fn();
  const addSourceMock = vi.fn();
  const getLayerMock = vi.fn().mockReturnValue(false);
  const getSourceMock = vi.fn().mockReturnValue(false);
  const removeLayerMock = vi.fn();
  const removeSourceMock = vi.fn();
  const isStyleLoadedMock = vi.fn().mockReturnValue(true);
  
  return {
    default: {
      Map: vi.fn(() => ({
        addLayer: addLayerMock,
        addSource: addSourceMock,
        getLayer: getLayerMock,
        getSource: getSourceMock,
        removeLayer: removeLayerMock,
        removeSource: removeSourceMock,
        isStyleLoaded: isStyleLoadedMock
      })),
      Marker: vi.fn(() => ({
        setLngLat: () => ({
          setPopup: () => ({
            addTo: vi.fn()
          })
        })
      })),
      Popup: vi.fn(() => ({
        setText: vi.fn().mockReturnValue({})
      }))
    }
  };
});

describe('RouteLayer Component', () => {
  const originalConsoleError = console.error;
  const originalConsoleLog = console.log;
  const mockRoutes: Route[] = [
    {
      origin: {
        lat: 1.2404475,
        lng: 36.990054,
        name: 'Kenya',
        isOrigin: true
      },
      destination: {
        lat: -17.80269125,
        lng: 31.08848075,
        name: 'Zimbabwe',
        isOrigin: false
      },
      weight: 100,
      shipmentCount: 5
    }
  ];
  
  let mockMap: any;
  
  beforeEach(() => {
    // Setup mock map
    mockMap = new (mapboxgl as any).Map();
    
    // Suppress console messages for tests
    console.error = vi.fn();
    console.log = vi.fn();
  });
  
  afterEach(() => {
    // Restore console functions
    console.error = originalConsoleError;
    console.log = originalConsoleLog;
    vi.clearAllMocks();
  });

  it('does nothing when map is not loaded', () => {
    render(<RouteLayer map={mockMap} routes={mockRoutes} mapLoaded={false} />);
    
    // Should not add any markers or routes
    expect(mapboxgl.Marker).not.toHaveBeenCalled();
    expect(mockMap.addSource).not.toHaveBeenCalled();
  });

  it('adds markers and routes when map is loaded', async () => {
    render(<RouteLayer map={mockMap} routes={mockRoutes} mapLoaded={true} />);
    
    // Should create two markers (origin and destination)
    expect(mapboxgl.Marker).toHaveBeenCalledTimes(2);
    
    // First marker should be origin (black color)
    expect(mapboxgl.Marker).toHaveBeenCalledWith(
      expect.objectContaining({
        color: '#1A1F2C',
        scale: 0.7
      })
    );
    
    // Second marker should be destination (purple color)
    expect(mapboxgl.Marker).toHaveBeenCalledWith(
      expect.objectContaining({
        color: '#D946EF',
        scale: 0.7
      })
    );
    
    // Should add a source and layer for the route line
    expect(mockMap.addSource).toHaveBeenCalledWith(
      'route-0',
      expect.objectContaining({
        type: 'geojson',
        data: expect.objectContaining({
          type: 'Feature',
          geometry: expect.objectContaining({
            type: 'LineString',
            coordinates: [
              [36.990054, 1.2404475],
              [31.08848075, -17.80269125]
            ]
          })
        })
      })
    );
    
    expect(mockMap.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'route-0',
        type: 'line',
        source: 'route-0'
      })
    );
  });

  it('cleans up existing routes and markers before adding new ones', () => {
    // Mock existing layers and sources
    mockMap.getLayer.mockReturnValue(true);
    mockMap.getSource.mockReturnValue(true);
    
    // Mock document.getElementsByClassName to return mock markers
    const mockMarkers = [{remove: vi.fn()}, {remove: vi.fn()}];
    document.getElementsByClassName = vi.fn().mockReturnValue(mockMarkers);
    
    // First render to add routes
    const { rerender } = render(
      <RouteLayer map={mockMap} routes={mockRoutes} mapLoaded={true} />
    );
    
    // Re-render with same props to trigger cleanup
    rerender(<RouteLayer map={mockMap} routes={mockRoutes} mapLoaded={true} />);
    
    // Should remove existing markers
    expect(mockMarkers[0].remove).toHaveBeenCalled();
    expect(mockMarkers[1].remove).toHaveBeenCalled();
    
    // Should remove existing layers and sources
    expect(mockMap.removeLayer).toHaveBeenCalledWith('route-0');
    expect(mockMap.removeSource).toHaveBeenCalledWith('route-0');
  });

  it('handles errors gracefully when adding routes', () => {
    // Force an error when adding source
    mockMap.addSource.mockImplementation(() => {
      throw new Error('Test error');
    });
    
    render(<RouteLayer map={mockMap} routes={mockRoutes} mapLoaded={true} />);
    
    // Should log the error but not crash
    expect(console.error).toHaveBeenCalled();
  });
});
