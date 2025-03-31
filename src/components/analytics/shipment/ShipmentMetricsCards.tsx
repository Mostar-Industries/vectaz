
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShipmentMetrics } from '@/types/deeptrack';
import { Package, Clock, AlertTriangle, Shield, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DeepExplainModal from '../DeepExplainModal';
import { explainShipmentMetrics } from '@/services/deepSightNarrator';

interface ShipmentMetricsCardsProps {
  metrics: ShipmentMetrics;
}

const ShipmentMetricsCards: React.FC<ShipmentMetricsCardsProps> = ({ metrics }) => {
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [currentMetricKey, setCurrentMetricKey] = useState<string>('');
  
  const handleExplainClick = (metricKey: string) => {
    setCurrentMetricKey(metricKey);
    setExplainModalOpen(true);
  };
  
  const currentExplanation = currentMetricKey ? 
    explainShipmentMetrics(currentMetricKey) : undefined;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-[29px] my-0 py-px mx-0">
        <Card className="px-0 mx-0 py-0 my-0 relative group">
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
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleExplainClick('shipment_total')}
            >
              <Info className="h-3.5 w-3.5" />
              <span className="sr-only">Explain</span>
            </Button>
          </CardContent>
        </Card>

        <Card className="relative group">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-amber-500" />
              Avg Transit Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgTransitTime.toFixed(1)} days</div>
            <div className="flex justify-between items-end">
              <p className="text-xs text-muted-foreground mt-1">
                From collection to delivery
              </p>
              {metrics.avgTransitTime > 6 && (
                <span className="text-xs text-amber-600 font-medium">
                  ↗ Above target
                </span>
              )}
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleExplainClick('transit_time')}
            >
              <Info className="h-3.5 w-3.5" />
              <span className="sr-only">Explain</span>
            </Button>
          </CardContent>
        </Card>

        <Card className="relative group">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
              Disruption Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.disruptionProbabilityScore.toFixed(1)}</div>
            <div className="flex justify-between items-end">
              <p className="text-xs text-muted-foreground mt-1">
                Risk index (0-10)
              </p>
              <span className={`text-xs font-medium ${
                metrics.disruptionProbabilityScore > 7 ? 'text-red-600' : 
                metrics.disruptionProbabilityScore > 4 ? 'text-amber-600' : 'text-green-600'
              }`}>
                {metrics.disruptionProbabilityScore > 7 ? 'High' : 
                 metrics.disruptionProbabilityScore > 4 ? 'Moderate' : 'Low'} Risk
              </span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleExplainClick('disruption_score')}
            >
              <Info className="h-3.5 w-3.5" />
              <span className="sr-only">Explain</span>
            </Button>
          </CardContent>
        </Card>

        <Card className="relative group">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Shield className="h-4 w-4 mr-2 text-green-500" />
              Resilience Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.resilienceScore.toFixed(1)}</div>
            <div className="flex justify-between items-end">
              <p className="text-xs text-muted-foreground mt-1">
                Ability to overcome disruptions
              </p>
              <span className={`text-xs font-medium ${
                metrics.resilienceScore > 75 ? 'text-green-600' : 
                metrics.resilienceScore > 50 ? 'text-amber-600' : 'text-red-600'
              }`}>
                {metrics.resilienceScore > 75 ? 'Strong' : 
                 metrics.resilienceScore > 50 ? 'Moderate' : 'Weak'}
              </span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleExplainClick('resilience_score')}
            >
              <Info className="h-3.5 w-3.5" />
              <span className="sr-only">Explain</span>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <DeepExplainModal
        open={explainModalOpen}
        onOpenChange={setExplainModalOpen}
        metricKey={currentMetricKey}
        explanation={currentExplanation}
      />
    </>
  );
};

export default ShipmentMetricsCards;
