
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
        <Card className="glassmorphism-card border-mostar-light-blue/20 hover:border-mostar-light-blue/40 hover:shadow-neon-blue transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-cyber-blue">
              <Package className="h-4 w-4 mr-2 text-mostar-light-blue" />
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

        <Card className="glassmorphism-card border-mostar-cyan/20 hover:border-mostar-cyan/40 hover:shadow-neon-cyan transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-mostar-cyan">
              <Clock className="h-4 w-4 mr-2 text-mostar-cyan" />
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

        <Card className="glassmorphism-card-magenta border-mostar-magenta/20 hover:border-mostar-magenta/40 hover:shadow-neon-magenta transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-cyber-magenta">
              <AlertTriangle className="h-4 w-4 mr-2 text-mostar-magenta" />
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

        <Card className="glassmorphism-card-green border-mostar-green/20 hover:border-mostar-green/40 hover:shadow-neon-green transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-cyber-green">
              <Shield className="h-4 w-4 mr-2 text-mostar-green" />
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
        <div className="cyber-panel rounded-md overflow-hidden border border-mostar-light-blue/20 hover:border-mostar-light-blue/40 transition-all duration-300">
          <div className="p-4">
            <h3 className="text-xl font-semibold text-cyber-blue">Resilience Analysis</h3>
            <p className="text-sm text-muted-foreground">Key resilience metrics visualization</p>
          </div>
          <div className="h-[360px]">
            <ShipmentResilienceChart metrics={shipmentMetrics} />
          </div>
        </div>
        
        <div className="cyber-panel rounded-md overflow-hidden border border-mostar-light-blue/20 hover:border-mostar-light-blue/40 transition-all duration-300">
          <div className="p-4">
            <h3 className="text-xl font-semibold text-cyber-blue">Shipment Mode Distribution</h3>
            <p className="text-sm text-muted-foreground">Breakdown by transportation mode</p>
          </div>
          <div className="h-[360px]">
            <ShipmentModeChart shipmentsByMode={shipmentMetrics.shipmentsByMode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewContent;
