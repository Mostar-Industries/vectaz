
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShipmentMetrics } from '@/types/deeptrack';
import { Package, Clock, AlertTriangle, Shield } from 'lucide-react';

interface ShipmentMetricsCardsProps {
  metrics: ShipmentMetrics;
}

const ShipmentMetricsCards: React.FC<ShipmentMetricsCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-[29px] my-0 py-px mx-0">
      <Card className="px-0 mx-0 py-0 my-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Package className="h-4 w-4 mr-2 text-primary" />
            Total Shipments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalShipments}</div>
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
          <div className="text-2xl font-bold">{metrics.avgTransitTime.toFixed(1)} days</div>
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
          <div className="text-2xl font-bold">{metrics.disruptionProbabilityScore.toFixed(1)}</div>
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
          <div className="text-2xl font-bold">{metrics.resilienceScore.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Ability to overcome disruptions
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentMetricsCards;
