import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import this to fix toBeInTheDocument errors
import MapVisualizer from '../../MapVisualizer';
import { Route } from '../types';

// Mock the child components
vi.mock('../MapBase', () => ({
  default: ({ children, onMapLoadedState, isLoading }: any) => {
    // Call the onMapLoadedState callback
    if (onMapLoadedState) onMapLoadedState(true);
    
    // Handle function children
    const renderedChildren = typeof children === 'function' 
      ? children({ testProp: 'test' }, true)
      : Array.isArray(children)
        ? children.map((child: any, index: number) => 
            typeof child === 'function' 
              ? child({ testProp: 'test' }, true) 
              : child
          )
        : children;
        
    return (
      <div data-testid="map-base">
        {renderedChildren}
      </div>
    );
  }
}));

vi.mock('../RouteLayer', () => ({
  default: () => <div data-testid="route-layer">RouteLayer</div>
}));

vi.mock('../MapControls', () => ({
  default: ({ routesCount, dataSource, validated }: any) => (
    <div data-testid="map-controls">
      <span>Routes: {routesCount}</span>
      <span>Source: {dataSource}</span>
      <span>Validated: {validated ? 'Yes' : 'No'}</span>
    </div>
  )
}));

describe('MapVisualizer Component', () => {
  const sampleRoutes: Route[] = [
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

  it('shows loading state when isLoading is true', () => {
    render(<MapVisualizer routes={sampleRoutes} isLoading={true} />);
    expect(screen.getByText('Loading map data...')).toBeInTheDocument();
  });

  it('shows empty state when no routes are provided', () => {
    render(<MapVisualizer routes={[]} />);
    expect(screen.getByText('No route data available')).toBeInTheDocument();
  });

  it('renders all map components when routes are provided', () => {
    render(
      <MapVisualizer 
        routes={sampleRoutes} 
        dataSource="test.csv" 
        validated={true} 
      />
    );
    
    expect(screen.getByTestId('map-base')).toBeInTheDocument();
    expect(screen.getByTestId('route-layer')).toBeInTheDocument();
    expect(screen.getByTestId('map-controls')).toBeInTheDocument();
    expect(screen.getByText('Routes: 1')).toBeInTheDocument();
    expect(screen.getByText('Source: test.csv')).toBeInTheDocument();
    expect(screen.getByText('Validated: Yes')).toBeInTheDocument();
  });

  it('passes correct props to child components', () => {
    render(
      <MapVisualizer 
        routes={sampleRoutes} 
        dataSource="another_test.csv" 
        validated={false} 
      />
    );
    
    expect(screen.getByText('Routes: 1')).toBeInTheDocument();
    expect(screen.getByText('Source: another_test.csv')).toBeInTheDocument();
    expect(screen.getByText('Validated: No')).toBeInTheDocument();
  });
});
