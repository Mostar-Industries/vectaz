
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Package, MapPin, Shield, Zap, Ship, AlertTriangle } from 'lucide-react';
import MapContainer from './map/MapContainer';
import StatsOverlay from './map/StatsOverlay';
import ShipmentHologram from './map/ShipmentHologram';
import { Route } from '@/types/deeptrack';
import './map/map-styles.css';
import { useToast } from '@/hooks/use-toast';

interface MapVisualizerProps {
  routes: Route[];
  isLoading?: boolean;
  className?: string;
}

const MapVisualizer: React.FC<MapVisualizerProps> = ({ routes, isLoading = false, className }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeRoute, setActiveRoute] = useState<number | null>(null);
  const [is3DMode, setIs3DMode] = useState(false);
  const mapContainerRef = useRef<any>(null);
  const { toast } = useToast();

  const handleMapLoaded = () => {
    setMapLoaded(true);
    
    // Welcome toast with instructions
    toast({
      title: "Map Loaded",
      description: "Tap to rotate the globe and behold your empire.",
      duration: 5000,
    });
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
        title: is3DMode ? "2D Mode" : "3D Terrain View",
        description: is3DMode ? "Switched to flat map view" : "Behold your empire in 3D glory!",
        duration: 2000,
      });
    }
  };

  // Generate random data flow lines for visual effect
  useEffect(() => {
    if (!mapLoaded) return;
    
    const container = document.querySelector('.map-container');
    if (!container) return;
    
    const dataFlow = document.createElement('div');
    dataFlow.className = 'data-flow';
    container.appendChild(dataFlow);
    
    // Create random data streams
    for (let i = 0; i < 20; i++) {
      const stream = document.createElement('div');
      stream.className = 'data-stream';
      stream.style.left = `${Math.random() * 100}%`;
      stream.style.animationDelay = `${Math.random() * 3}s`;
      stream.style.height = `${30 + Math.random() * 70}px`;
      dataFlow.appendChild(stream);
    }
    
    return () => {
      if (dataFlow.parentNode) {
        dataFlow.parentNode.removeChild(dataFlow);
      }
    };
  }, [mapLoaded]);

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
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-400 error-flicker"></span>
              <span className="text-gray-200">Delayed</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MapVisualizer;
