
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ShipmentMetrics } from '@/types/deeptrack';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Shield, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getExplanation } from '@/services/deepSightNarrator';
import DeepExplainModal from '../DeepExplainModal';

interface ShipmentResilienceChartProps {
  metrics: ShipmentMetrics;
}

const ShipmentResilienceChart: React.FC<ShipmentResilienceChartProps> = ({ metrics }) => {
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  
  // Calculate normalized values (0-100 scale) for radar chart
  const resilienceScore = metrics.resilienceScore;
  const onTimeRate = metrics.delayedVsOnTimeRate.onTime / 
    (metrics.delayedVsOnTimeRate.onTime + metrics.delayedVsOnTimeRate.delayed) * 100 || 0;
  const disruptionResistance = Math.max(0, 100 - (metrics.disruptionProbabilityScore * 10));
  const quoteAvailability = (1 - metrics.noQuoteRatio) * 100;
  const completionRate = metrics.shipmentStatusCounts.completed / 
    (metrics.totalShipments || 1) * 100;

  // Prepare data for radar chart
  const radarData = [
    {
      subject: 'Resilience',
      A: resilienceScore,
      fullMark: 100,
    },
    {
      subject: 'On-Time Rate',
      A: onTimeRate,
      fullMark: 100,
    },
    {
      subject: 'Disruption Resistance',
      A: disruptionResistance,
      fullMark: 100,
    },
    {
      subject: 'Quote Availability',
      A: quoteAvailability,
      fullMark: 100,
    },
    {
      subject: 'Completion Rate',
      A: completionRate,
      fullMark: 100,
    },
  ];

  // Calculate the overall network health score
  const networkHealthScore = (
    resilienceScore * 0.25 + 
    onTimeRate * 0.25 + 
    disruptionResistance * 0.2 + 
    quoteAvailability * 0.15 + 
    completionRate * 0.15
  );
  
  // Determine the health status
  const healthStatus = 
    networkHealthScore >= 75 ? 'Robust' :
    networkHealthScore >= 60 ? 'Stable' :
    networkHealthScore >= 40 ? 'Vulnerable' : 'Critical';
  
  // Color based on health status
  const statusColor = 
    networkHealthScore >= 75 ? 'text-green-600 bg-green-50 border-green-200' :
    networkHealthScore >= 60 ? 'text-blue-600 bg-blue-50 border-blue-200' :
    networkHealthScore >= 40 ? 'text-amber-600 bg-amber-50 border-amber-200' : 
                              'text-red-600 bg-red-50 border-red-200';
  
  // Get resilience explanation
  const resilienceExplanation = getExplanation('resilience_score', metrics);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Shipment Network Resilience
            </CardTitle>
            <CardDescription>Multi-dimensional analysis of supply chain stability</CardDescription>
          </div>
          
          <Badge className={`${statusColor} px-2 py-1`}>
            {healthStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Resilience Metrics"
                dataKey="A"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
              <Tooltip formatter={(value) => [typeof value === 'number' ? `${value.toFixed(1)}%` : value, 'Value']} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 pb-1">
        <div className="text-sm">
          <span className="font-medium">Network Health: </span>
          <span className="font-bold">{networkHealthScore.toFixed(1)}</span>
          {networkHealthScore < 60 && (
            <div className="flex items-center gap-1 text-amber-600 mt-1 text-xs">
              <AlertTriangle className="h-3.5 w-3.5" /> 
              Risk indicators present
            </div>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setExplainModalOpen(true)}
        >
          <Info className="h-4 w-4 mr-1" /> 
          Explain This Analysis
        </Button>
      </CardFooter>
      
      <DeepExplainModal
        open={explainModalOpen}
        onOpenChange={setExplainModalOpen}
        explanation={resilienceExplanation}
      />
    </Card>
  );
};

export default ShipmentResilienceChart;
