
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import this to fix toBeInTheDocument errors
import MapBase from '../MapBase';

// Mock mapboxgl since it's not available in the test environment
vi.mock('mapbox-gl', () => {
  const addControl = vi.fn();
  const on = vi.fn();
  const easeTo = vi.fn();
  const getZoom = vi.fn().mockReturnValue(2);
  const getCenter = vi.fn().mockReturnValue({ lng: 0, lat: 0 });
  const setFog = vi.fn();
  const remove = vi.fn();
  
  return {
    default: {
      Map: vi.fn().mockImplementation(() => ({
        addControl,
        on,
        easeTo,
        getZoom,
        getCenter,
        setFog,
        remove,
        isStyleLoaded: () => true
      })),
      NavigationControl: vi.fn().mockImplementation(() => ({})),
      accessToken: ''
    }
  };
});

describe('MapBase Component', () => {
  // Mocks for refs
  beforeEach(() => {
    // Mock Element.getBoundingClientRect()
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 1000,
      height: 800,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => {}
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders a map container', () => {
    render(<MapBase />);
    // Find the map container by class name or role
    const mapContainer = document.querySelector('[class*="inset-0"]');
    expect(mapContainer).toBeInTheDocument();
  });

  it('calls onMapLoadedState when map style is loaded', () => {
    const mockOnMapLoadedState = vi.fn();
    render(<MapBase onMapLoadedState={mockOnMapLoadedState} />);
    
    // Since we're mocking, the map style loaded event would normally fire
    // and call onMapLoadedState. For testing, we can manually check if 
    // the style.load event has been listened for
    const mapboxMock = require('mapbox-gl').default;
    const mapInstance = mapboxMock.Map.mock.results[0].value;
    
    // Check that the on method was called with style.load
    expect(mapInstance.on).toHaveBeenCalledWith('style.load', expect.any(Function));
    
    // Manually call the style.load handler to simulate the event
    const styleLoadHandler = mapInstance.on.mock.calls.find(
      call => call[0] === 'style.load'
    )[1];
    
    styleLoadHandler();
    
    // Check if onMapLoadedState was called with true
    expect(mockOnMapLoadedState).toHaveBeenCalledWith(true);
  });

  it('renders children correctly', () => {
    render(
      <MapBase>
        <div data-testid="test-child">Test Child</div>
      </MapBase>
    );
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('handles function children correctly', () => {
    render(
      <MapBase>
        {(map, mapLoaded) => {
          return mapLoaded ? (
            <div data-testid="function-child">
              Function Child
            </div>
          ) : null;
        }}
      </MapBase>
    );
    
    // After style.load event, mapLoaded should be true
    const mapboxMock = require('mapbox-gl').default;
    const mapInstance = mapboxMock.Map.mock.results[0].value;
    
    // Find the style.load handler and call it
    const styleLoadHandler = mapInstance.on.mock.calls.find(
      call => call[0] === 'style.load'
    )[1];
    
    styleLoadHandler();
    
    // Check that the function child renders correctly
    expect(screen.getByTestId('function-child')).toBeInTheDocument();
  });
});
