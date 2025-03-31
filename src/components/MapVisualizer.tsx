
import React, { useState } from 'react';
import { Loader, Map as MapIcon } from 'lucide-react';
import MapBase from './map/MapBase';
import RouteLayer from './map/RouteLayer';
import MapControls from './map/MapControls';
import { Route } from './map/types';

export type { MapPoint } from './map/types';
export type { Route } from './map/types';

interface MapVisualizerProps {
  routes: Route[];
  isLoading?: boolean;
  dataSource?: string;
  validated?: boolean;
}

const MapVisualizer: React.FC<MapVisualizerProps> = ({
  routes,
  isLoading = false,
  dataSource = 'deeptrack_3.csv',
  validated = true
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-slate-900 h-full w-full">
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-8 w-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading map data...</p>
        </div>
      </div>
    );
  }

  if (!routes.length) {
    return (
      <div className="flex items-center justify-center bg-slate-900 h-full w-full">
        <div className="flex flex-col items-center gap-4">
          <MapIcon className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">No route data available</p>
        </div>
      </div>
    );
  }

  return (
    <MapBase isLoading={isLoading} onMapLoadedState={setMapLoaded}>
      {(map: mapboxgl.Map, mapLoaded: boolean) => (
        <RouteLayer map={map} routes={routes} mapLoaded={mapLoaded} />
      )}
      <MapControls 
        routesCount={routes.length} 
        dataSource={dataSource}
        validated={validated}
      />
    </MapBase>
  );
};

export default MapVisualizer;
