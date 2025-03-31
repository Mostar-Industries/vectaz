
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShipmentMetrics, CountryPerformance } from '@/types/deeptrack';
import { Package, Clock, AlertTriangle, Shield } from 'lucide-react';
import ShipmentResilienceChart from './shipment/ShipmentResilienceChart';
import ShipmentModeChart from './shipment/ShipmentModeChart';

interface OverviewContentProps {
  shipmentMetrics: ShipmentMetrics;
  countryPerformance: CountryPerformance[];
}

const OverviewContent: React.FC<OverviewContentProps> = ({
  shipmentMetrics,
  countryPerformance
}) => {
  return (
    <div className="space-y-6">
      {/* Metrics Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Package className="h-4 w-4 mr-2 text-primary" />
              Total Shipments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shipmentMetrics.totalShipments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all origins and destinations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-amber-500" />
              Avg Transit Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shipmentMetrics.avgTransitTime.toFixed(1)} days</div>
            <p className="text-xs text-muted-foreground mt-1">
              From collection to delivery
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
              Disruption Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shipmentMetrics.disruptionProbabilityScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Risk index (0-10)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Shield className="h-4 w-4 mr-2 text-green-500" />
              Resilience Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shipmentMetrics.resilienceScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ability to overcome disruptions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visualization Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-border/30 shadow-sm hover:border-border/50 transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold">Resilience Analysis</CardTitle>
            <CardDescription>Key resilience metrics visualization</CardDescription>
          </CardHeader>
          <CardContent className="px-0 py-0">
            <div className="h-[360px]">
              <ShipmentResilienceChart metrics={shipmentMetrics} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-border/30 shadow-sm hover:border-border/50 transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold">Shipment Mode Distribution</CardTitle>
            <CardDescription>Breakdown by transportation mode</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <div className="h-[360px]">
              <ShipmentModeChart shipmentsByMode={shipmentMetrics.shipmentsByMode} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewContent;
