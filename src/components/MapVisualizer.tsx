
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Package, MapPin, Shield, Zap, Ship, AlertTriangle } from 'lucide-react';
import MapContainer from './map/MapContainer';
import StatsOverlay from './map/StatsOverlay';
import ShipmentHologram from './map/ShipmentHologram';
import { Route } from '@/types/deeptrack';
import './map/map-styles.css';
import { useToast } from '@/hooks/use-toast';
import { getDestinationMarkers, getRandomStatus } from '@/utils/mapUtils';

interface MapVisualizerProps {
  routes: Route[];
  isLoading?: boolean;
  className?: string;
}

const MapVisualizer: React.FC<MapVisualizerProps> = ({ routes, isLoading = false, className }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeRoute, setActiveRoute] = useState<number | null>(null);
  const [is3DMode, setIs3DMode] = useState(false);
  const [countryMarkers, setCountryMarkers] = useState<Array<{
    name: string;
    coordinates: [number, number];
    status: string;
  }>>([]);
  const mapContainerRef = useRef<any>(null);
  const { toast } = useToast();
  
  // Load country markers on component mount
  useEffect(() => {
    const markers = getDestinationMarkers().map(country => ({
      ...country,
      status: getRandomStatus()
    }));
    setCountryMarkers(markers);
  }, []);

  // Limit to only 3 most recent routes
  const limitedRoutes = routes.slice(0, 3);

  const handleMapLoaded = () => {
    setMapLoaded(true);
    
    // Welcome toast with instructions
    toast({
      title: "Map Loaded",
      description: "Tap to rotate the globe and explore destination countries.",
      duration: 5000,
    });
  };

  const handleRouteClick = (routeIndex: number | null) => {
    setActiveRoute(routeIndex);
    
    if (routeIndex !== null) {
      // Show info on the map for the selected route
      showRouteInfoOnMap(limitedRoutes[routeIndex], routeIndex);
    }
  };
  
  const handleCountryClick = (countryName: string) => {
    toast({
      title: `${countryName} Selected`,
      description: `Viewing destination country: ${countryName}`,
      duration: 3000,
    });
  };
  
  const showRouteInfoOnMap = (route: Route, index: number) => {
    const { origin, destination, weight, deliveryStatus } = route;
    
    // Generate a random risk score between 1-10
    const riskScore = Math.floor(Math.random() * 10) + 1;
    const resilienceScore = Math.floor(Math.random() * 30) + 70;
    
    // Add witty commentary based on status
    let statusComment = '';
    if (deliveryStatus === 'Delivered') {
      statusComment = 'Right on schedule. Someone deserves a raise.';
    } else if (deliveryStatus === 'In Transit') {
      statusComment = 'Somewhere between here and there. Probably.';
    } else {
      statusComment = 'This package has seen more countries than Anthony Bourdain. Status: Lost in transit.';
    }
    
    // Create HTML content for the popup with enhanced styling
    const popupContent = `
      <div class="route-info p-3">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-bold text-[#00FFD1] flex items-center">
            <span>Route Details</span>
          </h3>
          <span class="${
            deliveryStatus === 'Delivered' ? 'text-green-400' : 
            deliveryStatus === 'In Transit' ? 'text-amber-400' : 'text-red-400'
          } text-xs font-medium flex items-center">
            <span class="mr-1">${deliveryStatus}</span>
            ${deliveryStatus !== 'Delivered' ? '<span class="error-flicker">●</span>' : ''}
          </span>
        </div>
        
        <div class="space-y-2 text-sm">
          <div>
            <span class="text-gray-400">Origin:</span> ${origin.name}
          </div>
          <div>
            <span class="text-gray-400">Destination:</span> ${destination.name}
          </div>
          <div>
            <span class="text-gray-400">Shipment:</span> #${1000 + index}
          </div>
          <div>
            <span class="text-gray-400">Total Weight:</span> ${weight} kg
          </div>
          
          <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-xs pt-2 border-t border-[#00FFD1]/10">
            <div class="flex items-center">
              <span class="text-green-400 mr-1">⦿</span>
              <span class="text-gray-400">Resilience:</span>
              <span class="ml-1 text-green-400">${resilienceScore}%</span>
            </div>
            <div class="flex items-center">
              <span class="text-yellow-400 mr-1">⚡</span>
              <span class="text-gray-400">Risk:</span>
              <span class="ml-1 ${riskScore > 7 ? 'text-red-400' : riskScore > 4 ? 'text-amber-400' : 'text-green-400'}">
                ${riskScore}/10
              </span>
            </div>
          </div>
          
          <div class="pt-2 text-xs italic text-gray-300">
            "${statusComment}"
          </div>
        </div>
      </div>
    `;
    
    // Jump to the location
    mapContainerRef.current.jumpToLocation(destination.lat, destination.lng, destination.name);
    
    // Show info popup at the location
    mapContainerRef.current.showInfoAtLocation(destination.lat, destination.lng, popupContent);
  };

  const handleJumpToLocation = (lat: number, lng: number, name: string) => {
    // Access the map instance's jumpToLocation method through ref
    if (mapContainerRef.current?.jumpToLocation) {
      mapContainerRef.current.jumpToLocation(lat, lng, name);
    }
  };

  const handleShipmentSelect = (shipment: Route, index: number) => {
    // When a shipment is selected, show its info on the map
    showRouteInfoOnMap(shipment, index);
    
    // Also set the active route
    setActiveRoute(index);
  };

  const toggle3DMode = () => {
    setIs3DMode(!is3DMode);
    if (mapContainerRef.current?.toggleTerrain) {
      mapContainerRef.current.toggleTerrain(!is3DMode);
      
      toast({
        title: is3DMode? "2D Mode" : "3D Terrain View",
        description: is3DMode? "Switched to flat map view": "Behold your empire in 3D glory!",
        duration: 2000,
      });
    }
  };

  return (
    <div className={cn("relative h-full w-full", className)}>
      <MapContainer 
        routes={limitedRoutes} 
        countries={countryMarkers}
        isLoading={isLoading} 
        onMapLoaded={handleMapLoaded}
        onRouteClick={handleRouteClick}
        onCountryClick={handleCountryClick}
        ref={mapContainerRef}
      />
      
      {mapLoaded && (
        <>
          {/* Repositioned holographic shipment list to center-right */}
          {limitedRoutes.length > 0 && (
            <ShipmentHologram 
              shipments={limitedRoutes}
              onSelect={handleShipmentSelect}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 w-80 max-h-[500px]"
            />
          )}
          
          {/* Stats overlay - now positioned by StatsOverlay component */}
          <StatsOverlay routesCount={limitedRoutes.length} />
          
          {/* 3D mode toggle */}
          <button
            onClick={toggle3DMode}
            className="absolute bottom-24 right-4 glass-panel p-2 flex items-center space-x-2 text-xs text-[#00FFD1] hover:bg-[#00FFD1]/10 transition-colors"
          >
            <Ship size={16} className="text-[#00FFD1]" />
            <span>{is3DMode ? "2D View" : "3D View"}</span>
          </button>
          
          {/* Map legend */}
          <div className="absolute bottom-4 left-4 glass-panel p-3 text-xs">
            <div className="text-white mb-2 font-semibold">Status Legend</div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-green-400"></span>
              <span className="text-gray-200">On Time</span>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <span className="text-gray-200">In Transit</span>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-red-400 error-flicker"></span>
              <span className="text-gray-200">Delayed</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-blue-400"></span>
              <span className="text-gray-200">Destination</span>
            </div>
          </div>
          
          {/* Country count indicator */}
          <div className="absolute top-4 left-4 glass-panel p-2 text-xs">
            <div className="text-[#00FFD1] font-semibold flex items-center">
              <MapPin size={14} className="mr-1" />
              {countryMarkers.length} Destination Countries
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MapVisualizer;
