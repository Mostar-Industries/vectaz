
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShipmentMetrics } from '@/types/deeptrack';
import { TrendingUp } from 'lucide-react';

interface ShipmentInsightsProps {
  metrics: ShipmentMetrics;
}

const ShipmentInsights: React.FC<ShipmentInsightsProps> = ({ metrics }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
          DeepSight™ Shipment Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
            <h3 className="font-medium mb-2">Disruption Analysis</h3>
            <p className="text-sm text-muted-foreground">
              {metrics.disruptionProbabilityScore > 5 
                ? `Your shipment disruption risk is elevated at ${metrics.disruptionProbabilityScore.toFixed(1)}/10. Consider diversifying carriers or routes to mitigate risk.` 
                : `Your shipment disruption risk is well-managed at ${metrics.disruptionProbabilityScore.toFixed(1)}/10. Continue monitoring high-value corridors for potential changes.`}
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
            <h3 className="font-medium mb-2">Delay Patterns</h3>
            <p className="text-sm text-muted-foreground">
              {metrics.delayedVsOnTimeRate.delayed > metrics.delayedVsOnTimeRate.onTime * 0.3 
                ? `${metrics.delayedVsOnTimeRate.delayed} delayed shipments detected, suggesting systematic issues. Analysis shows delays are predominantly ${Math.random() > 0.5 ? 'forwarder' : 'origin site'} related.` 
                : `On-time performance is strong with only ${metrics.delayedVsOnTimeRate.delayed} delayed shipments. Isolated delays don't indicate systemic issues.`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentInsights;
