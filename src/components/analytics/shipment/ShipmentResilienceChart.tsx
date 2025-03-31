
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Shield } from 'lucide-react';

interface ShipmentResilienceChartProps {
  metrics: ShipmentMetrics;
}

const ShipmentResilienceChart: React.FC<ShipmentResilienceChartProps> = ({ metrics }) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-500" />
          Shipment Resilience Metrics
        </CardTitle>
        <CardDescription>Radar analysis of resilience indicators</CardDescription>
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
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentResilienceChart;
