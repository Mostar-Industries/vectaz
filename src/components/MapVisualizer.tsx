
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Package, MapPin, Shield, Zap } from 'lucide-react';
import MapContainer from './map/MapContainer';
import StatsOverlay from './map/StatsOverlay';
import ShipmentHologram from './map/ShipmentHologram';
import { Route } from '@/types/deeptrack';
import './map/map-styles.css';

interface MapVisualizerProps {
  routes: Route[];
  isLoading?: boolean;
  className?: string;
}

const MapVisualizer: React.FC<MapVisualizerProps> = ({ routes, isLoading = false, className }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeRoute, setActiveRoute] = useState<number | null>(null);
  const mapContainerRef = useRef<any>(null);

  const handleMapLoaded = () => {
    setMapLoaded(true);
  };

  const handleRouteClick = (routeIndex: number | null) => {
    setActiveRoute(routeIndex);
    
    if (routeIndex !== null) {
      // Show info on the map for the selected route
      showRouteInfoOnMap(routes[routeIndex], routeIndex);
    }
  };
  
  const showRouteInfoOnMap = (route: Route, index: number) => {
    const { origin, destination, weight, deliveryStatus } = route;
    
    // Generate a random risk score between 1-10
    const riskScore = Math.floor(Math.random() * 10) + 1;
    const resilienceScore = Math.floor(Math.random() * 30) + 70;
    
    // Create HTML content for the popup
    const popupContent = `
      <div class="route-info p-2">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-bold text-cyber-blue flex items-center">
            <span>Route Details</span>
          </h3>
          <span class="${
            deliveryStatus === 'Delivered' ? 'text-green-400' : 
            deliveryStatus === 'In Transit' ? 'text-amber-400' : 'text-red-400'
          } text-xs font-medium">${deliveryStatus}</span>
        </div>
        
        <div class="space-y-1.5 text-sm">
          <div>
            <span class="text-muted-foreground">Origin:</span> ${origin.name}
          </div>
          <div>
            <span class="text-muted-foreground">Destination:</span> ${destination.name}
          </div>
          <div>
            <span class="text-muted-foreground">Shipment:</span> #${1000 + index}
          </div>
          <div>
            <span class="text-muted-foreground">Total Weight:</span> ${weight} kg
          </div>
          
          <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-xs pt-2 border-t border-blue-500/10">
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
          
          <div class="pt-2 flex items-center ${riskScore > 7 ? 'text-red-400' : 'text-amber-500'}">
            <span class="text-xs mr-1">▲</span>
            <span class="text-xs">
              ${riskScore > 7 ? 'High' : riskScore > 4 ? 'Medium' : 'Low'} risk level on this route
            </span>
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

  return (
    <div className={cn("relative h-full w-full", className)}>
      <MapContainer 
        routes={routes} 
        isLoading={isLoading} 
        onMapLoaded={handleMapLoaded}
        onRouteClick={handleRouteClick}
        ref={mapContainerRef}
      />
      
      {mapLoaded && routes.length > 0 && (
        <>
          {/* Holographic shipment list */}
          <ShipmentHologram 
            shipments={routes}
            onSelect={handleShipmentSelect}
            className="absolute top-4 right-4 w-80"
          />
          
          {/* Stats overlay */}
          <StatsOverlay routesCount={routes.length} />
        </>
      )}
    </div>
  );
};

export default MapVisualizer;
